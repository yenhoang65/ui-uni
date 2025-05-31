import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import dynamic from "next/dynamic";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createTrainingProgram,
    getTrainingProgramDetail,
    messageClear,
    updateTrainingProgram,
} from "@/store/reducer/trainingProgramReducer";
import toast from "react-hot-toast";
import { getListSpec } from "@/store/reducer/specializationReducer";

type State = {
    trainingProgramId: number;
    specializationId: number;
    trainingCode: string | null;
    trainingProgramName: string | null;
};

const CreditEditTrainingProgram = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { trainingProgram, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.trainingProgram
    );
    const { specializations } = useSelector(
        (state: RootState) => state.specialization
    );

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<State>({
        trainingProgramId: 0,
        specializationId: 0,
        trainingCode: "",
        trainingProgramName: "",
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
        if (query.id) {
            dispatch(getTrainingProgramDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        dispatch(getListSpec());
    }, []);

    useEffect(() => {
        if (trainingProgram && query.id) {
            setMode("edit");
            setState({
                trainingProgramId: trainingProgram.trainingProgramId,
                specializationId: trainingProgram.specializationId,
                trainingCode: trainingProgram.trainingCode,
                trainingProgramName: trainingProgram.trainingProgramName,
            });
        } else {
            setMode("create");
            setState({
                trainingProgramId: 0,
                specializationId: 0,
                trainingCode: "",
                trainingProgramName: "",
            });
        }
    }, [trainingProgram]);

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                trainingProgramId: state.trainingProgramId,
                specializationId: state.specializationId,
                trainingCode: state.trainingCode,
                trainingProgramName: state.trainingProgramName,
            };
            dispatch(createTrainingProgram({ dto: obj }));
        } else {
            const obj = {
                specializationId: state.specializationId,
                trainingCode: state.trainingCode,
                trainingProgramName: state.trainingProgramName,
            };
            dispatch(
                updateTrainingProgram({
                    id: trainingProgram.trainingProgramId,
                    dto: obj,
                })
            );
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/training-program");
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
                        ? "Thêm chương trình đào tạo"
                        : "Chỉnh sửa chương trình đào tạo"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã"
                            name="trainingProgramId"
                            value={String(state.trainingProgramId)}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tên CTĐT"
                            name="trainingProgramName"
                            value={state.trainingProgramName || ""}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Chọn chuyên ngành"
                            name="specializationId"
                            value={state.specializationId || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={[
                                {
                                    value: "",
                                    label: "----------------------------------------Tất cả-------------------------------------------",
                                },
                                ...specializations.map((spec) => ({
                                    value: spec.specializationId || "",
                                    label:
                                        `${spec.specializationId} - ${spec.specializationName}` ||
                                        "",
                                })),
                            ]}
                            required
                        />
                    </div>

                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="CODE"
                            name="trainingCode"
                            value={state.trainingCode || ""}
                            onChange={inputHandle}
                            type="text"
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

export default CreditEditTrainingProgram;
