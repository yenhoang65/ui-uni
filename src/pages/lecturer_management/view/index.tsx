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
import { getLecturerDetail } from "@/store/reducer/lecturerReducer";

const LecturerDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { lecturer } = useSelector((state: RootState) => state.lecturer);

    const router = useRouter();
    const { query } = router;
    const { id } = query;

    useEffect(() => {
        if (id) {
            dispatch(getLecturerDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Chi tiết giảng viên: ${lecturer.userName}`}>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Mã giảng viên:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {lecturer.userId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            className={styles.detailLabel}
                        >
                            Tên giảng viên:
                        </TypographyBody>
                        <TypographyBody tag="span">
                            {lecturer.userName}
                        </TypographyBody>
                    </div>

                    {lecturer.majorName && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Tên ngành:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.majorName}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.position && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Vị trí:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.position}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.phoneNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số điện thoại:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.phoneNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.email && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Email:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.email}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.gender && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Giới tính:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.gender}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.dateOfBirth && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngày sinh:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {String(lecturer.dateOfBirth)}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.address && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Địa chỉ:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.address}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.admissionDate && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngày vào trường:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {new Date(
                                    lecturer.admissionDate
                                ).toLocaleDateString("vi-VN")}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.ethnicGroup && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Dân tộc:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.ethnicGroup}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.religion && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Tôn giáo:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.religion}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.idNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số CMND/CCCD:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.idNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.placeOfBirth && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Nơi sinh:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.placeOfBirth}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.permanentResident && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Thường trú:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.permanentResident}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.bank && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Ngân hàng:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.bank}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.bankAccountOwner && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Chủ tài khoản:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.bankAccountOwner}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.bankAccountNumber && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Số tài khoản:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.bankAccountNumber}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.academicDegree && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Học vị:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.academicDegree}
                            </TypographyBody>
                        </div>
                    )}

                    {lecturer.graduatedFrom && (
                        <div className={styles.detailItemFull}>
                            <TypographyBody
                                tag="span"
                                className={styles.detailLabel}
                            >
                                Tốt nghiệp từ:
                            </TypographyBody>
                            <TypographyBody tag="span">
                                {lecturer.graduatedFrom}
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
                                    `/lecturer_management/create-edit?id=${lecturer.userId}&mode=edit`
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

export default LecturerDetail;
