import { useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    getExerciseByStudent,
    messageClear,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";

const AssignmentList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exerciseByStudent, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    useEffect(() => {
        dispatch(getExerciseByStudent());
    }, [dispatch]);

    console.log(exerciseByStudent);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Danh sách bài tập">
                <div className={styles.assignmentGrid}>
                    {exerciseByStudent && exerciseByStudent.length > 0 ? (
                        exerciseByStudent.map((assignment: any) => {
                            const statusClass =
                                assignment.submissionStatus === "NOT_SUBMITTED"
                                    ? styles.notSubmitted
                                    : assignment.submissionStatus === "LATE"
                                    ? styles.late
                                    : styles.submitted;
                            return (
                                <div
                                    key={assignment.gradeEventId}
                                    className={`${styles.assignmentItem} ${statusClass}`}
                                >
                                    <h3 className={styles.assignmentTitle}>
                                        {assignment.title} -{" "}
                                        {assignment.classname}
                                    </h3>
                                    <div
                                        className={styles.description}
                                        dangerouslySetInnerHTML={{
                                            __html: assignment.description,
                                        }}
                                    />
                                    <p>
                                        <strong>Deadline:</strong>{" "}
                                        {assignment.eventDate}
                                    </p>
                                    {assignment.submittedAt ? (
                                        <>
                                            <p>
                                                <strong>Submitted:</strong>{" "}
                                                {assignment.submittedAt}{" "}
                                                {assignment.submissionStatus ===
                                                    "LATE" && "(Late)"}
                                            </p>
                                            {assignment.fileUrl && (
                                                <p>
                                                    <a
                                                        href={
                                                            assignment.fileUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Link bài nộp
                                                    </a>{" "}
                                                    {assignment.score && (
                                                        <>
                                                            |{" "}
                                                            <span
                                                                style={{
                                                                    color: "#db8600",
                                                                    fontWeight:
                                                                        "bold",
                                                                    marginLeft: 4,
                                                                }}
                                                                className={
                                                                    styles.editSubmitBtn
                                                                }
                                                            >
                                                                Score:{" "}
                                                                {
                                                                    assignment.score
                                                                }
                                                                /{" "}
                                                                {
                                                                    assignment.maxScore
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ color: "#777" }}>
                                                Chưa nộp
                                            </p>
                                            <div className={styles.action}>
                                                <Link
                                                    href={`/submit-assignment/${assignment.gradeEventId}`}
                                                    className={styles.submitBtn}
                                                >
                                                    Nộp bài tập
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div>Không có bài tập nào.</div>
                    )}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default AssignmentList;
