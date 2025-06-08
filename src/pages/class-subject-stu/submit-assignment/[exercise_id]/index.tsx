import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BorderBox from "@/components/BorderBox";
import { IoIosArrowBack } from "react-icons/io";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/Button";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    getExerciseDetail,
    messageClear,
    submitExercise,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";
import clsx from "clsx";

const AssignmentDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exercise, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const router = useRouter();
    const { exercise_id } = router.query;

    useEffect(() => {
        if (exercise_id) {
            dispatch(getExerciseDetail(exercise_id));
        }
    }, [exercise_id, dispatch]);

    const [fileUrl, setFileUrl] = useState<string>("");

    useEffect(() => {
        if (exercise && exercise_id) {
            setFileUrl(exercise.fileUrl);
        }
    }, [exercise, exercise_id]);

    const handleSubmit = () => {
        dispatch(
            submitExercise({
                request: {
                    classStudentId: exercise.classStudentId,
                    gradeEventId: exercise_id,
                    fileUrl: fileUrl,
                },
            })
        );
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/submit-assignment");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer", "student"]}>
            <BorderBox title={`Chi tiết bài tập: ${exercise.title}`}>
                <div className={styles.gridContainer}>
                    {/* LEFT COLUMN */}
                    <div className={styles.leftColumn}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Tiêu đề:</span>
                            <span>{exercise.title}</span>
                        </div>
                        <div className={clsx(styles.detailItem, styles.desc)}>
                            <span className={styles.detailLabel}>Mô tả:</span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: exercise.description,
                                }}
                            ></span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Hạn nộp:</span>
                            <span>{exercise.eventDate}</span>
                        </div>
                        {/* <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>File:</span>
                            {assignment.file_url ? (
                                <a
                                    href={assignment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.fileLink}
                                >
                                    Tải xuống
                                </a>
                            ) : (
                                <span>Không có file</span>
                            )}
                        </div> */}
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                Ngày tạo:
                            </span>
                            <span>{exercise.createdAt}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                                Mã lớp học:
                            </span>
                            <span>{exercise.classStudentId}</span>
                        </div>
                        <div className={styles.buttonGroup}>
                            <div
                                className={styles.backButton}
                                onClick={() => router.back()}
                            >
                                <IoIosArrowBack className={styles.backIcon} />
                                <span>Quay lại</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SUBMISSION */}
                    <div className={styles.rightColumn}>
                        <h3>Nộp bài tập</h3>
                        <input
                            type="text"
                            placeholder="Dán link bài tập của bạn"
                            className={styles.inputBox}
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                        />
                        <Button
                            onClick={handleSubmit}
                            className={styles.submitButton}
                        >
                            Nộp bài
                        </Button>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default AssignmentDetail;
