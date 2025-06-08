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
import { getTeachingAssignmentDetail } from "@/store/reducer/teachingAssignment";

const TeachingAssignmentDetail = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { teachingAssignment, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.teachingAssignment
    );

    const router = useRouter();
    const { query } = router;
    const { id } = query;

    useEffect(() => {
        if (id) {
            dispatch(getTeachingAssignmentDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox
                title={`Chi tiết Phân công Giảng dạy: ${teachingAssignment.assignmentId}`}
            >
                <div className={styles.detailContainer}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã phân công:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.assignmentId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã giảng viên:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.lecturerId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Tên giảng viên:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.lecturerName ||
                                "Không có thông tin"}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã môn học:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.subjectId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Tên môn học:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.subjectName ||
                                "Không có thông tin"}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã học kỳ - lớp:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.termClassId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Tên lớp:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {teachingAssignment.className ||
                                "Không có thông tin"}
                        </TypographyBody>
                    </div>

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
                                    `/teaching-assignment/create-edit?id=${teachingAssignment.assignmentId}&mode=edit`
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

export default TeachingAssignmentDetail;
