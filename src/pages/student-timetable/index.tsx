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
import { getRegisteredCreditClasses } from "@/store/reducer/creditRegistrationReducer";

// Set week starts on Monday for moment
moment.updateLocale("en", {
    week: { dow: 1 },
});
const localizer = momentLocalizer(moment);

// Parse "x-y" (e.g., "2-5")
function getLessonRange(lesson: string): [number, number] {
    const match = lesson.match(/(\d+)-(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2])] : [1, 1];
}

// Format "YYYY-MM-DD h:mm a" using lessonTimeMap (e.g., { start: "7:00 am", end: "9:30 am" })
const formatTime = (date: moment.Moment, timeStr: string): moment.Moment => {
    return moment(
        `${date.format("YYYY-MM-DD")} ${timeStr}`,
        "YYYY-MM-DD h:mm a"
    );
};

// Get a random color for event background
function getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateEventsFromAPI(creditClasses: any[]): any[] {
    if (!Array.isArray(creditClasses)) return [];
    const events: any[] = [];

    creditClasses.forEach((cls) => {
        if (!cls.scheduleDetails) return;

        cls.scheduleDetails.forEach((detail: any) => {
            const [startLesson, endLesson] = getLessonRange(detail.lesson);

            // Tính ngày bắt đầu và kết thúc
            let startDate = moment(detail.date_time);
            let endDate = moment(detail.end_date);

            if (
                !startDate.isValid() ||
                !endDate.isValid() ||
                endDate.isBefore(startDate)
            ) {
                endDate = startDate.clone();
            }

            let week = 0;
            while (true) {
                const eventDate = startDate.clone().add(week * 7, "days");
                if (eventDate.isAfter(endDate)) break;

                const startTime = formatTime(
                    eventDate,
                    lessonTimeMap[startLesson]?.start || "7:00 am"
                );
                const endTime = formatTime(
                    eventDate,
                    lessonTimeMap[endLesson]?.end || "11:00 am"
                );

                // Xác định loại lớp
                let classTypeDisplay = "";
                if (detail.class_type === "LT") classTypeDisplay = "Lý thuyết";
                else if (detail.class_type === "TH")
                    classTypeDisplay = "Thực hành";
                else classTypeDisplay = detail.class_type || "";

                // Tạo title đúng mẫu ảnh bạn muốn
                events.push({
                    title: `[${classTypeDisplay}] Tiết ${detail.lesson} - ${cls.subjectName} (${cls.classname}) - TODO: Giảng viên - Phòng ${detail.classroom_id}`,
                    start: startTime.toDate(),
                    end: endTime.toDate(),
                    allDay: false,
                    color: getRandomColor(),
                });

                week += 1;
                if (eventDate.add(7, "days").isAfter(endDate)) break;
            }
        });
    });

    return events;
}

// Main component
const TimeLine = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { creditClasses } = useSelector(
        (state: RootState) => state.creditRegistration
    );

    const [view, setView] = useState<"month" | "week" | "day">("week");
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        dispatch(getRegisteredCreditClasses());
    }, [dispatch]);

    const events = useMemo(() => {
        const filteredClasses = creditClasses.filter(
            (cls) => cls.classStudentStatus === "success"
        );
        return generateEventsFromAPI(filteredClasses);
    }, [creditClasses]);

    console.log(creditClasses);

    return (
        <AuthGuard allowedRoles={["student"]}>
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
                />
            </BorderBox>
        </AuthGuard>
    );
};

export default TimeLine;
