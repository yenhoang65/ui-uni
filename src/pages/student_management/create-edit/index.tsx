import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createStudent,
    getStudentDetail,
    importFileStudent,
    messageClear,
    updateStudent,
} from "@/store/reducer/studentReducer";
import toast from "react-hot-toast";
import { getListClassOffical } from "@/store/reducer/classReducer";
import { getListSpec } from "@/store/reducer/specializationReducer";
import Image from "next/image";

type Student = {
    userId: number;
    userName: string | "";
    gender: string | "";
    phoneNumber: string | "";
    dateOfBirth: string | "";
    educationLevel: string | "";
    admissionDate: string | "";
    typeOfTraining: string | "";
    specializationId: number;
    specializationName: string | "";
    status: string | "";
    classId: number;

    email: string | "";
    address: string | "";
    ethnicGroup: string | "";
    religion: string | "";

    idNumber: string | "";
    placeOfBirth: string | "";
    permanentResident: string | "";
    bank: string | "";
    bankAccountOwner: string | "";
    bankAccountNumber: string | "";
};

const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const educationLevelOptions = [
    { value: "Đại học", label: "Đại học" },
    { value: "Cao đẳng", label: "Cao đẳng" },
    { value: "Trung cấp", label: "Trung cấp" },
];

const trainingTypeOptions = [
    { value: "Chính quy", label: "Chính quy" },
    { value: "Vừa học vừa làm", label: "Vừa học vừa làm" },
    { value: "Từ xa", label: "Từ xa" },
];

const CreateEditStudent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { student, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.student
    );

    const { classOfficals } = useSelector((state: RootState) => state.class);
    const { specializations } = useSelector(
        (state: RootState) => state.specialization
    );

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<Student>({
        userId: 0,
        userName: "",
        gender: "",
        phoneNumber: "",
        dateOfBirth: "",
        educationLevel: "",
        admissionDate: "",
        typeOfTraining: "",
        specializationId: 0,
        specializationName: "",
        status: "",
        classId: 0,
        email: "",
        address: "",
        ethnicGroup: "",
        religion: "",
        idNumber: "",
        placeOfBirth: "",
        permanentResident: "",
        bank: "",
        bankAccountOwner: "",
        bankAccountNumber: "",
    });

    const [showImportFile, setShowImportFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        dispatch(getListClassOffical());
        dispatch(getListSpec());
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
            dispatch(getStudentDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (student && query.id) {
            setMode("edit");
            setState({
                userId: student.userId,
                userName: student.userName,
                gender: student.gender,
                phoneNumber: student.phoneNumber,
                dateOfBirth: student.dateOfBirth,
                educationLevel: student.educationLevel,
                admissionDate: student.admissionDate,
                typeOfTraining: student.typeOfTraining,
                specializationId: student.specializationId,
                specializationName: student.specializationName,
                status: student.status,
                classId: student.classId,
                email: student.email,
                address: student.address,
                ethnicGroup: student.ethnicGroup,
                religion: student.religion,
                idNumber: student.idNumber,
                placeOfBirth: student.placeOfBirth,
                permanentResident: student.permanentResident,
                bank: student.bank,
                bankAccountOwner: student.bankAccountOwner,
                bankAccountNumber: student.bankAccountNumber,
            });
        } else {
            setMode("create");
            setState({
                userId: 0,
                userName: "",
                gender: "",
                phoneNumber: "",
                dateOfBirth: "",
                educationLevel: "",
                admissionDate: "",
                typeOfTraining: "",
                specializationId: 0,
                specializationName: "",
                status: "",
                classId: 0,
                email: "",
                address: "",
                ethnicGroup: "",
                religion: "",
                idNumber: "",
                placeOfBirth: "",
                permanentResident: "",
                bank: "",
                bankAccountOwner: "",
                bankAccountNumber: "",
            });
        }
    }, [student, query.id]);

    const handleSubmit = () => {
        const obj = {
            userId: state.userId,
            userName: state.userName,
            gender: state.gender,
            phoneNumber: state.phoneNumber,
            dateOfBirth: state.dateOfBirth ? new Date(state.dateOfBirth) : null,
            educationLevel: state.educationLevel,
            admissionDate: state.admissionDate
                ? new Date(state.admissionDate)
                : null,
            typeOfTraining: state.typeOfTraining,
            specializationId: state.specializationId,
            specializationName: state.specializationName,
            status: state.status,
            classId: state.classId,
            email: state.email,
            address: state.address,
            ethnicGroup: state.ethnicGroup,
            religion: state.religion,
            idNumber: state.idNumber,
            placeOfBirth: state.placeOfBirth,
            permanentResident: state.permanentResident,
            bank: state.bank,
            bankAccountOwner: state.bankAccountOwner,
            bankAccountNumber: state.bankAccountNumber,
        };

        if (mode === "create") {
            dispatch(createStudent({ dto: obj }));
        } else {
            dispatch(updateStudent({ id: student.userId, dto: obj }));
        }
    };

    const handleImportButtonClick = () => {
        setShowImportFile(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    const handleCancelImport = () => {
        setShowImportFile(false);
        setSelectedFile(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleProcessImport = () => {
        if (selectedFile) {
            dispatch(importFileStudent(selectedFile)); // gọi reducer xử lý file
        } else {
            toast.error("Vui lòng chọn file Excel trước khi import");
        }
    };

    const handleDownloadClick = () => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            const a = document.createElement("a");
            a.href = url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.push("/student_management");
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
                    mode === "create" ? "Thêm sinh viên" : "Chỉnh sửa sinh viên"
                }
            >
                {mode === "create" && !showImportFile && (
                    <div className={styles.headerActions}>
                        <Button
                            onClick={handleImportButtonClick}
                            className={styles.importButton}
                        >
                            Import từ Excel
                        </Button>
                    </div>
                )}

                {mode === "create" && showImportFile && (
                    <>
                        <div className={styles.template}>
                            <TypographyBody tag="span" theme="md-bold">
                                Template:
                            </TypographyBody>
                            <Image
                                src={require("./assets/template.png")}
                                alt="Template"
                                className={styles.imageTemplate}
                            />
                        </div>
                        <div className={styles.excelImportSection}>
                            <div className={styles.fileUpload}>
                                <label
                                    htmlFor="fileInput"
                                    className={styles.fileLabel}
                                >
                                    Chọn file Excel
                                </label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".xlsx, .csv"
                                    className={styles.fileInput}
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                                {fileName && (
                                    <TypographyBody
                                        tag="span"
                                        className={styles.fileName}
                                        onClick={handleDownloadClick}
                                        style={{
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: "blue",
                                        }}
                                    >
                                        Đã chọn: {fileName}
                                    </TypographyBody>
                                )}
                            </div>
                            <div className={styles.importActions}>
                                <Button
                                    onClick={handleCancelImport}
                                    className={styles.buttonAction}
                                >
                                    Hủy
                                </Button>
                                {fileName && (
                                    <Button
                                        onClick={handleProcessImport}
                                        className={styles.buttonAction}
                                    >
                                        Xử lý Import
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {(mode === "edit" ||
                    (mode === "create" && !showImportFile)) && (
                    <section className={styles.container}>
                        {mode == "edit" && (
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label="Mã sinh viên"
                                    name="userId"
                                    value={String(state.userId)}
                                    onChange={inputHandle}
                                    type="text"
                                    required
                                    disabled={mode === "edit"}
                                />
                            </div>
                        )}

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tên sinh viên"
                                name="userName"
                                value={state.userName || ""}
                                onChange={inputHandle}
                                type="text"
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Giới tính"
                                name="gender"
                                value={state.gender || ""}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={genderOptions}
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Ngày sinh"
                                name="dateOfBirth"
                                value={state.dateOfBirth || ""}
                                onChange={inputHandle}
                                type="date"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Ngày vào trường"
                                name="admissionDate"
                                value={state.admissionDate || ""}
                                onChange={inputHandle}
                                type="date"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số điện thoại"
                                name="phoneNumber"
                                value={state.phoneNumber || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Email"
                                name="email"
                                value={state.email || ""}
                                onChange={inputHandle}
                                type="email"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số CMND/CCCD"
                                name="idNumber"
                                value={state.idNumber || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Dân tộc"
                                name="ethnicGroup"
                                value={state.ethnicGroup || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tôn giáo"
                                name="religion"
                                value={state.religion || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Nơi sinh"
                                name="placeOfBirth"
                                value={state.placeOfBirth || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Thường trú"
                                name="permanentResident"
                                value={state.permanentResident || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Ngân hàng"
                                name="bank"
                                value={state.bank || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Chủ tài khoản"
                                name="bankAccountOwner"
                                value={state.bankAccountOwner || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số tài khoản"
                                name="bankAccountNumber"
                                value={state.bankAccountNumber || ""}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Trình độ học vấn"
                                name="educationLevel"
                                value={state.educationLevel || ""}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...educationLevelOptions,
                                ]}
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Chuyên ngành"
                                name="specializationId"
                                value={state.specializationId}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...specializations.map((spec) => ({
                                        value: String(spec.specializationId),
                                        label: String(spec.specializationName),
                                    })),
                                ]}
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Hình thức đào tạo"
                                name="typeOfTraining"
                                value={state.typeOfTraining || ""}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...trainingTypeOptions,
                                ]}
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Lớp"
                                name="classId"
                                value={String(state.classId) || ""}
                                onChange={
                                    inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...classOfficals.map((offClass) => ({
                                        value: String(offClass.classId),
                                        label: String(offClass.classId),
                                    })),
                                ]}
                                required
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
                    </section>
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditStudent;
