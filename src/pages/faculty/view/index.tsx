import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css"; // Import CSS Module
import BorderBox from "@/components/BorderBox";
import { TypographyHeading } from "@/components/TypographyHeading";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getFacultyDetail } from "@/store/reducer/facultyReducer";

const FacultyDetailPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { id } = router.query;

    const { faculty } = useSelector((state: RootState) => state.faculty);

    useEffect(() => {
        if (id && typeof id === "string") {
            dispatch(getFacultyDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Chi tiết khoa ${faculty.facultyName}`}>
                <section className={styles.facultyHeader}>
                    {faculty.facultyLogo && (
                        <div className={styles.logoContainer}>
                            <img
                                src={faculty.facultyLogo}
                                alt={`Logo của khoa ${faculty.facultyLogo}`}
                                width={200}
                                height={200}
                                // objectFit="contain"
                            />
                        </div>
                    )}
                    <div className={styles.titleInfo}>
                        <TypographyHeading
                            tag="h1"
                            theme="2xl"
                            className={styles.description}
                            color="var(--secondary-blue)"
                        >
                            {faculty.facultyName}
                        </TypographyHeading>
                        <p className={styles.facultyId}>
                            Mã khoa: {faculty.facultyId}
                        </p>
                    </div>
                </section>

                <section className={styles.facultyOverview}>
                    <TypographyHeading
                        tag="h5"
                        theme="2xl"
                        className={styles.description}
                        color="var(--secondary-blue)"
                    >
                        Thông tin chung
                    </TypographyHeading>
                    <div className={styles.infoGrid}>
                        {faculty.facultyDateOfEstablishment && (
                            <div className={styles.infoItem}>
                                <strong>Ngày thành lập:</strong>{" "}
                                {faculty.facultyDateOfEstablishment}
                            </div>
                        )}
                        {/* {website && (
                            <div className={styles.infoItem}>
                                <strong>Website:</strong>
                                <Link
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {website}
                                </Link>
                            </div>
                        )} */}
                        {faculty.facultyEmail && (
                            <div className={styles.infoItem}>
                                <strong>Email:</strong>
                                <a href={`mailto:${faculty.facultyEmail}`}>
                                    {faculty.facultyEmail}
                                </a>
                            </div>
                        )}
                        {faculty.facultyPhoneNumber && (
                            <div className={styles.infoItem}>
                                <strong>Điện thoại:</strong>
                                <a href={`tel:${faculty.facultyPhoneNumber}`}>
                                    {faculty.facultyPhoneNumber}
                                </a>
                            </div>
                        )}
                    </div>
                    {faculty.facultyAddress && (
                        <div className={styles.infoItemAddress}>
                            <strong>Địa chỉ:</strong> {faculty.facultyAddress}
                        </div>
                    )}
                </section>

                {faculty.facultyDescription && (
                    <section className={styles.facultyDescription}>
                        <TypographyHeading
                            tag="h5"
                            theme="2xl"
                            className={styles.description}
                            color="var(--secondary-blue)"
                        >
                            Mô tả
                        </TypographyHeading>
                        <p
                            className={styles.desc}
                            dangerouslySetInnerHTML={{
                                __html: faculty.facultyDescription,
                            }}
                        ></p>
                    </section>
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default FacultyDetailPage;
