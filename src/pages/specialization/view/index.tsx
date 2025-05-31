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
import { getSpecDetail } from "@/store/reducer/specializationReducer";

type Specialization = {
    id: string;
    maChuyenNganh: string;
    tenNganh: string;
    tenKhoa: string;
    ten: string;
    moTa?: string;
    ngayThanhLap: string;
};

const SpecializationDetail = () => {
    const router = useRouter();
    const { query } = router;
    const { id } = query;

    const dummySpecialization: Specialization = {
        id: "SPE001",
        maChuyenNganh: "SP001",
        tenNganh: "Công nghệ phần mềm",
        tenKhoa: "Khoa CNTT",
        ten: "Phát triển ứng dụng Web",
        moTa: "Chuyên sâu về phát triển các ứng dụng web hiện đại.",
        ngayThanhLap: "2012-05-20",
    };

    const dispatch = useDispatch<AppDispatch>();
    const { specialization } = useSelector(
        (state: RootState) => state.specialization
    );

    useEffect(() => {
        if (id) {
            dispatch(getSpecDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox
                title={`Chi tiết chuyên ngành: ${dummySpecialization.ten}`}
            >
                <div className={styles.detailContainer}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã chuyên ngành:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {specialization.specializationId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Tên ngành:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {specialization.majorName}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Khoa:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            TODO: ....
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Tên chuyên ngành:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {specialization.specializationName}
                        </TypographyBody>
                    </div>

                    {specialization.specializationDescription && (
                        <div className={styles.detailItem}>
                            <TypographyBody
                                tag="span"
                                theme="md"
                                className={styles.detailLabel}
                            >
                                Mô tả:
                            </TypographyBody>
                            <TypographyBody tag="span" theme="md">
                                {specialization.specializationDescription}
                            </TypographyBody>
                        </div>
                    )}

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Ngày thành lập:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {specialization.specializationDateOfEstablishment}
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
                                    `/specialization/create-edit?id=${specialization.specializationId}&mode=edit`
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

export default SpecializationDetail;
