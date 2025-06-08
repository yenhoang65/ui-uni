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
    createSpec,
    getSpecDetail,
    updateSpec,
} from "@/store/reducer/specializationReducer";
import { getListMajor } from "@/store/reducer/majorReducer";
import toast from "react-hot-toast";
import { messageClear } from "@/store/reducer/specializationReducer";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type State = {
    specializationId: string | null;
    specializationName: string | null;
    specializationDateOfEstablishment: string | null;
    specializationDescription: string | null;
    specializationStatus: string | null;
    majorName: string | null;
    majorId: string | null;
};

const CreateEditSpecialization = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { specialization, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.specialization
    );
    const { majors } = useSelector((state: RootState) => state.major);

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const editor = useRef(null);
    const [state, setState] = useState<State>({
        specializationId: "",
        specializationName: "",
        specializationDateOfEstablishment: "",
        specializationDescription: "",
        specializationStatus: "",
        majorName: "",
        majorId: "",
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
            dispatch(getSpecDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        dispatch(getListMajor());
    }, []);

    useEffect(() => {
        if (specialization && query.id) {
            setMode("edit");

            setState({
                specializationId: specialization.specializationId,
                specializationName: specialization.specializationName,
                specializationDateOfEstablishment:
                    specialization.specializationDateOfEstablishment,
                specializationDescription:
                    specialization.specializationDescription,
                specializationStatus: specialization.specializationStatus,
                majorName: specialization.majorName,
                majorId: specialization.majorId,
            });
        } else {
            setMode("create");
            setState({
                specializationId: "",
                specializationName: "",
                specializationDateOfEstablishment: "",
                specializationDescription: "",
                specializationStatus: "",
                majorName: "",
                majorId: "",
            });
        }
    }, [specialization]);

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                specializationId: state.specializationId,
                specializationName: state.specializationName,
                specializationDateOfEstablishment:
                    state.specializationDateOfEstablishment,
                specializationDescription: state.specializationDescription,
                specializationStatus: state.specializationStatus,
                majorId: state.majorId,
            };
            dispatch(createSpec({ dto: obj }));
        } else {
            const obj = {
                specializationName: state.specializationName,
                specializationDateOfEstablishment:
                    state.specializationDateOfEstablishment,
                specializationDescription: state.specializationDescription,
                specializationStatus: state.specializationStatus,
                majorId: state.majorId,
            };
            dispatch(
                updateSpec({ id: specialization.specializationId, dto: obj })
            );
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.push("/specialization");
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
                        ? "Thêm chuyên ngành"
                        : "Chỉnh sửa chuyên ngành"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã chuyên ngành"
                            name="specializationId"
                            value={state.specializationId || ""}
                            onChange={inputHandle}
                            type="text"
                            required
                            disabled={mode === "edit"}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Chọn ngành"
                            name="majorId"
                            value={state.majorId || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={majors.map((major) => ({
                                value: major.majorId || "",
                                label: major.majorName || "",
                            }))}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tên chuyên ngành"
                            name="specializationName"
                            value={state.specializationName || ""}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Ngày thành lập"
                            name="specializationDateOfEstablishment"
                            value={
                                state.specializationDateOfEstablishment || ""
                            }
                            onChange={inputHandle}
                            type="date"
                        />
                    </div>
                </section>

                <div className={styles.description}>
                    <TypographyBody
                        tag="span"
                        theme="md"
                        className={styles.label}
                    >
                        Mô tả
                    </TypographyBody>
                    <JoditEditor
                        ref={editor}
                        value={state.specializationDescription || ""}
                        onChange={(newContent) =>
                            setState({
                                ...state,
                                specializationDescription: newContent,
                            })
                        }
                        className={styles.inputDesc}
                    />
                </div>

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

export default CreateEditSpecialization;
