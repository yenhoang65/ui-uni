import React, { useEffect, useState } from "react";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import AuthGuard from "@/components/AuthGuard";
import SelectWithLabel from "@/components/SelectWithLabel";
import clsx from "clsx";
import InputWithLabel from "@/components/InputWithLabel";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
    getAttendancceSession,
    getListAttendanceAfterMark,
    getListStudentFollowClassSubject,
    markAttendance,
    messageClear,
    updateMarkAttendance,
} from "@/store/reducer/attendanceReducer";
import toast from "react-hot-toast";

interface AttendanceRecord {
    studentId: string;
    sessionId: string;
    status: "" | "present" | "absent" | "excused";
    note?: string;
    classSubjectStudentId?: string;
    attendanceId?: number;
}

const Attendance = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const {
        attendanceSession,
        listStudent,
        listAttendanceAfterMark,
        successMessage,
        errorMessage,
    } = useSelector((state: RootState) => state.attendance);
    const router = useRouter();
    const { class_id, classname } = router.query;

    const [selectedSessionId, setSelectedSessionId] = useState<string>("");

    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >([]);

    useEffect(() => {
        if (class_id) {
            dispatch(getAttendancceSession(class_id));
            dispatch(getListStudentFollowClassSubject(class_id));
        }
    }, [class_id, dispatch]);

    // Khi lấy được session, cài session mặc định và record mặc định
    useEffect(() => {
        if (attendanceSession.length > 0) {
            const today = new Date();
            const todayStr = today.toISOString().slice(0, 10);

            const todaySession = attendanceSession.find(
                (session: any) =>
                    new Date(session.scheduledDate)
                        .toISOString()
                        .slice(0, 10) === todayStr
            );

            if (todaySession) {
                setSelectedSessionId(todaySession.sessionId);
            } else {
                setSelectedSessionId(attendanceSession[0].sessionId);
            }
        }
    }, [attendanceSession]);

    useEffect(() => {
        if (listAttendanceAfterMark && listStudent.length > 0) {
            setAttendanceRecords(
                listStudent.map((stu: any) => {
                    const found = listAttendanceAfterMark.find(
                        (d: any) => d.userId === stu.userId
                    );
                    return {
                        studentId: stu.userId,
                        sessionId: selectedSessionId,
                        status: found ? found.status : "absent",
                        note: found ? found.note || "" : "",
                        classSubjectStudentId: stu.classSubjectStudentId,
                        attendanceId: found ? found.attendanceId : undefined,
                    };
                })
            );
        }
    }, [listAttendanceAfterMark, listStudent, selectedSessionId]);

    const handleSessionChange = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setAttendanceRecords(
            listStudent.map((stu: any) => ({
                studentId: stu.userId,
                sessionId,
                status: "absent",
                note: "",
                classSubjectStudentId: stu.classSubjectStudentId,
            }))
        );
    };

    // const handleMarkAttendance = async (
    //     studentId: string,
    //     sessionId: string,
    //     status: "" | "present" | "absent" | "excused",
    //     note?: string
    // ) => {
    //     const student = listStudent.find(
    //         (stu: any) => stu.userId === studentId
    //     );
    //     if (!student) return;

    //     if (!status) return;

    //     const dto = {
    //         sessionId: sessionId,
    //         classSubjectStudentId: student.classSubjectStudentId,
    //         status,
    //         note: note || "",
    //     };

    //     await dispatch(markAttendance({ dto }));
    // };

    const handleMarkAttendance = async (
        studentId: string,
        sessionId: string,
        status: "" | "present" | "absent" | "excused",
        note?: string
    ) => {
        const student = listStudent.find(
            (stu: any) => stu.userId === studentId
        );
        if (!student || !status) return;

        const record = attendanceRecords.find(
            (r) => r.studentId === studentId && r.sessionId === sessionId
        );

        const dto = {
            sessionId: sessionId,
            classSubjectStudentId: student.classSubjectStudentId,
            status,
            note: note || "",
        };

        if (record?.attendanceId) {
            // Gọi API update
            await dispatch(
                updateMarkAttendance({ attendanceId: record.attendanceId, dto })
            );
        } else {
            // Gọi API tạo mới
            await dispatch(markAttendance({ dto }));
        }
    };

    const handleAttendanceChange = (
        studentId: string,
        status: "" | "present" | "absent" | "excused"
    ) => {
        setAttendanceRecords((prev) =>
            prev.map((rec) =>
                rec.studentId === studentId ? { ...rec, status } : rec
            )
        );
        const record = attendanceRecords.find(
            (r) =>
                r.studentId === studentId && r.sessionId === selectedSessionId
        );
        handleMarkAttendance(
            studentId,
            selectedSessionId,
            status,
            record?.note || ""
        );
    };

    useEffect(() => {
        if (selectedSessionId) {
            dispatch(getListAttendanceAfterMark(selectedSessionId));
        }
    }, [selectedSessionId, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            if (selectedSessionId) {
                dispatch(getListAttendanceAfterMark(selectedSessionId));
            }
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, selectedSessionId, dispatch]);

    return (
        <AuthGuard allowedRoles={["lecturer"]}>
            <BorderBox title={`Điểm danh lớp ${classname}`}>
                <div
                    className={styles.attendanceHeader}
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <SelectWithLabel
                        label="Ngày điểm danh"
                        name="session"
                        value={selectedSessionId}
                        onChange={(e) => handleSessionChange(e.target.value)}
                        options={attendanceSession.map((session: any) => ({
                            value: session.sessionId,
                            label: `${session.sessionId} - ${new Date(
                                session.scheduledDate
                            ).toLocaleDateString("vi-VN")}`,
                        }))}
                        className={styles.dateSelect}
                    />
                </div>
                <div className={styles.attendanceContainer}>
                    <table className={styles.attendanceTable}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã SV</th>
                                <th>Tên Sinh Viên</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listStudent.map((student: any, index: number) => {
                                const record = attendanceRecords.find(
                                    (r) =>
                                        r.studentId === student.userId &&
                                        r.sessionId === selectedSessionId
                                );
                                return (
                                    <tr key={student.userId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {student.classSubjectStudentId} -
                                            {student.userId}
                                        </td>
                                        <td>{student.fullName}</td>
                                        <td>
                                            <SelectWithLabel
                                                label={undefined}
                                                name={`status-${student.userId}`}
                                                value={record?.status || ""}
                                                onChange={(e) =>
                                                    handleAttendanceChange(
                                                        student.userId,
                                                        e.target.value as
                                                            | "present"
                                                            | "absent"
                                                            | "excused"
                                                            | ""
                                                    )
                                                }
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "---------",
                                                    },
                                                    {
                                                        value: "present",
                                                        label: "Có mặt",
                                                    },
                                                    {
                                                        value: "absent",
                                                        label: "Vắng",
                                                    },
                                                    {
                                                        value: "excused",
                                                        label: "Có phép",
                                                    },
                                                ]}
                                                className={clsx(
                                                    record?.status === "present"
                                                        ? styles[
                                                              "selectPresent"
                                                          ]
                                                        : record?.status ===
                                                          "excused"
                                                        ? styles[
                                                              "selectExcused"
                                                          ]
                                                        : record?.status ===
                                                          "absent"
                                                        ? styles["selectAbsent"]
                                                        : ""
                                                )}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default Attendance;
