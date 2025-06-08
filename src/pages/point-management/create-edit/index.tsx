import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import AuthGuard from "@/components/AuthGuard";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
    createPoint,
    getPoint,
    getPointDetail,
    messageClear,
    updatePoint,
} from "@/store/reducer/pointReducer";
import { stat } from "fs";
import { create } from "domain";

type State = {
    gradeTypeId: string;
    code: string;
    name: string;
    coefficient: string;
};

const MOCK_GRADE_TYPES = [
    {
        grade_type_id: "1",
        code: "MID",
        name: "Giữa kỳ",
        coefficient: "0.4",
    },
    {
        grade_type_id: "2",
        code: "FINAL",
        name: "Cuối kỳ",
        coefficient: "0.6",
    },
];

const CreateEditPoint = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { point, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [gradeTypes, setGradeTypes] = useState(MOCK_GRADE_TYPES);
    const [state, setState] = useState<State>({
        gradeTypeId: "",
        code: "",
        name: "",
        coefficient: "",
    });

    useEffect(() => {
        if (query.id) {
            dispatch(getPointDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (point && query.id) {
            setMode("edit");

            setState({
                gradeTypeId: point.gradeTypeId ?? "",
                code: point.code ?? "",
                name: point.name ?? "",
                coefficient: point.coefficient ?? "",
            });
        } else {
            setMode("create");
            setState({
                gradeTypeId: "",
                code: "",
                name: "",
                coefficient: "",
            });
        }
    }, [point, query.id, dispatch]);

    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (!state.code || !state.name || !state.coefficient) {
            toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        const obj = {
            code: state.code,
            name: state.name,
            coefficient: state.coefficient,
        };
        if (mode === "create") {
            dispatch(createPoint({ dto: obj }));
        } else {
            dispatch(updatePoint({ id: point.gradeTypeId, dto: obj }));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/point-management");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox
                title={
                    mode === "create" ? "Thêm loại điểm" : "Chỉnh sửa loại điểm"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã loại điểm"
                            name="code"
                            value={state.code}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Tên loại điểm"
                            name="name"
                            value={state.name}
                            onChange={inputHandle}
                            type="text"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Hệ số"
                            name="coefficient"
                            value={state.coefficient}
                            onChange={inputHandle}
                            type="number"
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

export default CreateEditPoint;
