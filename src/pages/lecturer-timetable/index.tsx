"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BorderBox from "@/components/BorderBox";
import { lessonTimeMap } from "@/constants/lession";
import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { lecturerTimeline } from "@/store/reducer/creditRegistrationReducer";

// Khởi tạo localizer cho react-big-calendar
moment.updateLocale("en", {
    week: {
        dow: 1, // Monday = 1, Sunday = 0
    },
});
const localizer = momentLocalizer(moment);

// Parse "1-4" hoặc "Tiết 1-4" thành [1, 4]
function getLessonRange(lessonTime: string): [number, number] {
    const match = lessonTime.match(/(\d+)-(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [1, 1];
}

// Random color cho event
function getRandomColor(): string {
    const letters = "0123456789ABC";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Tạo events từ dữ liệu API lecturerTimelines
const generateEventsFromLecturerTimelines = (data: any[]): any[] => {
    const events: any[] = [];
    if (!Array.isArray(data)) return events;

    data.forEach((item) => {
        const assignment = item.assignment || {};
        const subjectName = assignment.subject?.subjectName || "";
        const className = assignment.termClass?.termName || "";
        const lecturerId = assignment.lecturer?.lecturerId || "";
        const lecturerName = assignment.lecturer?.lecturerName || "";
        const scheduleDetails = item.scheduleDetails || [];

        scheduleDetails.forEach((detail: any) => {
            const { lesson, dateTime, endDate, classType, classroomId } =
                detail;
            const [startLesson, endLesson] = getLessonRange(lesson);
            const totalWeeks =
                moment.utc(endDate).diff(moment.utc(dateTime), "weeks") + 1;
            const color = getRandomColor();

            for (let week = 0; week < totalWeeks; week++) {
                // Đảm bảo eventDate là UTC, không bị lệch ngày
                const eventDate = moment.utc(dateTime).add(week, "weeks");
                const dateStr = eventDate.format("YYYY-MM-DD");
                if (!lessonTimeMap[startLesson] || !lessonTimeMap[endLesson])
                    continue;

                const startTime = moment(
                    `${dateStr} ${lessonTimeMap[startLesson].start}`,
                    "YYYY-MM-DD HH:mm"
                );
                const endTime = moment(
                    `${dateStr} ${lessonTimeMap[endLesson].end}`,
                    "YYYY-MM-DD HH:mm"
                );

                events.push({
                    title: `${subjectName} (${className})
GV: ${lecturerId} - ${lecturerName}
- ${
                        classType === "LT" ? "Lý thuyết" : "Thực hành"
                    }: Tiết ${lesson}, Phòng ${classroomId}
`,
                    start: startTime.toDate(),
                    end: endTime.toDate(),
                    allDay: false,
                    color,
                    subjectName,
                    className,
                    lecturerId,
                    lecturerName,
                    lesson,
                    classType,
                    classroomId,
                    startDate: eventDate.format("DD/MM/YYYY"),
                    originalItem: item,
                });
            }
        });
    });

    return events;
};

// Custom hiển thị event trên calendar
const CustomEventComponent = ({ event }: { event: any }) => {
    return (
        <div style={{ whiteSpace: "normal" }}>
            <div>
                <b>{event.subjectName}</b> ({event.className})
            </div>
            <div>
                GV: {event.lecturerId} - {event.lecturerName}
            </div>
            <div>
                - {event.classType === "LT" ? "Lý thuyết" : "Thực hành"}: Tiết{" "}
                {event.lesson}, Phòng {event.classroomId}
            </div>
            {/* <div>Ngày bắt đầu: {event.startDate}</div> */}
        </div>
    );
};

const LecturerTimeline = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { lecturerTimelines } = useSelector(
        (state: RootState) => state.creditRegistration
    );

    const [view, setView] = useState<"month" | "week" | "day">("week");
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        dispatch(lecturerTimeline());
    }, [dispatch]);

    const events = useMemo(
        () => generateEventsFromLecturerTimelines(lecturerTimelines),
        [lecturerTimelines]
    );

    return (
        <AuthGuard allowedRoles={["lecturer"]}>
            <BorderBox title="Thời khóa biểu">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={["month", "week", "day"]}
                    view={view}
                    onView={(newView) => {
                        if (["month", "week", "day"].includes(newView)) {
                            setView(newView as "month" | "week" | "day");
                        }
                    }}
                    date={date}
                    onNavigate={(newDate) => setDate(newDate)}
                    defaultView="week"
                    timeslots={1}
                    step={60}
                    min={new Date(2024, 0, 1, 6, 0)}
                    max={new Date(2024, 0, 1, 23, 59)}
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
                    components={{
                        event: CustomEventComponent,
                    }}
                    dayLayoutAlgorithm="no-overlap"
                />
            </BorderBox>
        </AuthGuard>
    );
};

export default LecturerTimeline;
