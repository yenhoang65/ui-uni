import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import { getViewMaterialForStu } from "@/store/reducer/classReducer";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";

interface ClassInfo {
    classStudentId: number;
    subjectName: string;
    lecturerName: string;
    schoolYear: string;
    semester: string;
    className: string;
}

interface Session {
    sessionId: number;
    scheduledDate: string;
    slideTitle: string;
    slideUrl: string;
}

interface Props {
    classInfo: ClassInfo;
    sessions: Session[];
}

const ViewMaterials: React.FC<Props> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { materials } = useSelector((state: RootState) => state.class);

    const router = useRouter();
    const { classId, subject } = router.query;

    useEffect(() => {
        if (classId) {
            dispatch(getViewMaterialForStu(classId));
        }
    }, [dispatch, classId]);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Tài liệu">
                <div className={styles.container}>
                    {materials?.classInfo && (
                        <div className={styles.classInfo}>
                            <p>
                                <strong>Môn học:</strong>{" "}
                                {materials.classInfo.className} -{" "}
                                {materials.classInfo.subjectName}
                            </p>
                            <p>
                                <strong>Giảng viên:</strong>{" "}
                                {materials.classInfo.lecturerName}
                            </p>
                            <p>
                                <strong>Học kỳ:</strong>{" "}
                                {materials.classInfo.semester} /{" "}
                                {materials.classInfo.schoolYear}
                            </p>
                        </div>
                    )}

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày học</th>
                                <th>Tài liệu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.sessions &&
                                materials.sessions.map(
                                    (session: any, index: number) => (
                                        <tr key={session.sessionId}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {format(
                                                    new Date(
                                                        session.scheduledDate
                                                    ),
                                                    "EEEE, dd/MM/yyyy",
                                                    { locale: vi }
                                                )}
                                            </td>
                                            <td>
                                                {session.slideUrl ? (
                                                    <a
                                                        href={session.slideUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={styles.link}
                                                    >
                                                        {session.slideTitle ||
                                                            "Xem slide"}
                                                    </a>
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.noSlide
                                                        }
                                                    >
                                                        Chưa có tài liệu
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ViewMaterials;
