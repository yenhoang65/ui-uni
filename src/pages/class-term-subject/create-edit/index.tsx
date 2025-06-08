import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import InputWithLabel from "@/components/InputWithLabel";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createTermClass,
    getClassTermDetail,
    messageClear,
    updateTermClass,
} from "@/store/reducer/classReducer";
import toast from "react-hot-toast";

type ClassTermSubjectState = {
    termclassId: number;
    classname: string;
    progress: string;
    semester: string;
    schoolyears: string;
};

const CreateEditClassTermSubject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classTerm, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.class
    );

    const { t } = useTranslation();
    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<ClassTermSubjectState>({
        termclassId: 0,
        classname: "",
        progress: "",
        semester: "",
        schoolyears: "",
    });

    useEffect(() => {
        if (query.id) {
            dispatch(getClassTermDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (classTerm && query.id) {
            setMode("edit");

            setState({
                termclassId: classTerm.termclassId,
                classname: classTerm.classname,
                progress: classTerm.progress,
                semester: classTerm.semester,
                schoolyears: classTerm.schoolyears,
            });
        } else {
            setMode("create");
            setState({
                termclassId: 0,
                classname: "",
                progress: "",
                semester: "",
                schoolyears: "",
            });
        }
    }, [classTerm, query.id]);

    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        if (mode === "create") {
            const obj = {
                classname: state.classname,
                progress: state.progress,
                semester: state.semester,
                schoolyears: state.schoolyears,
            };
            dispatch(createTermClass({ dto: obj }));
        } else if (mode === "edit") {
            const obj = {
                classname: state.classname,
                progress: state.progress,
                semester: state.semester,
                schoolyears: state.schoolyears,
            };
            dispatch(updateTermClass({ id: classTerm.termclassId, dto: obj }));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.push("/class-term-subject");
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
                        ? t("common.add-class-term-subject")
                        : t("common.edit-class-term-subject")
                }
            >
                <section className={styles.container}>
                    {mode === "edit" && (
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Mã học kỳ - lớp"
                                name="termclassId"
                                value={String(state.termclassId)}
                                type="text"
                                required
                                onChange={inputHandle}
                                disabled={mode === "edit"}
                            />
                        </div>
                    )}
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tên lớp"
                            name="classname"
                            value={state.classname}
                            type="text"
                            required
                            onChange={inputHandle}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tiến độ (%)"
                            name="progress"
                            value={state.progress}
                            type="number"
                            required
                            onChange={inputHandle}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Học kỳ"
                            name="semester"
                            value={state.semester}
                            type="number"
                            required
                            onChange={inputHandle}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Năm học"
                            name="schoolyears"
                            value={state.schoolyears}
                            type="number"
                            required
                            onChange={inputHandle}
                        />
                    </div>
                </section>
                <div className={styles.button}>
                    <Button
                        className={styles.buttonAction}
                        onClick={handleSubmit}
                    >
                        {mode === "create"
                            ? t("common.save-button")
                            : t("common.update-button")}
                    </Button>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditClassTermSubject;
