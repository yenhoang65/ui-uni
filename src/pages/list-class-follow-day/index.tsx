import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getClassFollowDay } from "@/store/reducer/classReducer";
import { TypographyBody } from "@/components/TypographyBody";
import { exportScheduleExcel } from "@/constants/exportTimeline";

const ClassScheduleToday = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classFollowDay } = useSelector((state: RootState) => state.class);

    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().slice(0, 10)
    );

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    useEffect(() => {
        if (selectedDate) {
            dispatch(getClassFollowDay(selectedDate));
        }
    }, [selectedDate, dispatch]);

    const handlePrintList = () => {
        const formatted = classFollowDay.map((item: any, index: number) => ({
            stt: index + 1,
            className: item.className,
            lecturerName: item.lecturerName,
            room: `DH30${index + 1}`,
            lesson: item.lesson,
        }));

        exportScheduleExcel(formatted, selectedDate);
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
                        {classFollowDay.length > 0 ? (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th style={{ width: "80px" }}>No</th>
                                        <th style={{ width: "150px" }}>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {classFollowDay.map(
                                        (schedule: any, index: any) => (
                                            <tr key={schedule.sessionId}>
                                                <td>{index + 1}</td>
                                                <td>{schedule.className}</td>
                                                <td>{schedule.lecturerName}</td>
                                                <td>
                                                    DH30{index + 1} -{" "}
                                                    {schedule.classroomName}
                                                </td>
                                                <td>{schedule.lesson}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <TypographyBody
                                tag="span"
                                theme="lg"
                                className={styles.noData}
                            >
                                Không có dữ liệu
                            </TypographyBody>
                        )}
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassScheduleToday;
