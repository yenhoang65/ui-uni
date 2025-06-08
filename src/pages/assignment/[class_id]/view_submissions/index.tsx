import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./styles.module.css";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import { TypographyHeading } from "@/components/TypographyHeading";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
    getViewSubmissions,
    gradeListSubmission,
    gradeSubmission,
    messageClear,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/Button";

const assignment: any = {
    id: "BT01",
    title: "Bài tập về nhà số 1",
    deadline: "2024-03-11T00:00:00",
    max_score: 100,
};

const ViewSubmissions = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const {
        viewSubmissions = [],
        successMessage,
        errorMessage,
    } = useSelector((state: RootState) => state.point);

    const router = useRouter();
    const { id, class_id, coefficient, code, exam_form } = router.query;
    const [state, setState] = useState({
        score: "",
        feedback: "",
    });

    const [importedScores, setImportedScores] = useState<
        { studentId: string; score: number }[]
    >([]);

    useEffect(() => {
        if (id && class_id) {
            dispatch(
                getViewSubmissions({
                    classStudentId: class_id,
                    gradeEventId: id,
                })
            );
        }
    }, [id, class_id, dispatch]);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [editableScores, setEditableScores] = useState<
        { studentId: number; score: string }[]
    >([]);

    // Khi click vào 1 bài nộp, nếu đã có điểm/nhận xét thì set vào state
    const handleSelectRow = (submission: any) => {
        const rowId = submission.id || submission.studentId;
        setSelectedId(selectedId === rowId ? null : rowId);

        // Nếu mở row lên, setState bằng điểm và nhận xét có sẵn (nếu có)
        if (selectedId !== rowId) {
            setState({
                score:
                    submission.score !== undefined && submission.score !== null
                        ? submission.score.toString()
                        : "",
                feedback: submission.feedback || "",
            });
        }
    };

    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const feedbackHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setState({
            ...state,
            feedback: e.target.value,
        });
    };

    const submittedList = (viewSubmissions || []).filter(
        (s: any) =>
            s.submissionStatus === "ON_TIME" || s.submissionStatus === "LATE"
    );
    const notSubmittedList = (viewSubmissions || []).filter(
        (s: any) => s.submissionStatus === "NOT_SUBMITTED"
    );

    const handleEditableScoreChange = (studentId: number, newScore: string) => {
        setEditableScores((prev) =>
            prev.map((item) =>
                item.studentId === studentId
                    ? { ...item, score: newScore }
                    : item
            )
        );
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, {
                header: ["studentId", "studentName", "score"],
                defval: "",
            }) as { studentId: string; studentName: string; score: number }[];

            // Lọc và map lấy studentId + score
            const scores = json
                .filter((row) => row.studentId && typeof row.score === "number")
                .map((row) => ({
                    studentId: row.studentId.toString(),
                    score: Number(row.score),
                }));

            setImportedScores(scores);

            setEditableScores(
                viewSubmissions.map((v: any) => {
                    const match = scores.find(
                        (s) => s.studentId.toString() === v.studentId.toString()
                    );
                    return {
                        studentId: v.studentId,
                        score: match ? match.score.toString() : "",
                    };
                })
            );
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        if (
            viewSubmissions &&
            viewSubmissions.length > 0 &&
            importedScores.length === 0
        ) {
            setEditableScores(
                viewSubmissions.map((v: any) => ({
                    studentId: v.studentId,
                    score: v.score?.toString() || "",
                }))
            );
        }
    }, [viewSubmissions]);

    const handleSubmitListGrade = () => {
        const grades = editableScores
            .filter((e) => e.score !== "")
            .map((e) => {
                const submission = viewSubmissions.find(
                    (s: any) => String(s.studentId) === String(e.studentId)
                );

                return {
                    classSubjectStudentId: submission?.classSubjectStudentId,
                    gradeEventId: submission?.gradeEventId,
                    score: Number(e.score),
                    feedback: "",
                };
            });

        const gradesArray = Array.isArray(grades) ? grades : [grades];
        dispatch(gradeListSubmission(gradesArray));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            if (id && class_id) {
                dispatch(
                    getViewSubmissions({
                        classStudentId: class_id,
                        gradeEventId: id,
                    })
                );
            }
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, id, class_id]);

    // console.log("viewSubmissions: ", viewSubmissions);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <BorderBox
                title={t("submission.title", { title: assignment.title })}
            >
                <>
                    <div>
                        <TypographyHeading tag="span" theme="xl">
                            Chấm điểm cho bài tập {code}
                        </TypographyHeading>
                        <div
                            className={styles.title}
                            style={{ marginBottom: "16px" }}
                        >
                            <label htmlFor="importFile">
                                Import điểm từ file Excel:
                            </label>
                            <input
                                id="importFile"
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleFileImport}
                            />
                        </div>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: "100px" }}>STT</th>
                                <th style={{ width: "200px" }}>Mã sinh viên</th>
                                <th>Tên sinh viên</th>
                                {exam_form !== "offline" && (
                                    <th style={{ width: "150px" }}>
                                        Link bài nộp
                                    </th>
                                )}
                                <th style={{ width: "400px" }}>Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewSubmissions &&
                                viewSubmissions.map((item: any, index: any) => (
                                    <tr key={item.studentId}>
                                        <td>{index + 1}</td>
                                        <td>{item.studentId}</td>
                                        <td>{item.studentName}</td>
                                        {exam_form !== "offline" && (
                                            <td>
                                                {item.fileUrl ? (
                                                    <a
                                                        href={item.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Xem bài
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        )}
                                        <td>
                                            <InputWithLabel
                                                placeholder="Điểm"
                                                name="score"
                                                type="number"
                                                value={
                                                    editableScores.find(
                                                        (s) =>
                                                            s.studentId ===
                                                            item.studentId
                                                    )?.score ?? ""
                                                }
                                                onChange={(e) =>
                                                    handleEditableScoreChange(
                                                        item.studentId,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <div className={styles.buttonAction}>
                        <Button
                            onClick={handleSubmitListGrade}
                            className={styles.importButton}
                        >
                            Khóa điểm
                        </Button>
                    </div>
                </>
            </BorderBox>
        </AuthGuard>
    );
};

export default ViewSubmissions;
