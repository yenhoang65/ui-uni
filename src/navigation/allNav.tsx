import {
    AiOutlineTeam,
    AiOutlineBook,
    AiOutlineFile,
    AiOutlineCheckCircle,
    AiOutlineUser,
    AiOutlineHome,
    AiOutlineCalendar,
} from "react-icons/ai";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { PiExamBold } from "react-icons/pi";

export const allNav = [
    {
        group: "nav.SCHOOL_MANAGEMENT",
        items: [
            {
                id: 1,
                title: "nav.faculty",
                icon: <AiOutlineHome />,
                role: ["admin"],
                path: "/faculty",
            },
            {
                id: 2,
                title: "nav.major",
                icon: <AiOutlineBook />,
                role: ["admin"],
                path: "/major",
            },
            {
                id: 3,
                title: "nav.specialization",
                icon: <AiOutlineTeam />,
                role: ["admin"],
                path: "/specialization",
            },
        ],
    },
    {
        group: "nav.TRAINING_MANAGEMENT",
        items: [
            {
                id: 4,
                title: "nav.subject",
                icon: <AiOutlineBook />,
                role: ["admin"],
                path: "/subject",
            },
            {
                id: 5,
                title: "nav.trainingProgram",
                icon: <AiOutlineFile />,
                role: ["admin"],
                path: "/training-program",
            },
            {
                id: 15,
                title: "nav.trainingProgramView",
                icon: <AiOutlineFile />,
                role: ["student"],
                path: "/training-program-by-student",
            },
            {
                id: 18,
                title: "nav.classSubjectManagement",
                icon: <AiOutlineCalendar />,
                role: ["lecturer"],
                path: "/class-subject-management",
            },
            {
                id: 19,
                title: "nav.listClassFollowDay",
                icon: <AiOutlineCalendar />,
                role: ["employee", "admin"],
                path: "/list-class-follow-day",
            },
            {
                id: 31,
                title: "nav.examScheduleManagement",
                icon: <PiExamBold />,
                role: ["admin"],
                path: "/exam-schedule-management",
            },
            {
                id: 17,
                title: "nav.studentTimetable",
                icon: <AiOutlineCalendar />,
                role: ["student"],
                path: "/student-timetable",
            },
            {
                id: 32,
                title: "nav.examSchedule",
                icon: <PiExamBold />,
                role: ["student"],
                path: "/exam-schedule-management/exam-schedule",
            },
            {
                id: 33,
                title: "nav.learningResults",
                icon: <PiExamBold />,
                role: ["student"],
                path: "/learning-results",
            },
        ],
    },
    {
        group: "nav.SCHEDULE_AND_REGISTRATION_MANAGEMENT",
        items: [
            {
                id: 6,
                title: "nav.activateTeachingSchedule",
                icon: <AiOutlineCheckCircle />,
                role: ["admin"],
                path: "/activate-teaching-schedule-registration",
            },
            {
                id: 7,
                title: "nav.enableCreditRegistration",
                icon: <AiOutlineCheckCircle />,
                role: ["admin"],
                path: "/enable-credit-registration",
            },
            {
                id: 13,
                title: "nav.teachingAssignment",
                icon: <AiOutlineCalendar />,
                role: ["admin"],
                path: "/teaching-assignment",
            },
            {
                id: 14,
                title: "nav.teachingScheduleRequest",
                icon: <AiOutlineCalendar />,
                role: ["lecturer"],
                path: "/teaching-schedule-request",
            },
            {
                id: 16,
                title: "nav.creditRegistration",
                icon: <AiOutlineCalendar />,
                role: ["student"],
                path: "/credit-registration",
            },

            {
                id: 22,
                title: "nav.teachingScheduleHistory",
                icon: <AiOutlineCalendar />,
                role: ["lecturer"],
                path: "/teaching-request-history",
            },
            {
                id: 30,
                title: "nav.lecturerTimetable",
                icon: <AiOutlineCalendar />,
                role: ["lecturer"],
                path: "/lecturer-timetable",
            },
            {
                id: 32,
                title: "nav.registeredCreditClasses",
                icon: <AiOutlineCalendar />,
                role: ["student"],
                path: "/registered-credit-classes",
            },
            {
                id: 33,
                title: "nav.pointManagement",
                icon: <AiOutlineCalendar />,
                role: ["admin"],
                path: "/point-management",
            },
        ],
    },
    {
        group: "nav.HUMAN_RESOURCES_MANAGEMENT",
        items: [
            {
                id: 8,
                title: "nav.lecturerManagement",
                icon: <FaUserTie />,
                role: ["admin"],
                path: "/lecturer_management",
            },
            {
                id: 9,
                title: "nav.studentManagement",
                icon: <FaUserGraduate />,
                role: ["admin"],
                path: "/student_management",
            },
        ],
    },
    {
        group: "nav.CLASS_MANAGEMENT",
        items: [
            {
                id: 10,
                title: "nav.classroom",
                icon: <AiOutlineHome />,
                role: ["admin", "employee"],
                path: "/classroom",
            },
            {
                id: 12,
                title: "nav.classTermSubject",
                icon: <AiOutlineBook />,
                role: ["admin"],
                path: "/class-term-subject",
            },
            {
                id: 21,
                title: "nav.classOfficial",
                icon: <AiOutlineHome />,
                role: ["admin", "employee"],
                path: "/class_official",
            },
        ],
    },
    {
        group: "nav.PROFILE",
        items: [
            {
                id: 11,
                title: "nav.profile",
                icon: <AiOutlineUser />,
                role: ["admin", "employee", "student", "lecturer"],
                path: "/profile/view",
            },
        ],
    },
    {
        group: "nav.ASSIGNMENT_MANAGEMENT",
        items: [
            // {
            //     id: 20,
            //     title: "nav.assignment",
            //     icon: <AiOutlineUser />,
            //     role: ["student"],
            //     path: "/submit-assignment",
            // },

            {
                id: 29,
                title: "Quản lý lớp học phần",
                icon: <AiOutlineUser />,
                role: ["student"],
                path: "/class-subject-stu",
            },
        ],
    },
];
