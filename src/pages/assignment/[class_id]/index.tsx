//xem list bài tập theo lớp của giảng viên
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getExerciseByClass, messageClear } from "@/store/reducer/pointReducer";
import { TypographyBody } from "@/components/TypographyBody";
import toast from "react-hot-toast";

const AssignmentList = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const { exercises, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const router = useRouter();
    const { class_id } = router.query;

    useEffect(() => {
        if (class_id) {
            dispatch(getExerciseByClass(class_id));
        }
    }, [class_id]);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <BorderBox
                title={t("assignmentList.title", {
                    className: exercises[0]?.className || "",
                })}
            >
                <div className={styles.assignmentList}>
                    <Link
                        href={`/assignment/${class_id}/create-edit`}
                        className={styles.addAssignmentButton}
                    >
                        <IoMdAddCircle /> {t("assignmentList.add")}
                    </Link>

                    {exercises[0]?.assignments?.length > 0 ? (
                        <div className={styles.assignmentGrid}>
                            {exercises[0]?.assignments?.map(
                                (assignment: any) => (
                                    <div
                                        key={assignment.gradeEventId}
                                        className={styles.assignmentItem}
                                    >
                                        <h3 className={styles.title}>
                                            {class_id} -{" "}
                                            {assignment.gradeEventId} -
                                            {assignment.title}
                                        </h3>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: assignment.description,
                                            }}
                                            className={styles.description}
                                        ></p>
                                        <div className={styles.infoRow}>
                                            <strong>
                                                {t("assignmentList.deadline")}:
                                            </strong>
                                            <span className={styles.deadline}>
                                                {assignment.eventDate}
                                            </span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <strong>
                                                {t("assignmentList.submitted")}:
                                            </strong>
                                            <span
                                                className={
                                                    styles.submissionsCount
                                                }
                                            >
                                                10 / 10
                                            </span>
                                            {t("assignmentList.students")}
                                        </div>

                                        <div className={styles.actions}>
                                            <Link
                                                href={`/assignment/${class_id}/view/?id=${assignment.gradeEventId}`}
                                                className={styles.buttonDetail}
                                            >
                                                {t("assignmentList.detail")}
                                            </Link>
                                            <Link
                                                href={`/assignment/${class_id}/create-edit?id=${assignment.gradeEventId}&mode=edit`}
                                                className={styles.buttonUpdate}
                                            >
                                                {t("assignmentList.edit")}
                                            </Link>
                                            {/* <Link
                                                href={`/assignment/${class_id}/view_submissions/?id=${assignment.gradeEventId}&&coefficient=${assignment.gradeType.coefficient}&&code=${assignment.gradeType.code}&&exam_form=${assignment.examSchedule?.examForm}`}
                                                className={
                                                    styles.viewSubmissions
                                                }
                                            >
                                                {t(
                                                    "assignmentList.viewSubmissions"
                                                )}
                                            </Link> */}
                                            <Link
                                                href={`/assignment/${class_id}/view_submissions/?id=${
                                                    assignment.gradeEventId
                                                }&coefficient=${
                                                    assignment.gradeType
                                                        .coefficient
                                                }&code=${
                                                    assignment.gradeType.code
                                                }${
                                                    assignment.examSchedule
                                                        ? `&exam_form=${assignment.examSchedule.examForm}`
                                                        : ""
                                                }`}
                                                className={
                                                    styles.viewSubmissions
                                                }
                                            >
                                                {t(
                                                    "assignmentList.viewSubmissions"
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <TypographyBody tag="span" theme="lg">
                            Không có dữ liệu
                        </TypographyBody>
                    )}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default AssignmentList;
