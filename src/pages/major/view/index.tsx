import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TypographyBody } from "@/components/TypographyBody";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import AuthGuard from "@/components/AuthGuard";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getMajorDetail } from "@/store/reducer/majorReducer";

const MajorDetail = () => {
    const router = useRouter();
    const { query } = router;
    const { id } = query;

    const dispatch = useDispatch<AppDispatch>();
    const { major } = useSelector((state: RootState) => state.major);

    useEffect(() => {
        dispatch(getMajorDetail(id));
    }, [id]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={`Major Detail: Kỹ thuật phần mềm`}>
                <div className={styles.detailContainer}>
                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Major Code:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {major.majorId}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Name:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {major.majorName}
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
                            {major.facultyName}
                        </TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Description:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            dangerouslySetInnerHTML={{
                                __html: major.majorDescription || "",
                            }}
                        ></TypographyBody>
                    </div>

                    <div className={styles.detailItem}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Established Date:
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md">
                            {major.majorDateOfEstablishment}
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
                                    `/major/create-edit?id=${major.majorId}&mode=edit`
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

export default MajorDetail;
