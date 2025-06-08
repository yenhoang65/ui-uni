import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createMajor,
    getMajorDetail,
    updateMajor,
} from "@/store/reducer/majorReducer";
import { getListFaculty } from "@/store/reducer/facultyReducer";
import toast from "react-hot-toast";
import { messageClear } from "@/store/reducer/majorReducer";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type State = {
    majorId: string | null;
    majorName: string | null;
    majorDateOfEstablishment: string | null;
    majorDescription: string | null;
    majorStatus: string | null;
    facultyId: string | null;
    facultyName: string | null;
};

const CreateEditMajor = () => {
    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");

    const dispatch = useDispatch<AppDispatch>();
    const { major, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.major
    );
    const { faculties } = useSelector((state: RootState) => state.faculty);

    const editor = useRef(null);
    const [state, setState] = useState<State>({
        majorId: "",
        majorName: "",
        majorDateOfEstablishment: "",
        majorDescription: "",
        majorStatus: "",
        facultyId: "",
        facultyName: "",
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
            dispatch(getMajorDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        dispatch(getListFaculty());
    }, []);

    useEffect(() => {
        if (major && query.id) {
            setMode("edit");
            setState({
                majorId: major.majorId,
                majorName: major.majorName,
                majorDateOfEstablishment: major.majorDateOfEstablishment,
                majorDescription: major.majorDescription,
                majorStatus: major.majorStatus,
                facultyId: major.facultyId,
                facultyName: major.facultyName,
            });
        } else {
            setMode("create");
            setState({
                majorId: "",
                majorName: "",
                majorDateOfEstablishment: "",
                majorDescription: "",
                majorStatus: "",
                facultyId: "",
                facultyName: "",
            });
        }
    }, [major]);

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                majorId: state.majorId,
                majorName: state.majorName,
                facultyId: state.facultyId,
                majorDateOfEstablishment: state.majorDateOfEstablishment,
                majorDescription: state.majorDescription,
                majorStatus: state.majorStatus,
            };
            dispatch(createMajor({ dto: obj }));
        } else {
            const obj = {
                majorName: state.majorName,
                facultyId: state.facultyId,
                majorDateOfEstablishment: state.majorDateOfEstablishment,
                majorDescription: state.majorDescription,
                majorStatus: state.majorStatus,
            };
            dispatch(updateMajor({ id: major.majorId, dto: obj }));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.back();
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
                    mode === "create" ? "Thêm ngành học" : "Chỉnh sửa ngành học"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã ngành"
                            name="majorId"
                            value={state.majorId || ""}
                            onChange={inputHandle}
                            type="text"
                            required
                            disabled={mode === "edit"}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Chọn khoa"
                            name="facultyId"
                            value={state.facultyId || ""}
                            onChange={inputHandle}
                            options={faculties.map((faculty) => ({
                                value: faculty.facultyId || "",
                                label: faculty.facultyName || "",
                            }))}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tên ngành"
                            name="majorName"
                            value={state.majorName || ""}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Ngày thành lập"
                            name="majorDateOfEstablishment"
                            value={state.majorDateOfEstablishment || ""}
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
                        value={state.majorDescription || ""}
                        onChange={(newContent) =>
                            setState({ ...state, majorDescription: newContent })
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

export default CreateEditMajor;
