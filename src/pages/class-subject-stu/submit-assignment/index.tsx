import { useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    getExerciseByClassStu,
    messageClear,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { TypographyBody } from "@/components/TypographyBody";

const AssignmentList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exerciseByStudent, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const router = useRouter();
    const { classId } = router.query;

    useEffect(() => {
        if (classId) {
            dispatch(getExerciseByClassStu(classId));
        }
    }, [dispatch, classId]);

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
            <BorderBox
                title={`Danh sách bài tập - ${
                    exerciseByStudent?.[0]?.classname || ""
                }`}
            >
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
                                                    </a>
                                                </p>
                                            )}
                                        </>
                                    ) : assignment.gradeType.code === "FINAL" ||
                                      assignment.gradeType.code === "MID" ? (
                                        <TypographyBody
                                            tag="span"
                                            className={styles.note}
                                        >
                                            Không cần nộp bài tập này
                                        </TypographyBody>
                                    ) : (
                                        <>
                                            <p style={{ color: "#777" }}>
                                                Chưa nộp
                                            </p>
                                            <div className={styles.action}>
                                                <Link
                                                    href={`/class-subject-stu/submit-assignment/${assignment.gradeEventId}`}
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
                        <TypographyBody
                            tag="span"
                            theme="lg"
                            className={styles.noData}
                        >
                            Không có dữ liệu
                        </TypographyBody>
                    )}
                </div>
                <Link href={"/class-subject-stu"} className={styles.backAction}>
                    <IoChevronBackCircleOutline /> Quay lại
                </Link>
            </BorderBox>
        </AuthGuard>
    );
};

export default AssignmentList;
