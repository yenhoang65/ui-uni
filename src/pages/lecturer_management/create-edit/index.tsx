import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createLecturer,
    getLecturerDetail,
    getListLecturer,
    importLecturer,
    messageClear,
    updateLecturer,
} from "@/store/reducer/lecturerReducer";
import { getListMajor } from "@/store/reducer/majorReducer";
import toast from "react-hot-toast";

type Lecturer = {
    userId: number;
    userName: string;
    admissionDate: Date;
    gender: string;
    phoneNumber: string;
    address: string;
    ethnicGroup: string;
    dateOfBirth: Date;
    religion: string;
    idNumber: string;
    email: string;
    placeOfBirth: string;
    permanentResident: string;
    bank: string;
    bankAccountOwner: string;
    bankAccountNumber: string;
    status: string;

    academicDegree: string;
    graduatedFrom: string;
    position: string;
    majorId: number;

    majorName: string;
};

const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const CreateEditLecturer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { lecturer, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.lecturer
    );
    const { majors } = useSelector((state: RootState) => state.major);

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [showImportFile, setShowImportFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [state, setState] = useState<Lecturer>({
        userId: 0,
        userName: "",
        admissionDate: new Date(),
        gender: "",
        phoneNumber: "",
        address: "",
        ethnicGroup: "",
        dateOfBirth: new Date(),
        religion: "",
        idNumber: "",
        email: "",
        placeOfBirth: "",
        permanentResident: "",
        bank: "",
        bankAccountOwner: "",
        bankAccountNumber: "",
        status: "",

        academicDegree: "",
        graduatedFrom: "",
        position: "",
        majorId: 0,

        majorName: "",
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
        dispatch(getListMajor());
    }, []);

    useEffect(() => {
        if (query.id && typeof query.id === "string") {
            dispatch(getLecturerDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (lecturer && query.id) {
            setMode("edit");
            setShowImportFile(false);

            setState({
                userId: lecturer.userId,
                userName: lecturer.userName,
                admissionDate: lecturer.admissionDate,
                gender: lecturer.gender,
                phoneNumber: lecturer.phoneNumber,
                address: lecturer.address,
                ethnicGroup: lecturer.ethnicGroup,
                dateOfBirth: lecturer.dateOfBirth,
                religion: lecturer.religion,
                idNumber: lecturer.idNumber,
                email: lecturer.email,
                placeOfBirth: lecturer.placeOfBirth,
                permanentResident: lecturer.permanentResident,
                bank: lecturer.bank,
                bankAccountOwner: lecturer.bankAccountOwner,
                bankAccountNumber: lecturer.bankAccountNumber,
                status: lecturer.status,

                academicDegree: lecturer.academicDegree,
                graduatedFrom: lecturer.graduatedFrom,
                position: lecturer.position,
                majorId: lecturer.majorId,

                majorName: lecturer.majorName,
            });
        } else {
            setMode("create");
            setShowImportFile(false);
            setState({
                userId: 0,
                userName: "",
                admissionDate: new Date(),
                gender: "",
                phoneNumber: "",
                address: "",
                ethnicGroup: "",
                dateOfBirth: new Date(),
                religion: "",
                idNumber: "",
                email: "",
                placeOfBirth: "",
                permanentResident: "",
                bank: "",
                bankAccountOwner: "",
                bankAccountNumber: "",
                status: "",

                academicDegree: "",
                graduatedFrom: "",
                position: "",
                majorId: 0,

                majorName: "",
            });
            setSelectedFile(null);
            setFileName(null);
        }
    }, [lecturer, query.id]);

    const formatDate = (date: Date) =>
        date ? new Date(date).toISOString().slice(0, 10) : "";

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                userName: state.userName,

                gender: state.gender,
                phoneNumber: state.phoneNumber,
                address: state.address,
                ethnicGroup: state.ethnicGroup,
                dateOfBirth: formatDate(state.dateOfBirth),
                admissionDate: formatDate(state.admissionDate),
                religion: state.religion,
                idNumber: state.idNumber,
                email: state.email,
                placeOfBirth: state.placeOfBirth,
                permanentResident: state.permanentResident,
                bank: state.bank,
                bankAccountOwner: state.bankAccountOwner,
                bankAccountNumber: state.bankAccountNumber,
                status: state.status,

                academicDegree: state.academicDegree,
                graduatedFrom: state.graduatedFrom,
                position: state.position,
                majorId: state.majorId,
            };
            dispatch(createLecturer({ dto: obj }));
        } else {
            const obj = {
                userName: state.userName,

                gender: state.gender,
                phoneNumber: state.phoneNumber,
                address: state.address,
                ethnicGroup: state.ethnicGroup,
                dateOfBirth: state.dateOfBirth,
                admissionDate: state.admissionDate,
                religion: state.religion,
                idNumber: state.idNumber,
                email: state.email,
                placeOfBirth: state.placeOfBirth,
                permanentResident: state.permanentResident,
                bank: state.bank,
                bankAccountOwner: state.bankAccountOwner,
                bankAccountNumber: state.bankAccountNumber,
                status: state.status,

                academicDegree: state.academicDegree,
                graduatedFrom: state.graduatedFrom,
                position: state.position,
                majorId: state.majorId,
            };
            dispatch(updateLecturer({ id: lecturer.userId, dto: obj }));
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
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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

    const handleProcessImport = () => {
        if (selectedFile) {
            dispatch(importLecturer(selectedFile));
        } else {
            toast.error("Vui lòng chọn file Excel trước khi import");
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/lecturer_management");
            dispatch(getListLecturer());
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
                        ? "Thêm giảng viên"
                        : "Chỉnh sửa giảng viên"
                }
            >
                <div className={styles.headerActions}>
                    {mode === "create" && !showImportFile && (
                        <Button
                            onClick={handleImportButtonClick}
                            className={styles.importButton}
                        >
                            Import từ Excel
                        </Button>
                    )}
                </div>

                {mode === "create" && showImportFile && (
                    <>
                        <div className={styles.template}>
                            <TypographyBody tag="span" theme="md-bold">
                                Template:
                            </TypographyBody>
                            <Image
                                src={require("./assets/template.png")}
                                alt="Picture of the author"
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
                        {/* Các input form giữ nguyên */}
                        {/* <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Mã giảng viên"
                                name="userId"
                                value={String(state.userId)}
                                onChange={inputHandle}
                                type="text"
                                required
                                disabled={mode === "edit"}
                            />
                        </div> */}
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tên giảng viên"
                                name="userName"
                                value={state.userName}
                                onChange={inputHandle}
                                type="text"
                                required
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Giới tính"
                                name="gender"
                                value={state.gender}
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
                                value={
                                    state.dateOfBirth
                                        ? new Date(state.dateOfBirth)
                                              .toISOString()
                                              .slice(0, 10)
                                        : ""
                                }
                                onChange={inputHandle}
                                type="date"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số điện thoại"
                                name="phoneNumber"
                                value={state.phoneNumber}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Địa chỉ"
                                name="address"
                                value={state.address}
                                onChange={inputHandle}
                                type="text"
                                required
                                disabled={mode === "edit"}
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Email"
                                name="email"
                                value={state.email}
                                onChange={inputHandle}
                                type="email"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số CMND/CCCD"
                                name="idNumber"
                                value={state.idNumber}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Ngày vào trường"
                                name="admissionDate"
                                value={
                                    state.admissionDate
                                        ? new Date(state.admissionDate)
                                              .toISOString()
                                              .slice(0, 10)
                                        : ""
                                }
                                onChange={inputHandle}
                                type="date"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Dân tộc"
                                name="ethnicGroup"
                                value={state.ethnicGroup}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tôn giáo"
                                name="religion"
                                value={state.religion}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Nơi sinh"
                                name="placeOfBirth"
                                value={state.placeOfBirth}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Thường trú"
                                name="permanentResident"
                                value={state.permanentResident}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Ngân hàng"
                                name="bank"
                                value={state.bank}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Chủ tài khoản"
                                name="bankAccountOwner"
                                value={state.bankAccountOwner}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số tài khoản"
                                name="bankAccountNumber"
                                value={state.bankAccountNumber}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Ngành"
                                name="majorId"
                                value={state.majorId}
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
                                label="Học vị"
                                name="academicDegree"
                                value={state.academicDegree}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tốt nghiệp từ"
                                name="graduatedFrom"
                                value={state.graduatedFrom}
                                onChange={inputHandle}
                                type="text"
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Vị trí"
                                name="position"
                                value={state.position || "active"}
                                onChange={inputHandle}
                                options={[
                                    {
                                        value: "Giảng viên",
                                        label: "Giảng viên",
                                    },
                                    {
                                        value: "Nhân viên phòng đào tạo",
                                        label: "Nhân viên phòng đào tạo",
                                    },
                                    { value: "Admin", label: "Admin" },
                                ]}
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <SelectWithLabel
                                label="Trạng thái"
                                name="status"
                                value={state.status || "active"}
                                onChange={inputHandle}
                                options={[
                                    { value: "active", label: "Active" },
                                    { value: "inactive", label: "Inactive" },
                                ]}
                            />
                        </div>
                    </section>
                )}

                {(mode === "edit" ||
                    (mode === "create" && !showImportFile)) && (
                    <div className={styles.button}>
                        <Button
                            className={styles.buttonAction}
                            onClick={handleSubmit}
                        >
                            {mode === "create" ? "Lưu" : "Cập nhật"}
                        </Button>
                    </div>
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditLecturer;
