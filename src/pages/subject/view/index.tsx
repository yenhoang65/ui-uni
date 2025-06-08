import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getSubjectDetail } from "@/store/reducer/subjectReducer";

const SubjectDetail = () => {
    const router = useRouter();
    const { query } = router;
    const { id } = query;

    const dispatch = useDispatch<AppDispatch>();
    const { subject, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.subject
    );

    useEffect(() => {
        if (id) {
            dispatch(getSubjectDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Chi tiết môn học: ${subject.subjectName}`}>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Mã môn học:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {subject.subjectId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItemFull}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Tên môn học:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {subject.subjectName}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Số tín chỉ lý thuyết:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {subject.ltCredits}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Số tín chỉ thực hành:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {subject.thCredits}
                        </TypographyBody>
                    </div>

                    {subject.subjectCoefficient !== undefined && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Hệ số môn học:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {subject.subjectCoefficient}
                            </TypographyBody>
                        </div>
                    )}

                    {subject.subjectDescription && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Mô tả:
                            </TypographyBody>
                            <TypographyBody
                                tag="span"
                                dangerouslySetInnerHTML={{
                                    __html: subject.subjectDescription || "",
                                }}
                            ></TypographyBody>
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <div
                            className={styles.backButton}
                            onClick={() => router.back()}
                        >
                            <IoIosArrowBack className={styles.backIcon} />
                            <span className={styles.backText}>Quay lại</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() =>
                                router.push(
                                    `/subject/create-edit?id=${subject.subjectId}&mode=edit`
                                )
                            }
                        >
                            <AiFillEdit /> Chỉnh sửa
                        </button>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default SubjectDetail;
