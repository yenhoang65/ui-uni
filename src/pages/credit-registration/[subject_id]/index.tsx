import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BorderBox from "@/components/BorderBox";
import { lessonTimeMap } from "@/constants/lession";
import styles from "./styles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ModalConfirm from "@/components/ModalConfirm";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    getClassFollowSubject,
    messageClear,
    registerTC,
} from "@/store/reducer/creditRegistrationReducer";
import toast from "react-hot-toast";
import { getCurrentSemesterAndSchoolYear } from "@/constants/constants";

moment.updateLocale("en", {
    week: {
        dow: 1, // dow = day of week, 1 = Monday, 0 = Sunday
    },
});
// Khởi tạo localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

type ScheduleDetail = {
    classroom_id: number;
    lesson: string;
    date_time: string;
    end_date: string;
    class_type: "LT" | "TH";
};

type ClassFollowSubject = {
    classStudentId: number;
    teachingScheduleRequest: {
        assignmentId: number;
        status: string;
        materials: [
            {
                lt: string;
                th: string;
            }
        ];
        scheduleDetails: ScheduleDetail[];
    };
    teachingAssignment: {
        lecturerId: number;
        lecturerName: string;
        subjectId: number;
        subjectName: string;
        termClassId: number;
        assignmentType: null;
    };
    termClass: {
        classname: string;
        progress: string;
        semester: string;
        schoolyears: string;
    };
    subject: {
        subjectId: number;
        subjectName: string;
        ltCredits: number;
        thCredits: number;
        subjectDescription: string;
        subjectCoefficient: number;
    };
};

function getLessonRange(lessonTime: string): [number, number] {
    const match = lessonTime.match(/Tiết (\d+)-(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [1, 1];
}

function getRandomColor(): string {
    const letters = "0123456789";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const CustomEventComponent = ({ event }: { event: any }) => {
    return (
        <div style={{ whiteSpace: "normal" }}>
            <div>{event.subjectName}</div>
            <div>
                GV: {event.lecturerId} - {event.lecturerName}
            </div>
            {event.ltLesson && (
                <div>
                    - Lý thuyết: Tiết {event.ltLesson}, Phòng{" "}
                    {event.ltClassroom}
                    <br />
                    Ngày bắt đầu: {event.ltDate}
                </div>
            )}
            {event.thLesson && (
                <div>
                    - Thực hành: Tiết {event.thLesson}, Phòng{" "}
                    {event.thClassroom}
                    <br />
                    Ngày bắt đầu: {event.thDate}
                </div>
            )}
        </div>
    );
};

// function generateEventsFromAPI(data: any[]): any[] {
//     const events: any[] = [];

//     data.forEach((item) => {
//         const subjectName = item.subject?.subjectName;
//         const lecturerId = item.teachingAssignment?.lecturerId;
//         const scheduleDetails =
//             item.teachingScheduleRequest?.scheduleDetails || [];

//         scheduleDetails
//             .filter((detail: any) => detail.class_type?.toUpperCase() === "LT")
//             .forEach((ltDetail: any) => {
//                 const { lesson, date_time, end_date, classroom_id } = ltDetail;
//                 const [startLesson, endLesson] = lesson.split("-").map(Number);

//                 // Lấy phần ngày yyyy-mm-dd (bỏ qua giờ)
//                 const dateStr = date_time.slice(0, 10);

//                 const startTime = moment(
//                     `${dateStr} ${lessonTimeMap[startLesson].start}`,
//                     "YYYY-MM-DD HH:mm"
//                 );
//                 const endTime = moment(
//                     `${dateStr} ${lessonTimeMap[endLesson].end}`,
//                     "YYYY-MM-DD HH:mm"
//                 );

//                 const color = getRandomColor();

//                 const title = `${subjectName}
// GV: ${lecturerId}
// - Lý thuyết: Tiết ${lesson}, Phòng ${classroom_id}
// Ngày bắt đầu: ${dateStr.split("-").reverse().join("/")}`;

//                 events.push({
//                     title: title,
//                     start: startTime.toDate(),
//                     end: endTime.toDate(),
//                     allDay: false,
//                     color,
//                     subjectName,
//                     lecturerId,
//                     lesson,
//                     classroom_id,
//                     startDate: dateStr.split("-").reverse().join("/"),
//                     originalClass: item,
//                 });
//             });
//     });

//     return events;
// }

function generateEventsFromAPI(data: any[]): any[] {
    const events: any[] = [];

    data.forEach((item) => {
        const subjectName = item.subject?.subjectName;
        const lecturerId = item.teachingAssignment?.lecturerId;
        const lecturerName = item.teachingAssignment?.lecturerName || "//TO DO";
        const scheduleDetails =
            item.teachingScheduleRequest?.scheduleDetails || [];

        // Tìm LT và TH
        const ltDetail = scheduleDetails.find(
            (d: any) => d.class_type?.toUpperCase() === "LT"
        );
        const thDetail = scheduleDetails.find(
            (d: any) => d.class_type?.toUpperCase() === "TH"
        );

        // Nếu có LT, tạo event chính lấy thời gian từ LT, content gồm cả LT + TH nếu có
        if (ltDetail) {
            const { lesson, date_time, classroom_id } = ltDetail;
            const [startLesson, endLesson] = lesson.split("-").map(Number);
            const dateStr = date_time.slice(0, 10);
            const startTime = moment(
                `${dateStr} ${lessonTimeMap[startLesson].start}`,
                "YYYY-MM-DD HH:mm"
            );
            const endTime = moment(
                `${dateStr} ${lessonTimeMap[endLesson].end}`,
                "YYYY-MM-DD HH:mm"
            );
            const color = getRandomColor();

            let content = `${subjectName}\nGV: ${lecturerId} - ${lecturerName}\n- Lý thuyết: Tiết ${lesson}, Phòng ${classroom_id}\nNgày bắt đầu: ${moment(
                ltDetail.date_time
            ).format("DD/MM/YYYY")}`;
            if (thDetail) {
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
                color,
                subjectName,
                lecturerId,
                lecturerName,
                ltLesson: ltDetail.lesson,
                ltClassroom: ltDetail.classroom_id,
                ltDate: moment(ltDetail.date_time).format("DD/MM/YYYY"),
                thLesson: thDetail?.lesson,
                thClassroom: thDetail?.classroom_id,
                thDate: thDetail
                    ? moment(thDetail.date_time).format("DD/MM/YYYY")
                    : undefined,
                originalClass: item,
            });
        } else if (thDetail) {
            // Nếu chỉ có TH
            const { lesson, date_time, classroom_id } = thDetail;
            const [startLesson, endLesson] = lesson.split("-").map(Number);
            const dateStr = date_time.slice(0, 10);
            const startTime = moment(
                `${dateStr} ${lessonTimeMap[startLesson].start}`,
                "YYYY-MM-DD HH:mm"
            );
            const endTime = moment(
                `${dateStr} ${lessonTimeMap[endLesson].end}`,
                "YYYY-MM-DD HH:mm"
            );
            const color = getRandomColor();

            let content = `${subjectName}\nGV: ${lecturerId} - ${lecturerName}\n- Thực hành: Tiết ${lesson}, Phòng ${classroom_id}\nNgày bắt đầu: ${moment(
                thDetail.date_time
            ).format("DD/MM/YYYY")}`;

            events.push({
                title: content,
                start: startTime.toDate(),
                end: endTime.toDate(),
                allDay: false,
                color,
                subjectName,
                lecturerId,
                lecturerName,
                thLesson: thDetail.lesson,
                thClassroom: thDetail.classroom_id,
                thDate: moment(thDetail.date_time).format("DD/MM/YYYY"),
                originalClass: item,
            });
        }
    });

    return events;
}

const ListClassSubject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classOpenFollowSubject, successMessage, errorMessage } =
        useSelector((state: RootState) => state.creditRegistration);

    const router = useRouter();
    const { subject_id } = router.query;

    const [selectedClass, setSelectedClass] =
        useState<ClassFollowSubject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (subject_id) {
            const { semester, schoolyear } = getCurrentSemesterAndSchoolYear();
            dispatch(
                getClassFollowSubject({
                    subjectId: subject_id,
                    semester,
                    schoolyear,
                })
            );
        }
    }, [subject_id, dispatch]);

    const events = useMemo(
        () => generateEventsFromAPI(classOpenFollowSubject),
        [classOpenFollowSubject]
    );

    const message = selectedClass ? (
        <div style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
            <div>{selectedClass.subject?.subjectName}</div>
            <div>
                GV: {selectedClass.teachingAssignment?.lecturerId} - //TO DO
            </div>
            <div>
                - Lý thuyết:&nbsp;
                {selectedClass.teachingScheduleRequest?.scheduleDetails
                    .filter((d) => d.class_type === "LT")
                    .map(
                        (d) =>
                            `Tiết ${d.lesson}, Phòng ${
                                d.classroom_id
                            }, Ngày bắt đầu: ${moment(d.date_time).format(
                                "DD/MM/YYYY"
                            )}`
                    )
                    .join("; ")}
            </div>
            <div>
                - Thực hành:&nbsp;
                {selectedClass.teachingScheduleRequest?.scheduleDetails
                    .filter((d) => d.class_type === "TH")
                    .map(
                        (d) =>
                            `Tiết ${d.lesson}, Phòng ${
                                d.classroom_id
                            }, Ngày bắt đầu: ${moment(d.date_time).format(
                                "DD/MM/YYYY"
                            )}`
                    )
                    .join("; ")}
            </div>
        </div>
    ) : (
        "Bạn muốn đăng ký lớp này?"
    );

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.back();
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    console.log(classOpenFollowSubject);

    return (
        <BorderBox title="Các lớp đang mở môn Công nghệ phần mềm">
            <div className={styles.calendarWrapper}>
                <Calendar
                    key={events.length}
                    className={styles.calendar}
                    localizer={localizer}
                    formats={{
                        dayFormat: (date, culture, localizer) =>
                            localizer!.format(date, "dddd", culture),
                    }}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="week"
                    views={["week"]}
                    timeslots={1}
                    step={60}
                    defaultDate={events.length ? events[0].start : new Date()}
                    min={new Date(2024, 0, 1, 6, 0)}
                    max={new Date(2024, 0, 1, 23, 0)}
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
                        setSelectedClass(event.originalClass);
                        setIsModalOpen(true);
                    }}
                    components={{
                        event: CustomEventComponent,
                    }}
                    dayLayoutAlgorithm="no-overlap"
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
                                classStudentId: selectedClass.classStudentId,
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

            <Link href={"/credit-registration"} className={styles.backButton}>
                <IoIosArrowBack /> Back
            </Link>
        </BorderBox>
    );
};

export default ListClassSubject;
