import BorderBox from "@/components/BorderBox";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./styles.module.css";
import { useEffect, useMemo, useState } from "react";
import Search from "@/components/Search";
import clsx from "clsx";
import moment from "moment";
import AuthGuard from "@/components/AuthGuard";
import { FcViewDetails } from "react-icons/fc";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    getAllClass,
    getSubjectsFollowUser,
    messageClear,
    registerTC,
} from "@/store/reducer/creditRegistrationReducer";
import { getListActiveTimeStudent } from "@/store/reducer/activateTimeReducer";
import { TypographyBody } from "@/components/TypographyBody";
import { Calendar, momentLocalizer } from "react-big-calendar";
import ModalConfirm from "@/components/ModalConfirm";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { lessonTimeMap } from "@/constants/lession";
import { Span } from "next/dist/trace";
import { getCurrentSemesterAndSchoolYear } from "@/constants/constants";

moment.updateLocale("en", {
    week: {
        dow: 1,
    },
});
const localizer = momentLocalizer(moment);

function getRandomColor() {
    const palette = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
    return palette[Math.floor(Math.random() * palette.length)];
}

const CustomEventComponent = ({ event }: { event: any }) => (
    <div style={{ whiteSpace: "normal" }}>
        <div>{event.subjectName}</div>
        <div>
            GV: {event.lecturerId} - {event.lecturerName}
        </div>
        {event.ltLesson && (
            <div>
                - LT: Tiết {event.ltLesson}, Phòng {event.ltClassroom}
                <br />
                Ngày: {event.ltDate}
            </div>
        )}
        {event.thLesson && (
            <div>
                - TH: Tiết {event.thLesson}, Phòng {event.thClassroom}
                <br />
                Ngày: {event.thDate}
            </div>
        )}
    </div>
);

function generateEventsFromAPI(data: any[]) {
    const events: any[] = [];
    const referenceDate = moment().startOf("week").add(1, "day");

    data.forEach((item) => {
        const subjectName = item.subject?.subjectName;
        const lecturerId = item.lecturer?.lecturerId;
        const lecturerName = item.lecturer?.lecturerName || "//TO DO";
        const scheduleDetails = item.scheduleRequest?.scheduleDetails || [];

        const ltDetail = scheduleDetails.find(
            (d: any) => d.class_type === "LT"
        );
        const thDetail = scheduleDetails.find(
            (d: any) => d.class_type === "TH"
        );

        const createEvent = (detail: any) => {
            const { lesson, date_time, classroom_id } = detail;
            const [startLesson, endLesson] = lesson.split("-").map(Number);
            const originalDay = moment(date_time).day();
            const eventDate = moment(referenceDate).day(
                originalDay === 0 ? 7 : originalDay
            );

            const startTime = moment(
                `${eventDate.format("YYYY-MM-DD")} ${
                    lessonTimeMap[startLesson].start
                }`,
                "YYYY-MM-DD HH:mm"
            );
            const endTime = moment(
                `${eventDate.format("YYYY-MM-DD")} ${
                    lessonTimeMap[endLesson].end
                }`,
                "YYYY-MM-DD HH:mm"
            );

            let content = `${subjectName}\nGV: ${lecturerId} - ${lecturerName}\n`;
            if (ltDetail) {
                content += `- Lý thuyết: Tiết ${ltDetail.lesson}, Phòng ${
                    ltDetail.classroom_id
                }\nNgày bắt đầu: ${moment(ltDetail.date_time).format(
                    "DD/MM/YYYY"
                )}`;
            }
            if (thDetail && thDetail !== ltDetail) {
                content += `\n- Thực hành: Tiết ${thDetail.lesson}, Phòng ${
                    thDetail.classroom_id
                }\nNgày bắt đầu: ${moment(thDetail.date_time).format(
                    "DD/MM/YYYY"
                )}`;
            }

            events.push({
                title: content,
                start: startTime.toDate(),
                end: endTime.toDate(),
                allDay: false,
                color: getRandomColor(),
                subjectName,
                lecturerId,
                lecturerName,
                ltLesson: ltDetail?.lesson,
                ltClassroom: ltDetail?.classroom_id,
                ltDate: ltDetail
                    ? moment(ltDetail.date_time).format("DD/MM/YYYY")
                    : undefined,
                thLesson: thDetail?.lesson,
                thClassroom: thDetail?.classroom_id,
                thDate: thDetail
                    ? moment(thDetail.date_time).format("DD/MM/YYYY")
                    : undefined,
                originalClass: item,
            });
        };

        if (ltDetail) createEvent(ltDetail);
        else if (thDetail) createEvent(thDetail);
    });

    return events;
}

const ClassRegistration = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subjects, successMessage, errorMessage, allClassRegis } =
        useSelector((state: RootState) => state.creditRegistration);

    const { activeTimeStudents } = useSelector(
        (state: RootState) => state.activateTime
    );

    const [activeTab, setActiveTab] = useState<"bySubject" | "bySemester">(
        "bySemester"
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(getSubjectsFollowUser());
        dispatch(getListActiveTimeStudent());
    }, []);

    useEffect(() => {
        const { semester, schoolyear } = getCurrentSemesterAndSchoolYear();
        console.log(semester);
        dispatch(
            getAllClass({
                semester: semester,
                schoolyear: schoolyear,
            })
        );
    }, [dispatch]);

    const filterSubjectsBySearchValue = () => {
        if (!searchValue.trim()) return subjects;

        const lowerKeyword = searchValue.toLowerCase();
        return subjects.filter((cls) => {
            const name = cls.subject?.subjectName?.toLowerCase() || "";
            const id = cls.subject?.subjectId?.toString() || "";
            return name.includes(lowerKeyword) || id.includes(lowerKeyword);
        });
    };

    const checkTimes = activeTimeStudents.find(
        (item) => item.status === "active"
    );
    let isInActiveTime = false;
    if (checkTimes) {
        const now = new Date();
        const start = new Date(checkTimes.startDate);
        const end = new Date(checkTimes.endDate);
        isInActiveTime = now >= start && now <= end;
    }

    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const events = useMemo(
        () => generateEventsFromAPI(allClassRegis),
        [allClassRegis]
    );

    const message = selectedClass ? (
        <div style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            <span>selectedClass.classStudentId</span>
            <div>{selectedClass.subject?.subjectName}</div>
            <div>
                GV: {selectedClass.lecturer?.lecturerId} -{" "}
                {selectedClass.lecturer?.lecturerName || "//TO DO"}
            </div>
            <div>
                - Lý thuyết:&nbsp;
                {selectedClass.scheduleRequest?.scheduleDetails
                    .filter((d: any) => d.class_type === "LT")
                    .map(
                        (d: any) =>
                            `Tiết ${d.lesson}, Phòng ${
                                d.classroom_id
                            }, Ngày bắt đầu: ${moment(d.date_time).format(
                                "DD/MM/YYYY"
                            )}`
                    )
                    .join("; ")}
            </div>
            {selectedClass.scheduleRequest?.scheduleDetails?.some(
                (d: any) => d.class_type === "TH"
            ) && (
                <div>
                    - Thực hành:&nbsp;
                    {selectedClass.scheduleRequest.scheduleDetails
                        .filter((d: any) => d.class_type === "TH")
                        .map(
                            (d: any) =>
                                `Tiết ${d.lesson}, Phòng ${
                                    d.classroom_id
                                }, Ngày bắt đầu: ${moment(d.date_time).format(
                                    "DD/MM/YYYY"
                                )}`
                        )
                        .join("; ")}
                </div>
            )}
        </div>
    ) : (
        "Bạn muốn đăng ký lớp này?"
    );

    console.log(allClassRegis);

    console.log("events: ", events);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <div className={styles.tabWrapper}>
                <button
                    className={clsx(styles.tabButton, {
                        [styles.activeTab]: activeTab === "bySemester",
                    })}
                    onClick={() => setActiveTab("bySemester")}
                >
                    Tất cả
                </button>
                <button
                    className={clsx(styles.tabButton, {
                        [styles.activeTab]: activeTab === "bySubject",
                    })}
                    onClick={() => setActiveTab("bySubject")}
                >
                    Tìm lớp theo môn học
                </button>
            </div>

            <BorderBox title="Đăng ký tín chỉ - Các lớp đang mở">
                {isInActiveTime ? (
                    <>
                        {activeTab === "bySemester" && (
                            <>
                                <div className={styles.calendarWrapper}>
                                    <Calendar
                                        className={styles.calendar}
                                        localizer={localizer}
                                        formats={{
                                            dayFormat: (date, culture, loc) =>
                                                loc?.format(
                                                    date,
                                                    "dddd",
                                                    culture
                                                ) || "",
                                        }}
                                        events={events}
                                        startAccessor="start"
                                        endAccessor="end"
                                        defaultView="week"
                                        views={["week"]}
                                        timeslots={1}
                                        step={60}
                                        min={moment()
                                            .set({ hour: 6, minute: 0 })
                                            .toDate()}
                                        max={moment()
                                            .set({ hour: 22, minute: 0 })
                                            .toDate()}
                                        style={{ height: "75vh" }}
                                        eventPropGetter={(event) => ({
                                            style: {
                                                backgroundColor: event.color,
                                                color: "white",
                                                borderRadius: "4px",
                                                padding: "4px",
                                                border: "none",
                                            },
                                        })}
                                        onSelectEvent={(event) => {
                                            setSelectedClass(
                                                event.originalClass
                                            );
                                            setIsModalOpen(true);
                                        }}
                                        components={{
                                            event: CustomEventComponent,
                                        }}
                                    />
                                </div>

                                {isModalOpen && selectedClass && (
                                    <ModalConfirm
                                        confirmText="đăng ký học"
                                        buttonText="Đăng ký"
                                        message={message}
                                        onConfirm={() => {
                                            dispatch(
                                                registerTC({
                                                    classStudentId:
                                                        selectedClass.classStudentId,
                                                    status: "success",
                                                })
                                            );
                                            setIsModalOpen(false);
                                        }}
                                        onCancel={() => {
                                            setIsModalOpen(false);
                                            setSelectedClass(null);
                                        }}
                                    />
                                )}
                            </>
                        )}
                        {activeTab === "bySubject" && (
                            <div className={styles.box}>
                                <div className={styles.add}>
                                    <Search
                                        setParPage={setParPage}
                                        setSearchValue={setSearchValue}
                                        searchValue={searchValue}
                                    />
                                </div>

                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead className={styles.thead}>
                                            <tr>
                                                <th>STT</th>
                                                <th>Mã môn học</th>
                                                <th>Môn học</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filterSubjectsBySearchValue().map(
                                                (cls, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            className={
                                                                styles.tableCell
                                                            }
                                                        >
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className={
                                                                styles.tableCell
                                                            }
                                                        >
                                                            {
                                                                cls.subject
                                                                    ?.subjectId
                                                            }
                                                        </td>

                                                        <td
                                                            className={
                                                                styles.tableCell
                                                            }
                                                        >
                                                            {
                                                                cls.subject
                                                                    ?.subjectName
                                                            }{" "}
                                                            (
                                                            {
                                                                cls.subject
                                                                    ?.ltCredits
                                                            }
                                                            {cls.subject
                                                                ?.thCredits >
                                                                0 &&
                                                                ` + ${cls.subject.thCredits}*`}
                                                            )
                                                        </td>

                                                        <td
                                                            className={clsx(
                                                                styles.tableCell,
                                                                styles.action
                                                            )}
                                                        >
                                                            <Link
                                                                href={`/credit-registration/${cls.subject?.subjectId}`}
                                                            >
                                                                <FcViewDetails />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* <div className={styles.paginationWrapper}>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={classSubjects.length}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div> */}
                            </div>
                        )}
                    </>
                ) : (
                    <TypographyBody
                        tag="span"
                        theme="lg"
                        className={styles.error}
                    >
                        Không có đợt đăng ký nào được mở!
                    </TypographyBody>
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassRegistration;
