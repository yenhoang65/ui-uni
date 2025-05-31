// "use client";

// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import BorderBox from "@/components/BorderBox";
// import { lessonTimeMap } from "@/constants/lession";
// import AuthGuard from "@/components/AuthGuard";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store";
// import { getRegisteredCreditClasses } from "@/store/reducer/creditRegistration";

// moment.updateLocale("en", {
//     week: {
//         dow: 1, // dow = day of week, 1 = Monday, 0 = Sunday
//     },
// });
// // Khởi tạo localizer cho react-big-calendar
// const localizer = momentLocalizer(moment);

// // Kiểu dữ liệu môn học
// type ClassSubjectType = {
//     class_name: string;
//     subject_name: string;
//     lecturer_name: string;
//     lesson_time: string;
//     start_date: string;
//     week_time: string;
//     classroom_name: string;
//     tc: number;
//     class_type: string;
// };

// // Dữ liệu mẫu
// const classSubjects: ClassSubjectType[] = [
//     {
//         class_name: "MKT1002",
//         subject_name: "SEO 2",
//         lecturer_name: "Nguyễn Văn An",
//         lesson_time: "Tiết 1-3",
//         start_date: "28/4/2025",
//         week_time: "Tuần 1-10",
//         classroom_name: "Phòng B101",
//         tc: 2,
//         class_type: "LT",
//     },
//     {
//         class_name: "CNTT103",
//         subject_name: "Công nghệ phần mềm",
//         lecturer_name: "Đào Anh Hiển",
//         lesson_time: "Tiết 4-6",
//         start_date: "30/4/2025",
//         week_time: "Tuần 5-15",
//         classroom_name: "Phòng C202",
//         tc: 3,
//         class_type: "LT",
//     },
//     {
//         class_name: "MKT1005",
//         subject_name: "SEO",
//         lecturer_name: "Nguyễn Văn An",
//         lesson_time: "Tiết 1-5",
//         start_date: "3/5/2025",
//         week_time: "Tuần 1-10",
//         classroom_name: "Phòng B101",
//         tc: 1,
//         class_type: "TH",
//     },
//     {
//         class_name: "CNTT109",
//         subject_name: "Công nghệ phần mềm",
//         lecturer_name: "Đào Anh Hiển",
//         lesson_time: "Tiết 4-6",
//         start_date: "28/4/2025",
//         week_time: "Tuần 5-15",
//         classroom_name: "Phòng C202",
//         tc: 2,
//         class_type: "LT",
//     },
//     {
//         class_name: "ENG101",
//         subject_name: "English",
//         lecturer_name: "Trần Thị Bình",
//         lesson_time: "Tiết 7-9",
//         start_date: "29/4/2025",
//         week_time: "Tuần 1-10",
//         classroom_name: "Phòng A303",
//         tc: 3,
//         class_type: "LT",
//     },
//     {
//         class_name: "MATH202",
//         subject_name: "Mathematics",
//         lecturer_name: "Lê Văn Cường",
//         lesson_time: "Tiết 1-3",
//         start_date: "30/4/2025",
//         week_time: "Tuần 1-10",
//         classroom_name: "Phòng D404",
//         tc: 5,
//         class_type: "LT",
//     },
//     {
//         class_name: "MATH202",
//         subject_name: "Mathematics",
//         lecturer_name: "Lê Văn Cường",
//         lesson_time: "Tiết 9-11",
//         start_date: "1/5/2025",
//         week_time: "Tuần 1-10",
//         classroom_name: "Phòng D404",
//         tc: 4,
//         class_type: "LT",
//     },
// ];

// // Parse "Tiết x-y"
// function getLessonRange(lessonTime: string): [number, number] {
//     const match = lessonTime.match(/Tiết (\d+)-(\d+)/);
//     return match ? [parseInt(match[1]), parseInt(match[2])] : [1, 1];
// }

// const formatTime = (date: moment.Moment, timeStr: string): moment.Moment => {
//     return moment(
//         `${date.format("YYYY-MM-DD")} ${timeStr}`,
//         "YYYY-MM-DD h:mm a"
//     );
// };

// // Tính số buổi học từ tín chỉ và tiết/buổi
// function getTotalWeeks(cls: ClassSubjectType): number {
//     const [start, end] = getLessonRange(cls.lesson_time);
//     const periodsPerSession = end - start + 1;
//     const periodsPerCredit = cls.class_type === "TH" ? 30 : 15;
//     const totalPeriods = cls.tc * periodsPerCredit;
//     return Math.ceil(totalPeriods / periodsPerSession);
// }

// function getRandomColor(): string {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// function generateEvents(): any[] {
//     const events: any[] = [];

//     classSubjects.forEach((cls) => {
//         const startDate = moment(cls.start_date, "DD/MM/YYYY");
//         const [startLesson, endLesson] = getLessonRange(cls.lesson_time);
//         const totalWeeks = getTotalWeeks(cls);
//         const color = getRandomColor();

//         for (let week = 0; week < totalWeeks; week++) {
//             const eventDate = startDate.clone().add(week * 7, "days");

//             const startTime = formatTime(
//                 eventDate,
//                 lessonTimeMap[startLesson].start
//             );
//             const endTime = formatTime(eventDate, lessonTimeMap[endLesson].end);

//             events.push({
//                 title: `${cls.lesson_time} -
// ${cls.subject_name} (${cls.class_name})
// - ${cls.lecturer_name}
// - ${cls.classroom_name}`,
//                 start: startTime.toDate(),
//                 end: endTime.toDate(),
//                 allDay: false,
//                 color,
//             });
//         }
//     });

//     return events;
// }

// // Component chính
// const TimeLine = () => {
//     const dispatch = useDispatch<AppDispatch>();

//     const { creditClasses, successMessage, errorMessage } = useSelector(
//         (state: RootState) => state.creditRegistration
//     );

//     const events = generateEvents();

//     const [view, setView] = useState<"month" | "week" | "day">("week");

//     const [date, setDate] = useState(new Date());

//     useEffect(() => {
//         dispatch(getRegisteredCreditClasses());
//     }, []);

//     return (
//         <AuthGuard allowedRoles={["student"]}>
//             <BorderBox title="Thời khóa biểu">
//                 <Calendar
//                     localizer={localizer}
//                     events={events}
//                     startAccessor="start"
//                     endAccessor="end"
//                     views={["month", "week", "day"]}
//                     view={view}
//                     onView={(newView) => {
//                         if (["month", "week", "day"].includes(newView)) {
//                             setView(newView as "month" | "week" | "day");
//                         }
//                     }}
//                     date={date}
//                     onNavigate={(newDate) => setDate(newDate)}
//                     defaultView="week"
//                     timeslots={1}
//                     step={60}
//                     min={new Date(2024, 0, 1, 6, 0)}
//                     max={new Date(2024, 0, 1, 23, 59)}
//                     style={{ height: "75vh" }}
//                     eventPropGetter={(event) => ({
//                         style: {
//                             backgroundColor: event.color,
//                             color: "white",
//                             borderRadius: "4px",
//                             padding: "4px",
//                             border: "none",
//                         },
//                     })}
//                 />
//             </BorderBox>
//         </AuthGuard>
//     );
// };

// export default TimeLine;

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

    // Only generate events when data changes
    const events = useMemo(
        () => generateEventsFromAPI(creditClasses),
        [creditClasses]
    );

    const [view, setView] = useState<"month" | "week" | "day">("week");
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        dispatch(getRegisteredCreditClasses());
    }, [dispatch]);

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
