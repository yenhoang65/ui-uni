import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import SelectWithLabel from "@/components/SelectWithLabel";
import { Button } from "@/components/Button";
import Image from "next/image";
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createSubject,
    getSubjectDetail,
    updateSubject,
} from "@/store/reducer/subjectReducer";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { messageClear } from "@/store/reducer/subjectReducer";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type Subject = {
    subjectId: string | null;
    subjectName: string | null;
    ltCredits: number;
    thCredits: number;
    subjectDescription: string | null;
    subjectCoefficient: number;
};

const CreateEditSubject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subject, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.subject
    );
    const editor = useRef(null);
    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");

    const [showImportFile, setShowImportFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [state, setState] = useState<Subject>({
        subjectId: "",
        subjectName: "",
        ltCredits: 0,
        thCredits: 0,
        subjectDescription: "",
        subjectCoefficient: 0,
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
            dispatch(getSubjectDetail(query.id));
        }
    }, [query.id]);

    useEffect(() => {
        if (subject && query.id) {
            setMode("edit");
            setShowImportFile(false);

            setState({
                subjectId: subject.subjectId,
                subjectName: subject.subjectName,
                ltCredits: subject.ltCredits,
                thCredits: subject.thCredits,
                subjectDescription: subject.subjectDescription,
                subjectCoefficient: subject.subjectCoefficient,
            });
        } else {
            setMode("create");
            setShowImportFile(false);
            setState({
                subjectId: "",
                subjectName: "",
                ltCredits: 0,
                thCredits: 0,
                subjectDescription: "",
                subjectCoefficient: 0,
            });
            setSelectedFile(null);
            setFileName(null);
        }
    }, [subject, query.id]);

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                subjectId: state.subjectId,
                subjectName: state.subjectName,
                ltCredits: state.ltCredits,
                thCredits: state.thCredits,
                subjectDescription: state.subjectDescription,
                subjectCoefficient: state.subjectCoefficient,
            };
            dispatch(createSubject({ dto: obj }));
        } else {
            const obj = {
                subjectName: state.subjectName,
                ltCredits: state.ltCredits,
                thCredits: state.thCredits,
                subjectDescription: state.subjectDescription,
                subjectCoefficient: state.subjectCoefficient,
            };
            dispatch(updateSubject({ id: subject.subjectId, dto: obj }));
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
            // Implement your file processing logic here for subjects
            // After processing, you might want to redirect or update the UI
        } else {
            alert("Vui lòng chọn một file để import.");
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.push("/subject");

            // const obj = {
            //     parPage: parseInt(parPage),
            //     currentPage: parseInt(currentPage),
            //     searchValue,
            //     typeCate,
            // };
            // dispatch(get_category(obj));

            // setState({
            //     name: "",
            //     image: "",
            //     type: "",
            // });
            // setImageShow("");
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
                    mode === "create" ? "Thêm mới môn học" : "Chỉnh sửa môn học"
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
                                alt="Subject Import Template"
                                className={styles.imageTemplate}
                                width={300}
                                height={200}
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
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Mã môn học"
                                name="subjectId"
                                value={state.subjectId || ""}
                                onChange={inputHandle}
                                type="text"
                                required
                                disabled={mode === "edit"}
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Tên môn học"
                                name="subjectName"
                                value={state.subjectName || ""}
                                onChange={inputHandle}
                                type="text"
                                required
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số tín chỉ lý thuyết"
                                name="ltCredits"
                                value={String(state.ltCredits)}
                                onChange={inputHandle}
                                type="number"
                                required
                            />
                        </div>
                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Số tín chỉ thực hành"
                                name="thCredits"
                                value={String(state.thCredits)}
                                onChange={inputHandle}
                                type="number"
                                required
                            />
                        </div>

                        <div className={styles.gridItem}>
                            <InputWithLabel
                                label="Hệ số môn học"
                                name="subjectCoefficient"
                                value={String(state.subjectCoefficient)}
                                onChange={inputHandle}
                                type="number"
                            />
                        </div>
                        <div className={styles.gridItemFull}>
                            {/* <InputWithLabel
                                label="Mô tả môn học"
                                name="subjectDescription"
                                value={state.subjectDescription || ""}
                                onChange={inputHandle}
                                type="textarea"
                            /> */}

                            <TypographyBody
                                tag="span"
                                theme="md"
                                className={styles.label}
                            >
                                Mô tả
                            </TypographyBody>
                            <JoditEditor
                                ref={editor}
                                value={state.subjectDescription || ""}
                                onChange={(newContent) =>
                                    setState({
                                        ...state,
                                        subjectDescription: newContent,
                                    })
                                }
                                className={styles.inputDesc}
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

export default CreateEditSubject;
