import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import SelectWithLabel from "@/components/SelectWithLabel";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getListSubject } from "@/store/reducer/subjectReducer";
import { getListLecturer } from "@/store/reducer/lecturerReducer";
import {
    createTeachingAssignment,
    getClassTermUnAssign,
    getTeachingAssignmentDetail,
    messageClear,
} from "@/store/reducer/teachingAssignment";
import toast from "react-hot-toast";

type TeachingAssignment = {
    assignmentId: number;
    lecturerId: number;
    lecturerName: string | null;
    subjectId: number;
    subjectName: string | null;
    termClassId: number;
    className: string | null;
};

const CreateEditTeachingAssignment = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        classTermUnAssigns,
        teachingAssignment,
        successMessage,
        errorMessage,
    } = useSelector((state: RootState) => state.teachingAssignment);

    const { subjects } = useSelector((state: RootState) => state.subject);
    const { lecturers } = useSelector((state: RootState) => state.lecturer);

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<TeachingAssignment>({
        assignmentId: 0,
        lecturerId: 0,
        lecturerName: "",
        subjectId: 0,
        subjectName: "",
        termClassId: 0,
        className: "",
    });

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        dispatch(getClassTermUnAssign());
        dispatch(getListSubject());
        dispatch(getListLecturer());
    }, []);

    useEffect(() => {
        if (query.id) {
            dispatch(getTeachingAssignmentDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (teachingAssignment && query.id) {
            setMode("edit");
            setState({
                assignmentId: teachingAssignment.assignmentId,
                lecturerId: teachingAssignment.lecturerId,
                lecturerName: teachingAssignment.lecturerName,
                subjectId: teachingAssignment.subjectId,
                subjectName: teachingAssignment.subjectName,
                termClassId: teachingAssignment.termClassId,
                className: teachingAssignment.className,
            });
        } else {
            setMode("create");
            setState({
                assignmentId: 0,
                lecturerId: 0,
                lecturerName: "",
                subjectId: 0,
                subjectName: "",
                termClassId: 0,
                className: "",
            });
        }
    }, [teachingAssignment, query.id]);

    const handleSubmit = async () => {
        if (mode === "create") {
            const obj = {
                lecturerId: state.lecturerId,
                subjectId: state.subjectId,
                termClassId: state.termClassId,
            };
            dispatch(createTeachingAssignment({ dto: obj }));
        } else {
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(getClassTermUnAssign());
            setState({
                assignmentId: 0,
                lecturerId: 0,
                lecturerName: "",
                subjectId: 0,
                subjectName: "",
                termClassId: 0,
                className: "",
            });
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
                    mode === "create"
                        ? "Thêm phân công giảng dạy"
                        : "Chỉnh sửa phân công giảng dạy"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Giảng viên"
                            name="lecturerId"
                            value={state.lecturerId}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "------- Tất cả -------" },
                                ...lecturers.map((lecturer) => ({
                                    value: lecturer.userId || "",
                                    label:
                                        `${lecturer.userId} - ${lecturer.userName}` ||
                                        "",
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Môn học"
                            name="subjectId"
                            value={state.subjectId}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "------- Tất cả -------" },
                                ...subjects.map((subject) => ({
                                    value: subject.subjectId || "",
                                    label:
                                        `${subject.subjectId} - ${subject.subjectName}` ||
                                        "",
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Lớp"
                            name="termClassId"
                            value={state.termClassId}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                { value: "", label: "------- Tất cả -------" },
                                ...classTermUnAssigns.map((classTerm) => ({
                                    value: classTerm.termclassId || "",
                                    label: classTerm.classname || "",
                                })),
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

export default CreateEditTeachingAssignment;
