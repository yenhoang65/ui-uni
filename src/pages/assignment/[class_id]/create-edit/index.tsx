import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/Button";
import InputWithLabel from "@/components/InputWithLabel";
import SelectWithLabel from "@/components/SelectWithLabel";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import AuthGuard from "@/components/AuthGuard";
import { TypographyBody } from "@/components/TypographyBody";
import dynamic from "next/dynamic";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
    createExercice,
    getExerciseDetail,
    getPoint,
    messageClear,
    updateExercice,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type State = {
    gradeEventId: string;
    classStudentId: number;
    gradeTypeId: string;
    title: string;
    eventDate: Date;
    maxScore: number;
    description: string;
};

const CreateEditGradeEvent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exercise, listPoint, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );
    const router = useRouter();
    const { query } = router;
    const { class_id } = router.query;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<State>({
        gradeEventId: "",
        classStudentId: 0,
        gradeTypeId: "",
        title: "",
        eventDate: new Date(),
        maxScore: 0,
        description: "",
    });
    const editor = useRef<any>(null);

    useEffect(() => {
        dispatch(getPoint());
    }, []);

    useEffect(() => {
        if (query.id) {
            dispatch(getExerciseDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (exercise && query.id) {
            setMode("edit");
            setState({
                gradeEventId: exercise.gradeEventId,
                classStudentId: exercise.classStudentId,
                gradeTypeId: exercise.gradeTypeId,
                title: exercise.title,
                eventDate: exercise.eventDate,
                maxScore: exercise.maxScore,
                description: exercise.description,
            });
        } else {
            setMode("create");
            setState({
                gradeEventId: "",
                classStudentId: 0,
                gradeTypeId: "",
                title: "",
                eventDate: new Date(),
                maxScore: 0,
                description: "",
            });
        }
    }, [exercise, query.id]);

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setState({
            ...state,
            [name]:
                type === "number" || name === "maxScore"
                    ? Number(value)
                    : value,
        });
    };

    const handleSubmit = async () => {
        const obj = {
            classStudentId: class_id,
            gradeTypeId: state.gradeTypeId,
            title: state.title,
            eventDate: state.eventDate,
            maxScore: state.maxScore,
            description: state.description,
        };
        if (mode === "create") {
            dispatch(createExercice({ request: obj }));
        } else {
            dispatch(
                updateExercice({
                    gradeEventId: exercise.gradeEventId,
                    request: obj,
                })
            );
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push(`/assignment/${class_id}`);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <BorderBox
                title={
                    mode === "create"
                        ? "Giao bài tập"
                        : "Chỉnh sửa bài tập đã giao"
                }
            >
                <div className={styles.formContainer}>
                    <div className={styles.formGrid}>
                        {mode === "edit" && (
                            <div className={styles.formItem}>
                                <InputWithLabel
                                    label="Mã bài tập"
                                    name="gradeEventId"
                                    value={state.gradeEventId}
                                    onChange={inputHandle}
                                    type="text"
                                    required
                                    disabled={mode === "edit"}
                                />
                            </div>
                        )}

                        <div className={styles.formItem}>
                            <SelectWithLabel
                                label="Loại điểm"
                                name="gradeTypeId"
                                value={state.gradeTypeId}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={[
                                    {
                                        value: "",
                                        label: "---Tất cả---",
                                    },
                                    ...listPoint.map((point: any) => ({
                                        value: point.gradeTypeId || "",
                                        label:
                                            `${point.code} - ${point.name}` ||
                                            "",
                                    })),
                                ]}
                                required
                            />
                        </div>
                        <div className={styles.formItem}>
                            <InputWithLabel
                                label="Tiêu đề"
                                name="title"
                                value={state.title}
                                onChange={inputHandle}
                                type="text"
                                required
                            />
                        </div>
                        <div className={styles.formItem}>
                            <InputWithLabel
                                label="Ngày hết hạn"
                                name="eventDate"
                                value={String(state.eventDate)}
                                onChange={inputHandle}
                                type="date"
                                required
                            />
                        </div>
                        <div className={styles.formItem}>
                            <InputWithLabel
                                label="Điểm tối đa"
                                name="maxScore" // Đúng name với key trong state
                                value={String(state.maxScore)}
                                onChange={inputHandle}
                                type="number"
                                required
                            />
                        </div>

                        <div className={styles.formItemFull}>
                            <label
                                htmlFor="description"
                                className={styles.label}
                            >
                                Mô tả
                            </label>
                            <JoditEditor
                                ref={editor}
                                value={state.description}
                                onChange={(newContent) =>
                                    setState({
                                        ...state,
                                        description: newContent,
                                    })
                                }
                                className={styles.inputDesc}
                            />
                        </div>
                    </div>
                    <div className={styles.button}>
                        <Button
                            className={styles.buttonAction}
                            onClick={handleSubmit}
                        >
                            {mode === "create" ? "Tạo" : "Cập nhật"}
                        </Button>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditGradeEvent;
