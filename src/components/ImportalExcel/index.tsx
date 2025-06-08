import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { Button } from "@/components/Button";
import { useRef, useState } from "react";
import { TypographyBody } from "@/components/TypographyBody";

const ImportExcelFile = () => {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setExcelFile(file);
        }
    };

    const handleFileNameClick = () => {
        if (excelFile) {
            // Cách 1: Mở file (có thể không hoạt động trên mọi trình duyệt/hệ điều hành)
            // window.open(URL.createObjectURL(excelFile));

            // Cách 2: Tự động download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(excelFile);
            link.download = excelFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Chưa có file nào được chọn.");
        }
    };

    const handleImport = () => {
        if (excelFile) {
            // Gửi file này lên backend để xử lý import dữ liệu
            // ...
            alert(`Đã gửi file "${excelFile.name}" lên server.`);
        } else {
            alert("Vui lòng chọn file Excel.");
        }
    };

    return (
        <BorderBox title="Nhập File Excel">
            <div className={styles.excelImportSection}>
                <div className={styles.fileUpload}>
                    <label htmlFor="excelUpload" className={styles.fileLabel}>
                        Chọn file Excel
                    </label>
                    <input
                        type="file"
                        id="excelUpload"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className={styles.fileInput}
                    />
                    {excelFile && (
                        <TypographyBody tag="span" theme="sm">
                            Đã chọn file:
                            <span
                                className={styles.fileName}
                                onClick={handleFileNameClick}
                                style={{
                                    cursor: "pointer",
                                    color: "blue",
                                    textDecoration: "underline",
                                }}
                            >
                                {excelFile.name}
                            </span>
                        </TypographyBody>
                    )}
                </div>

                {excelFile && (
                    <div className={styles.importButtonContainer}>
                        <Button
                            onClick={handleImport}
                            className={styles.importButton}
                        >
                            Nhập Excel
                        </Button>
                    </div>
                )}
            </div>
        </BorderBox>
    );
};

export default ImportExcelFile;
