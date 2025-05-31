import Link from "next/link";
import styles from "./styles.module.css";
import BorderBox from "@/components/BorderBox";
import { TypographyHeading } from "@/components/TypographyHeading";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import { getClassTermDetail } from "@/store/reducer/classReducer";
import { useEffect } from "react";

const ClassTermSubjectDetailPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classTerm } = useSelector((state: RootState) => state.class);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            dispatch(getClassTermDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Chi tiết Học kỳ - Môn học (ID: ${id})`}>
                <header className={styles.detailHeader}>
                    <div className={styles.titleInfo}>
                        <TypographyHeading
                            tag="h1"
                            theme="2xl"
                            className={styles.description}
                            color="var(--secondary-blue)"
                        >
                            Thông tin Học kỳ - Môn học
                        </TypographyHeading>
                        <p className={styles.detailId}>
                            ID: {classTerm.termclassId}
                        </p>
                    </div>
                </header>

                <section className={styles.detailOverview}>
                    <TypographyHeading
                        tag="h5"
                        theme="xl"
                        className={styles.sectionTitle}
                        color="var(--secondary-blue)"
                    >
                        Thông tin chung
                    </TypographyHeading>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <strong>Mã lớp:</strong> {classTerm.classname}
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Tiến độ:</strong> {classTerm.progress}
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Học kỳ:</strong> {classTerm.semester}
                        </div>
                        <div className={styles.infoItem}>
                            <strong>Năm học:</strong> {classTerm.schoolyears}
                        </div>
                    </div>
                </section>

                <div className={styles.actionButtons}>
                    <Link
                        href={`/class-term-subject/create-edit?id=${classTerm.termclassId}&mode=edit`}
                        className={styles.editButton}
                    >
                        Chỉnh sửa
                    </Link>
                    <Link
                        href="/class-term-subject"
                        className={styles.backButton}
                    >
                        Quay lại
                    </Link>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassTermSubjectDetailPage;
