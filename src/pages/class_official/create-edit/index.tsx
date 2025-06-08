import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import SelectWithLabel from "@/components/SelectWithLabel";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getListLecturer } from "@/store/reducer/lecturerReducer";
import { getListTrainingProgram } from "@/store/reducer/trainingProgramReducer";
import AuthGuard from "@/components/AuthGuard";
import toast from "react-hot-toast";
import {
    createClassOfficial,
    getClassOfficalDetail,
    messageClear,
    updateClassOfficial,
} from "@/store/reducer/classReducer";
import { useTranslation } from "react-i18next";

const CreateEditClassOffical = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const { lecturers } = useSelector((state: RootState) => state.lecturer);
    const { trainingPrograms } = useSelector(
        (state: RootState) => state.trainingProgram
    );
    const { classOffical, errorMessage, successMessage } = useSelector(
        (state: RootState) => state.class
    );

    const [state, setState] = useState({
        classId: "",
        lecturerId: "",
        trainingProgramId: "",
        schoolYear: "",
    });

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");

    useEffect(() => {
        dispatch(getListLecturer());
        dispatch(getListTrainingProgram());
    }, []);

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (query.id) {
            dispatch(getClassOfficalDetail(query.id));

            setState({
                classId: String(classOffical.classId),
                lecturerId: String(classOffical.lecturerId),
                trainingProgramId: String(classOffical.trainingProgramId),
                schoolYear: String(classOffical.schoolYear),
            });
        }
    }, [query.id]);

    useEffect(() => {
        if (classOffical && query.id) {
            setMode("edit");
            setState({
                classId: String(classOffical.classId),
                lecturerId: String(classOffical.lecturerId),
                trainingProgramId: String(classOffical.trainingProgramId),
                schoolYear: String(classOffical.schoolYear),
            });
        } else {
            setMode("create");
            setState({
                classId: "",
                lecturerId: "",
                trainingProgramId: "",
                schoolYear: "",
            });
        }
    }, [classOffical]);

    const handleSubmit = () => {
        const obj = {
            classId: state.classId,
            lecturerId: state.lecturerId,
            trainingProgramId: state.trainingProgramId,
            schoolYear: state.schoolYear,
        };

        if (mode === "create") {
            dispatch(createClassOfficial({ dto: obj }));
        } else {
            dispatch(
                updateClassOfficial({ id: classOffical.classId, dto: obj })
            );
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/class_official");
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
                    mode === "edit"
                        ? t("classForm.editTitle")
                        : t("classForm.createTitle")
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label={t("classForm.classId")}
                            name="classId"
                            value={state.classId}
                            onChange={inputHandle}
                            type="text"
                            required
                            disabled={mode === "edit"}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label={t("classForm.lecturer")}
                            name="lecturerId"
                            value={state.lecturerId}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                {
                                    value: "",
                                    label: "------------------------Tất cả-------------------------",
                                },
                                ...lecturers.map((lect) => ({
                                    value: lect.userId,
                                    label: lect.userName,
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label={t("classForm.trainingProgram")}
                            name="trainingProgramId"
                            value={state.trainingProgramId}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                {
                                    value: "",
                                    label: t("common.allOption"),
                                },
                                ...trainingPrograms.map((tp) => ({
                                    value: tp.trainingProgramId || "",
                                    label:
                                        `${tp.trainingProgramId} - ${tp.trainingProgramName}` ||
                                        "",
                                })),
                            ]}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label={t("classForm.schoolYear")}
                            name="schoolYear"
                            value={state.schoolYear}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.button}>
                        <Button
                            onClick={handleSubmit}
                            className={styles.buttonAction}
                            type="submit"
                        >
                            {mode === "create"
                                ? t("common.save")
                                : t("common.update")}
                        </Button>
                    </div>
                </section>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditClassOffical;
