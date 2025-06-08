import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BorderBox from "@/components/BorderBox";
import { lessonTimeMap } from "@/constants/lession";
import styles from "./styles.module.css";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { useMemo, useState } from "react";
import ModalConfirm from "@/components/ModalConfirm";
import toast from "react-hot-toast";

moment.updateLocale("en", {
    week: {
        dow: 1,
    },
});
const localizer = momentLocalizer(moment);

const mockClassOpenFollowSubject = [
    {
        classStudentId: 1,
        teachingScheduleRequest: {
            assignmentId: 1,
            status: "open",
            materials: [],
            scheduleDetails: [
                {
                    classroom_id: 101,
                    lesson: "1-3",
                    date_time: "2025-06-09T00:00:00Z",
                    end_date: "2025-08-01T00:00:00Z",
                    class_type: "LT",
                },
                {
                    classroom_id: 102,
                    lesson: "4-5",
                    date_time: "2025-06-10T00:00:00Z",
                    end_date: "2025-08-01T00:00:00Z",
                    class_type: "TH",
                },
            ],
        },
        teachingAssignment: {
            lecturerId: 1001,
            lecturerName: "Nguyen Van A",
            subjectId: 501,
            subjectName: "Lap trinh Web",
            termClassId: 201,
            assignmentType: null,
        },
        termClass: {
            classname: "CNTT-K15A",
            progress: "70%",
            semester: "2",
            schoolyears: "2024-2025",
        },
        subject: {
            subjectId: 501,
            subjectName: "Lap trinh Web",
            ltCredits: 2,
            thCredits: 1,
            subjectDescription: "Moc hoc ve lap trinh web",
            subjectCoefficient: 1.5,
        },
    },
];

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
        const lecturerId = item.teachingAssignment?.lecturerId;
        const lecturerName = item.teachingAssignment?.lecturerName || "//TO DO";
        const scheduleDetails =
            item.teachingScheduleRequest?.scheduleDetails || [];

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

            events.push({
                title: subjectName,
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

const CreRegisComponet = () => {
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const events = useMemo(
        () => generateEventsFromAPI(mockClassOpenFollowSubject),
        []
    );

    const message = selectedClass ? (
        <div>
            <div>{selectedClass.subject?.subjectName}</div>
            <div>GV: {selectedClass.teachingAssignment?.lecturerId}</div>
        </div>
    ) : (
        "Bạn muốn đăng ký lớp này?"
    );

    return (
        <>
            <div className={styles.calendarWrapper}>
                <Calendar
                    className={styles.calendar}
                    localizer={localizer}
                    formats={{
                        dayFormat: (date, culture, loc) =>
                            loc?.format(date, "dddd", culture) || "",
                    }}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="week"
                    views={["week"]}
                    timeslots={1}
                    step={60}
                    min={moment().set({ hour: 6, minute: 0 }).toDate()}
                    max={moment().set({ hour: 22, minute: 0 }).toDate()}
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
                    components={{ event: CustomEventComponent }}
                />
            </div>

            {isModalOpen && selectedClass && (
                <ModalConfirm
                    confirmText="đăng ký học"
                    buttonText="Đăng ký"
                    message={message}
                    onConfirm={() => {
                        toast.success("Đăng ký thành công!");
                        setIsModalOpen(false);
                    }}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedClass(null);
                    }}
                />
            )}

            <Link href="/credit-registration" className={styles.backButton}>
                <IoIosArrowBack /> Back
            </Link>
        </>
    );
};

export default CreRegisComponet;
