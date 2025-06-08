import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import { getViewAttendanceForStu } from "@/store/reducer/classReducer";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import { vi } from "date-fns/locale";
import { TypographyBody } from "@/components/TypographyBody";
import { getSubjectDetail } from "@/store/reducer/subjectReducer";
import clsx from "clsx";
import { AiOutlineWarning } from "react-icons/ai";

interface AttendanceRecord {
    attendanceId: number | null;
    scheduledDate: string;
    status: string;
    note: string;
    classStudentId: number;
    userId: number;
}

interface Props {
    data: AttendanceRecord[];
}

const AttendanceList: React.FC<Props> = ({ data }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "present":
                return styles.present;
            case "absent":
                return styles.absent;
            case "Chưa điểm danh":
            default:
                return styles.notYet;
        }
    };

    const dispatch = useDispatch<AppDispatch>();

    const { attendance } = useSelector((state: RootState) => state.class);
    const { subject } = useSelector((state: RootState) => state.subject);

    const router = useRouter();
    const { classId, subjectId } = router.query;

    useEffect(() => {
        if (classId) {
            dispatch(getViewAttendanceForStu(classId));
        }
    }, [dispatch, classId]);

    useEffect(() => {
        if (subjectId) {
            dispatch(getSubjectDetail(subjectId));
        }
    }, [dispatch, subjectId]);

    const lt = subject.ltCredits || 0;
    const th = subject.thCredits || 0;

    const totalLtLessons = lt * 15;
    const totalThLessons = th * 30;

    const allowedLtAbsents = Math.floor(totalLtLessons * 0.2);
    const allowedThAbsents = Math.floor(totalThLessons * 0.2);

    const totalLtAbsents = attendance.filter(
        (item: any) => item.status === "absent" && item.classType === "LT"
    ).length;

    const totalThAbsents = attendance.filter(
        (item: any) => item.status === "absent" && item.classType === "TH"
    ).length;

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title={`Lịch sử điểm danh - `}>
                <div className={styles.subjectInfo}>
                    <p>
                        <strong>Tên môn học:</strong> {subject.subjectName} - (
                        {subject.ltCredits} - {subject.thCredits})
                    </p>
                    <p>
                        <strong>Hệ số:</strong> {subject.subjectCoefficient}
                    </p>
                </div>
                <div className={styles.fixedWarningBox}>
                    <AiOutlineWarning className={styles.warningIcon} />
                    <div>
                        <span>
                            Bạn chỉ được nghỉ tối đa{" "}
                            <strong>{allowedLtAbsents}</strong> tiết lý thuyết
                            và <strong>{allowedThAbsents}</strong> tiết thực
                            hành. Vượt quá sẽ không đủ điều kiện thi.
                        </span>
                    </div>
                </div>

                <div className={styles.container}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>STT</th>
                                <th className={styles.tableHeader}>Ngày học</th>
                                <th className={styles.tableHeader}>
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length > 0 &&
                                attendance.map((record: any, index: number) => (
                                    <tr key={index}>
                                        <td className={styles.tableCell}>
                                            {index + 1}
                                        </td>
                                        <td className={styles.tableCell}>
                                            {format(
                                                new Date(record.scheduledDate),
                                                "EEEE, dd/MM/yyyy",
                                                { locale: vi }
                                            )}
                                        </td>
                                        <td
                                            className={getStatusColor(
                                                record.status
                                            )}
                                        >
                                            {record.status === "present"
                                                ? "Có mặt"
                                                : record.status === "absent"
                                                ? "Vắng"
                                                : "Chưa điểm danh"}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default AttendanceList;
