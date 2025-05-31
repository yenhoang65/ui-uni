import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getListClassroom } from "@/store/reducer/classroomReducer";
import { getPoint } from "@/store/reducer/pointReducer";
import {
    createExam,
    getAllClassStudent,
    getExamAll,
    getExamByIds,
    messageClear,
    updateExam,
} from "@/store/reducer/examReducer";
import { stat } from "fs";
import toast from "react-hot-toast";

const examForms = [
    { value: "offline", label: "Offline" },
    { value: "online", label: "Online" },
];

type ExamScheduleState = {
    classStudentId: number | "";
    classroomId: number | "";
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    examForm: string;
    gradeTypeId: number | "";
};

const CreateEditExamSchedule = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { allExams, examDetail, classStudent, successMessage, errorMessage } =
        useSelector((state: RootState) => state.exam);
    const { classrooms } = useSelector((state: RootState) => state.classroom);
    const { listPoint } = useSelector((state: RootState) => state.point);

    const router = useRouter();
    const { id } = router.query;
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<ExamScheduleState>({
        classStudentId: "",
        classroomId: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        examForm: "",
        gradeTypeId: "",
    });

    useEffect(() => {
        dispatch(getListClassroom());
        dispatch(getPoint());
        dispatch(getAllClassStudent());
    }, []);

    useEffect(() => {
        if (query.id) {
            dispatch(getExamByIds(id));
        }
    }, [query.id]);

    useEffect(() => {
        if (query.id && examDetail) {
            setMode("edit");
            setState({
                classStudentId: examDetail.classStudentId ?? "",
                classroomId: examDetail.classroomId ?? "",
                startDate: examDetail.startDate ?? "",
                endDate: examDetail.endDate ?? "",
                startTime: examDetail.startTime ?? "",
                endTime: examDetail.endTime ?? "",
                examForm: examDetail.examForm ?? "",
                gradeTypeId: examDetail.gradeTypeId ?? "",
            });
        } else {
            setMode("create");

            setState({
                classStudentId: "",
                classroomId: "",
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "",
                examForm: "",
                gradeTypeId: "",
            });
        }
    }, [query.id, examDetail]);

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const obj = {
            classStudentId: Number(state.classStudentId),
            classroomId: Number(state.classroomId),
            startDate: state.startDate,
            endDate: state.endDate,
            startTime: state.startTime,
            endTime: state.endTime,
            examForm: state.examForm,
            gradeTypeId: Number(state.gradeTypeId),
        };
        if (mode === "create") {
            console.log(obj);
            dispatch(createExam({ dto: obj }));
        } else {
            dispatch(updateExam({ id: examDetail.examScheduleId, dto: obj }));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/exam-schedule-management");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox
                title={
                    mode === "create" ? "Thêm lịch thi" : "Chỉnh sửa lịch thi"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Lớp học phần"
                            name="classStudentId"
                            value={state.classStudentId || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "-----------------" },
                                ...classStudent.map((point: any) => ({
                                    value: point.classStudentId || "",
                                    label:
                                        `${point.termClass.classname} - ${point.subject.subjectName}` ||
                                        "",
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Loại thi"
                            name="gradeTypeId"
                            value={state.gradeTypeId || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "-----------------" },
                                ...listPoint.map((point: any) => ({
                                    value: point.gradeTypeId || "",
                                    label:
                                        `${point.code} - ${point.name}` || "",
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Phòng thi"
                            name="classroomId"
                            value={state.classroomId || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "-----------------" },
                                ...classrooms.map((classroom) => ({
                                    value: classroom.classroomId || "",
                                    label: `DH${classroom.classroomId}` || "",
                                })),
                            ]}
                            required
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Ngày thi"
                            name="startDate"
                            value={state.startDate || ""}
                            onChange={inputHandle}
                            type="date"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Ngày hoàn thành"
                            name="endDate"
                            value={state.endDate}
                            onChange={inputHandle}
                            type="date"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Giờ bắt đầu"
                            name="startTime"
                            value={state.startTime || ""}
                            onChange={inputHandle}
                            type="time"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Giờ kết thúc"
                            name="endTime"
                            value={state.endTime || ""}
                            onChange={inputHandle}
                            type="time"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Hình thức thi"
                            name="examForm"
                            value={state.examForm || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "Chọn hình thức" },
                                ...examForms,
                            ]}
                            required
                        />
                    </div>
                </section>

                <div className={styles.button}>
                    <Button
                        className={styles.buttonAction}
                        onClick={handleSubmit}
                    >
                        {mode === "create" ? "Lưu" : "Cập nhật"}
                    </Button>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditExamSchedule;
