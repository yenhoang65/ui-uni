import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/Button";

type ClassScheduleType = {
    id: string;
    maLop: string;
    tenGiangVien: string;
    phongHoc: string;
    tietHoc: string;
    ngayHoc: string; // Format: YYYY-MM-DD
    sySo?: number; // Optional: Add sỹ số if available in your data
};

// Dữ liệu lớp học theo ngày (MOCK DATA - Replace with your API call)
const classSchedules: ClassScheduleType[] = [
    {
        id: "SCH001",
        maLop: "MH001",
        tenGiangVien: "Nguyễn Văn A",
        phongHoc: "P.101",
        tietHoc: "1-3",
        ngayHoc: "2025-05-03",
    },
    {
        id: "SCH002",
        maLop: "MH002",
        tenGiangVien: "Trần Thị B",
        phongHoc: "Lab.A",
        tietHoc: "4-6",
        ngayHoc: "2025-05-02",
    },
    {
        id: "SCH003",
        maLop: "MH001",
        tenGiangVien: "Nguyễn Văn A",
        phongHoc: "P.102",
        tietHoc: "7-9",
        ngayHoc: "2025-05-02",
    },
    {
        id: "SCH004",
        maLop: "MH003",
        tenGiangVien: "Lê Văn C",
        phongHoc: "H.205",
        tietHoc: "1-3",
        ngayHoc: "2025-05-03",
    },
];

const ClassScheduleToday = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().slice(0, 10)
    );

    // Lọc danh sách lớp học theo ngày đã chọn
    const filteredByDate = classSchedules.filter(
        (schedule) => schedule.ngayHoc === selectedDate
    );

    const handlePrintList = () => {
        // Logic để in danh sách các lớp học theo ngày đã chọn
        alert(
            `Chức năng in danh sách ngày ${selectedDate} sẽ được triển khai tại đây!`
        );
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    return (
        <AuthGuard allowedRoles={["admin", "employee"]}>
            <BorderBox title={`Lịch học ngày ${selectedDate}`}>
                <div className={styles.box}>
                    <div className={styles.add}>
                        <div className={styles.filter}>
                            <label
                                htmlFor="datePicker"
                                className={styles.label}
                            >
                                Chọn ngày:
                            </label>
                            <input
                                type="date"
                                id="datePicker"
                                className={styles.datePicker}
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>

                        <Button
                            className={styles.buttonAdd}
                            onClick={handlePrintList}
                        >
                            <FaPrint /> In danh sách
                        </Button>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "80px" }}>No</th>
                                    <th style={{ minWidth: "120px" }}>
                                        Mã lớp
                                    </th>
                                    <th style={{ minWidth: "200px" }}>
                                        Tên giảng viên
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        Phòng học
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        Tiết học
                                    </th>
                                    <th style={{ minWidth: "100px" }}>Sỹ số</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classSchedules.map((schedule, index) => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.id}</td>
                                        <td>{schedule.maLop}</td>
                                        <td>{schedule.tenGiangVien}</td>
                                        <td>{schedule.phongHoc}</td>
                                        <td>{schedule.tietHoc}</td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassScheduleToday;
