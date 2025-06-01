import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import SelectWithLabel from "@/components/SelectWithLabel";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    getTeachingAssignmentDetail,
    getTeachingScheduleWithAssignID,
    messageClear,
    regisSchedule,
} from "@/store/reducer/teachingAssignment";
import { TypographyHeading } from "@/components/TypographyHeading";
import { TypographyBody } from "@/components/TypographyBody";
import { getListClassroom } from "@/store/reducer/classroomReducer";
import toast from "react-hot-toast";
import moment from "moment";
import { getListActiveTimeLecturer } from "@/store/reducer/activateTimeReducer";

type scheduleDetail = {
    classroom_id: number;
    lesson: string;
    date_time: Date;
    end_date: string;
    class_type: string;
};

type TeachingAssignment = {
    assignmentId: number;
    lecturerId: number;
    lecturerName: string | null;
    subjectId: number;
    subjectName: string;
    subject: {
        subjectId: number;
        subjectName: string;
        ltCredits: number;
        thCredits: number;
        subjectDescription: string;
        subjectCoefficient: number;
    };
    termClassId: number;
    className: string | null;
    semester: string;
    schoolYears: string;
    progress: string;

    status: string;
    scheduleDetails: scheduleDetail[];
    materials: { lt: string; th: string }[];
};

type TeachingScheduleDetail = {
    classroomId: number;
    lesson: string;
    dateTime: string;
    endDate: string;
    classType: "LT" | "TH";
};

type TeachingSchedule = {
    scheduleId: number;
    classroomId: number;
    lesson: string;
    dateTime: string;
    endDate: string;
    status: string;
    classType: "LT" | "TH";
    createdAt: string;
    scheduleDetails: TeachingScheduleDetail[];
    materials: { lt: string; th: string }[];
};

type TeachingScheduleFollowAssignId = {
    assignment: {
        assignmentId: number;
        assignmentType: any;
        lecturerId: number;
        lecturerName: string;
        subjectId: number;
        subjectName: string;
        termClassId: number;
        termClassName: string;
    };
    schedules: TeachingSchedule[];
};

const CreateEditTeachingScheduleRequest = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { teachingAssignment, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.teachingAssignment
    );

    const teachingScheduleFollowAssignId = useSelector(
        (state: RootState) =>
            state.teachingAssignment.teachingScheduleFollowAssignId
    ) as TeachingScheduleFollowAssignId;

    const { classrooms } = useSelector((state: RootState) => state.classroom);

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [lessonError, setLessonError] = useState<string | null>(null);

    const [state, setState] = useState<TeachingAssignment>({
        assignmentId: 0,
        lecturerId: 0,
        lecturerName: "",
        subjectId: 0,
        subjectName: "",
        subject: {
            subjectId: 0,
            subjectName: "",
            ltCredits: 0,
            thCredits: 0,
            subjectDescription: "",
            subjectCoefficient: 0,
        },
        termClassId: 0,
        className: "",
        semester: "",
        schoolYears: "",
        progress: "",

        status: "",
        scheduleDetails: [
            {
                classroom_id: 0,
                lesson: "",
                date_time: new Date(),
                end_date: "",
                class_type: "LT",
            },
            {
                classroom_id: 0,
                lesson: "",
                date_time: new Date(),
                end_date: "",
                class_type: "TH",
            },
        ],
        materials: [
            {
                lt: "",
                th: "",
            },
        ],
    });

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    };

    const inputHandleSchedule = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number
    ) => {
        const { name, value } = e.target;

        const updated = [...state.scheduleDetails];
        updated[index] = {
            ...updated[index],
            [name]: name === "date_time" ? new Date(value) : value,
            class_type: index === 0 ? "LT" : "TH",
        };
        setState({ ...state, scheduleDetails: updated });
    };

    const inputHandleMaterial = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updated = [...state.materials];
        updated[0] = {
            ...updated[0],
            [name]: value,
        };
        setState({ ...state, materials: updated });
    };

    useEffect(() => {
        dispatch(getListClassroom());
    }, []);

    useEffect(() => {
        if (query.id) {
            dispatch(getTeachingAssignmentDetail(query.id));
            dispatch(getTeachingScheduleWithAssignID(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (teachingAssignment && query.id) {
            setMode("edit");
        } else {
            setMode("create");
        }
    }, [teachingAssignment, query.id]);

    useEffect(() => {
        if (
            teachingScheduleFollowAssignId &&
            teachingScheduleFollowAssignId.schedules &&
            teachingScheduleFollowAssignId.schedules.length > 0
        ) {
            const schedule = teachingScheduleFollowAssignId.schedules[0];

            setState((prevState) => ({
                ...prevState,
                scheduleDetails: schedule.scheduleDetails.map((detail) => ({
                    classroom_id: detail.classroomId,
                    lesson: detail.lesson,
                    date_time: new Date(detail.dateTime),
                    end_date: detail.endDate,
                    class_type: detail.classType,
                })),
                materials: schedule.materials || [{ lt: "", th: "" }],
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                scheduleDetails: [
                    {
                        classroom_id: 0,
                        lesson: "",
                        date_time: new Date(),
                        end_date: "",
                        class_type: "LT",
                    },
                    {
                        classroom_id: 0,
                        lesson: "",
                        date_time: new Date(),
                        end_date: "",
                        class_type: "TH",
                    },
                ],
                materials: [{ lt: "", th: "" }],
            }));
        }
    }, [teachingScheduleFollowAssignId]);

    function isValidLessonFormat(lesson: string) {
        return /^\d+-\d+$/.test(lesson);
    }

    const handleSubmit = () => {
        const lessons = state.scheduleDetails.map((d) => d.lesson);
        const invalidLesson = lessons.find(
            (lesson) => !isValidLessonFormat(lesson)
        );
        if (invalidLesson) {
            setLessonError(
                "Định dạng tiết học phải là dạng 'số-số', ví dụ: 1-3"
            );
            return;
        } else {
            setLessonError(null);
        }

        let filteredScheduleDetails: typeof state.scheduleDetails = [];
        const hasLT = teachingAssignment.subject?.ltCredits > 0;
        const hasTH = teachingAssignment.subject?.thCredits > 0;

        if (hasLT && hasTH) {
            filteredScheduleDetails = state.scheduleDetails; // cả LT và TH
        } else if (hasLT) {
            filteredScheduleDetails = [state.scheduleDetails[0]]; // chỉ LT
        } else if (hasTH) {
            filteredScheduleDetails = [state.scheduleDetails[1]]; // chỉ TH
        }

        const obj = {
            assignmentId: teachingAssignment.assignmentId,
            status: "success",
            scheduleDetails: filteredScheduleDetails.map((d) => ({
                ...d,
                classroom_id: Number(d.classroom_id),
                date_time: moment(d.date_time).format("YYYY-MM-DDTHH:mm:ss"),
            })),
            materials: state.materials,
        };

        dispatch(regisSchedule({ dto: obj }));
    };

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
        <AuthGuard allowedRoles={["lecturer"]}>
            <BorderBox
                title={
                    mode === "create"
                        ? "Tạo Yêu cầu Lịch giảng"
                        : `Đăng ký lịch giảng dạy: ${
                              teachingAssignment.className
                          } - ${teachingAssignment.subject?.subjectName} - (${
                              teachingAssignment.subject?.ltCredits
                          } ${
                              teachingAssignment.subject?.thCredits > 0
                                  ? `+ ${teachingAssignment.subject?.thCredits}`
                                  : ""
                          }*)`
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã lịch"
                            name="assignmentId"
                            value={String(teachingAssignment.assignmentId)}
                            onChange={inputHandle}
                            type="text"
                            required
                            disabled
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Môn học"
                            name="subjectName"
                            value={
                                `${
                                    teachingAssignment.subject?.subjectName
                                } - (${teachingAssignment.subject?.ltCredits} ${
                                    teachingAssignment.subject?.thCredits > 0
                                        ? `+ ${teachingAssignment.subject?.thCredits}`
                                        : ""
                                }*)` || ""
                            }
                            type="text"
                            onChange={inputHandle}
                            required
                            disabled
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Lớp học phần"
                            name="className"
                            value={teachingAssignment.className || ""}
                            type="text"
                            required
                            onChange={inputHandle}
                            disabled
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Kỳ học - Năm học"
                            name="className"
                            value={
                                `${teachingAssignment.progress} - ${teachingAssignment.schoolYears}` ||
                                ""
                            }
                            type="text"
                            onChange={inputHandle}
                            required
                            disabled
                        />
                    </div>
                </section>
                <section className={styles.regisDetail}>
                    <TypographyHeading tag="span" theme="lg">
                        Chi tiết đăng ký
                    </TypographyHeading>

                    {teachingAssignment.subject?.ltCredits > 0 && (
                        <>
                            <TypographyBody tag="span" theme="md-bold">
                                Lý thuyết
                            </TypographyBody>
                            <div className={styles.regisLT}>
                                <div className={styles.formGroup}>
                                    <SelectWithLabel
                                        label="Phòng học"
                                        name="classroom_id"
                                        value={
                                            state.scheduleDetails[0]
                                                ?.classroom_id || ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 0)
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label: "------- Tất cả ---------",
                                            },
                                            ...classrooms.map((classroom) => ({
                                                value:
                                                    classroom.classroomId || "",
                                                label:
                                                    `${classroom.classroomId} - ${classroom.classroomName}` ||
                                                    "",
                                            })),
                                        ]}
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Tiết học"
                                        name="lesson"
                                        value={
                                            state.scheduleDetails[0]?.lesson ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 0)
                                        }
                                        type="text"
                                        placeholder="VD: 1-3"
                                        required
                                        pattern="^\d+-\d+$"
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                    {lessonError && (
                                        <span className={styles.errorText}>
                                            {lessonError}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Thời gian"
                                        name="date_time"
                                        value={
                                            state.scheduleDetails[0]?.date_time
                                                .toISOString()
                                                .slice(0, 10) || ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 0)
                                        }
                                        type="date"
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Đề cương"
                                        name="lt"
                                        value={state.materials[0]?.lt || ""}
                                        onChange={inputHandleMaterial}
                                        type="text"
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {teachingAssignment.subject?.thCredits > 0 && (
                        <>
                            <TypographyBody tag="span" theme="md-bold">
                                Thực hành
                            </TypographyBody>
                            <div className={styles.regisTH}>
                                <div className={styles.formGroup}>
                                    <SelectWithLabel
                                        label="Phòng học"
                                        name="classroom_id"
                                        value={
                                            state.scheduleDetails[1]
                                                ?.classroom_id || ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 1)
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label: "------- Tất cả ---------",
                                            },
                                            ...classrooms.map((classroom) => ({
                                                value:
                                                    classroom.classroomId || "",
                                                label:
                                                    `${classroom.classroomId} - ${classroom.classroomName}` ||
                                                    "",
                                            })),
                                        ]}
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Tiết học"
                                        name="lesson"
                                        value={
                                            state.scheduleDetails[1]?.lesson ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 1)
                                        }
                                        type="text"
                                        placeholder="VD: 1-3"
                                        pattern="^\d+-\d+$"
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />

                                    {lessonError && (
                                        <span className={styles.errorText}>
                                            {lessonError}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Thời gian"
                                        name="date_time"
                                        value={
                                            state.scheduleDetails[1]?.date_time
                                                .toISOString()
                                                .slice(0, 10) || ""
                                        }
                                        onChange={(e) =>
                                            inputHandleSchedule(e, 1)
                                        }
                                        type="date"
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <InputWithLabel
                                        label="Đề cương"
                                        name="th"
                                        value={state.materials[0]?.th || ""}
                                        onChange={inputHandleMaterial}
                                        type="text"
                                        required
                                        disabled={
                                            teachingScheduleFollowAssignId
                                                .schedules?.length > 0
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </section>
                <div className={styles.buttonContainer}>
                    <Link
                        href="/teaching-schedule-request"
                        className={styles.backButton}
                    >
                        <IoIosArrowBack /> Quay lại
                    </Link>
                    {teachingScheduleFollowAssignId &&
                        teachingScheduleFollowAssignId.schedules &&
                        !teachingScheduleFollowAssignId.schedules?.length && (
                            <Button
                                className={styles.buttonAction}
                                onClick={handleSubmit}
                            >
                                {mode === "create" ? "Lưu" : "Đăng ký"}
                            </Button>
                        )}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditTeachingScheduleRequest;
