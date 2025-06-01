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
import { getStudentDetail } from "@/store/reducer/studentReducer";

const StudentDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { student, totalStudent, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.student
    );
    const router = useRouter();
    const { query } = router;
    const { id } = query;

    useEffect(() => {
        if (id) {
            dispatch(getStudentDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Chi tiết sinh viên: ${student.userName}`}>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Mã sinh viên:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {student.userId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Tên sinh viên:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {student.userName}
                        </TypographyBody>
                    </div>

                    {student.classId && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Lớp:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.classId}
                            </TypographyBody>
                        </div>
                    )}

                    {student.specializationName && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Chuyên ngành:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.specializationName}
                            </TypographyBody>
                        </div>
                    )}

                    {student.gender && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Giới tính:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.gender}
                            </TypographyBody>
                        </div>
                    )}

                    {student.dateOfBirth && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngày sinh:
                            </TypographyBody>
                            {/* <TypographyBody tag="span">
                                {student.dateOfBirth.toISOString().slice(0, 10)}
                            </TypographyBody> */}
                            <TypographyBody tag="span">
                                {new Date(student.dateOfBirth)
                                    .toISOString()
                                    .slice(0, 10)}
                            </TypographyBody>
                        </div>
                    )}

                    {student.phoneNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số điện thoại:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.phoneNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {student.email && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Email:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.email}
                            </TypographyBody>
                        </div>
                    )}

                    {student.address && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Địa chỉ:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.address}
                            </TypographyBody>
                        </div>
                    )}

                    {student.admissionDate && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngày nhập học:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {new Date(student.admissionDate)
                                    .toISOString()
                                    .slice(0, 10)}
                            </TypographyBody>
                        </div>
                    )}

                    {student.ethnicGroup && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Dân tộc:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.ethnicGroup}
                            </TypographyBody>
                        </div>
                    )}

                    {student.religion && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Tôn giáo:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.religion}
                            </TypographyBody>
                        </div>
                    )}

                    {student.idNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số CMND/CCCD:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.idNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {student.placeOfBirth && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Nơi sinh:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.placeOfBirth}
                            </TypographyBody>
                        </div>
                    )}

                    {student.permanentResident && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Thường trú:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.permanentResident}
                            </TypographyBody>
                        </div>
                    )}

                    {student.bank && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngân hàng:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.bank}
                            </TypographyBody>
                        </div>
                    )}

                    {student.bankAccountOwner && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Chủ tài khoản:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.bankAccountOwner}
                            </TypographyBody>
                        </div>
                    )}

                    {student.bankAccountNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số tài khoản:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.bankAccountNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {student.educationLevel && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Trình độ học vấn:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.educationLevel}
                            </TypographyBody>
                        </div>
                    )}

                    {student.typeOfTraining && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Hình thức đào tạo:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {student.typeOfTraining}
                            </TypographyBody>
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
                                    `/student_management/create-edit?id=${student.userId}&mode=edit`
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

export default StudentDetail;
