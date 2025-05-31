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
import { getClassroomDetail } from "@/store/reducer/classroomReducer";

const ClassroomDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classroom } = useSelector((state: RootState) => state.classroom);

    const router = useRouter();
    const { query } = router;
    const { id } = query;

    useEffect(() => {
        if (id) {
            dispatch(getClassroomDetail(id));
        }
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin", "employee"]}>
            <BorderBox title={`Chi tiết phòng học: ${classroom.classroomId}`}>
                <div className={styles.detailContainer}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã phòng:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {classroom.classroomId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Số chỗ ngồi:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {classroom.numberOfSeats}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Loại phòng:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {classroom.classroomName}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Thiết bị:
                        </TypographyBody>
                        <div>
                            {classroom.devices &&
                            Array.isArray(classroom.devices) ? (
                                classroom.devices.map((device, index) => (
                                    <TypographyBody
                                        key={index}
                                        tag="span"
                                        theme="md"
                                    >
                                        {device}
                                        {index < classroom.devices.length - 1 &&
                                            ", "}
                                    </TypographyBody>
                                ))
                            ) : (
                                <TypographyBody tag="span" theme="md">
                                    No devices available
                                </TypographyBody>
                            )}
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Trạng thái:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {classroom.status}
                        </TypographyBody>
                    </div>

                    <div className={styles.buttonGroup}>
                        <div
                            className={styles.backButton}
                            onClick={() => router.back()}
                        >
                            <IoIosArrowBack className={styles.backIcon} />
                            <span className={styles.backText}>Back</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() =>
                                router.push(
                                    `/classroom/create-edit?id=${classroom.classroomId}&mode=edit`
                                )
                            }
                        >
                            <AiFillEdit /> Edit
                        </button>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassroomDetail;
