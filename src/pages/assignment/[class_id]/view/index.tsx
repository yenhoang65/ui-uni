import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BorderBox from "@/components/BorderBox";
import { TypographyBody } from "@/components/TypographyBody";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import AuthGuard from "@/components/AuthGuard";
import styles from "./styles.module.css";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getExerciseDetail } from "@/store/reducer/pointReducer";

// Mock data for grade_event
type GradeEvent = {
    grade_event_id: string;
    class_subject_id: string;
    grade_type_id: string;
    title: string;
    event_date: string;
    max_score: number;
    coeff_override: number | null;
    description: string;
    created_at: string;
};

const mockGradeEvent: GradeEvent = {
    grade_event_id: "GE001",
    class_subject_id: "CS001",
    grade_type_id: "GT002",
    title: "Thi cuối kỳ Công nghệ phần mềm",
    event_date: "2025-06-10T08:00:00Z",
    max_score: 10,
    coeff_override: 1.5,
    description: "Thi cuối kỳ, thời gian làm bài 120 phút.",
    created_at: "2025-05-01T10:00:00Z",
};

const GradeEventDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exercise, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const router = useRouter();
    const { id } = router.query;

    const [gradeEvent, setGradeEvent] = useState<GradeEvent | null>(
        mockGradeEvent
    );

    useEffect(() => {
        if (id) {
            dispatch(getExerciseDetail(id));
        }
    }, [id]);

    if (!gradeEvent) {
        return <div>Loading...</div>;
    }

    const eventDate = new Date(gradeEvent.event_date);
    const createdDate = new Date(gradeEvent.created_at);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <BorderBox title={`Chi tiết Sự kiện điểm`}>
                <div className={styles.detailHeader}>
                    <TypographyBody
                        tag="span"
                        theme="lg"
                        className={styles.assignmentTitle}
                    >
                        {exercise.title}
                    </TypographyBody>
                    <button
                        className={styles.editButton}
                        onClick={() =>
                            router.push(
                                `/assignment/${gradeEvent.class_subject_id}/create-edit?id=${gradeEvent.grade_event_id}&mode=edit`
                            )
                        }
                    >
                        <AiFillEdit /> Chỉnh sửa
                    </button>
                </div>
                <div className={styles.detailGrid}>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mã sự kiện điểm:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.gradeEventId}
                        </TypographyBody>
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Lớp học phần:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.classStudentId}
                        </TypographyBody>
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Loại điểm:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.gradeTypeId}
                        </TypographyBody>
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Hạn nộp:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.eventDate}
                        </TypographyBody>
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Điểm tối đa:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.maxScore}
                        </TypographyBody>
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Hệ số (override):
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {gradeEvent.coeff_override !== null
                                ? gradeEvent.coeff_override
                                : "Không có"}
                        </TypographyBody>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Mô tả:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                            dangerouslySetInnerHTML={{
                                __html: exercise.description,
                            }}
                        />
                    </div>
                    <div>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailLabel}
                        >
                            Ngày tạo:
                        </TypographyBody>
                        <TypographyBody
                            tag="span"
                            theme="md"
                            className={styles.detailValue}
                        >
                            {exercise.createdAt}
                        </TypographyBody>
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.back()}
                    >
                        <IoIosArrowBack className={styles.backIcon} />
                        Quay lại
                    </button>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default GradeEventDetail;
