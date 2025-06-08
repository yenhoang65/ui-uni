import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { TypographyBody } from "@/components/TypographyBody";
import SelectWithLabel from "@/components/SelectWithLabel";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getLearningResult } from "@/store/reducer/pointReducer";

const semesterOptions = [
    { value: "", label: "--- Chọn học kỳ -" },
    { value: "1", label: "Học kỳ 1" },
    { value: "2", label: "Học kỳ 2" },
    { value: "3", label: "Học kỳ hè" },
];

const schoolYearOptions = [
    { value: "", label: "--- Chọn năm học -" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
];

const StudyResult = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { learningResult } = useSelector((state: RootState) => state.point);

    useEffect(() => {
        dispatch(getLearningResult());
    }, [dispatch]);

    const [semester, setSemester] = useState("");
    const [schoolYear, setSchoolYear] = useState("");

    // Nếu chưa có dữ liệu, trả về null hoặc loading
    if (!learningResult) return null;

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Kết quả học tập">
                <div className={styles.container}>
                    <div className={styles.filterRow}>
                        <SelectWithLabel
                            label="Học kỳ"
                            name="semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            options={semesterOptions}
                            className={styles.selectFilter}
                        />
                        <SelectWithLabel
                            label="Năm học"
                            name="schoolYear"
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            options={schoolYearOptions}
                            className={styles.selectFilter}
                        />
                    </div>

                    <div className={styles.summaryRow}>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            Xếp loại học tập (Hệ 4):{" "}
                            <span className={styles.valueRed}>
                                {learningResult.classification4}
                            </span>
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            Xếp loại học tập (Hệ 10):{" "}
                            <span className={styles.valueRed}>
                                {learningResult.classification10}
                            </span>
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            TBC học tập (Hệ 4):{" "}
                            <span className={styles.valueRed}>
                                {learningResult.gpa4}
                            </span>
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            TBC học tập (Hệ 10):{" "}
                            <span className={styles.valueRed}>
                                {learningResult.gpa10}
                            </span>
                        </TypographyBody>
                    </div>
                    <div className={styles.summaryRow}>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            Số tín chỉ tích lũy:{" "}
                            <span className={styles.valueRed}>
                                {learningResult.accumulatedCredits} /{" "}
                                {learningResult.totalCredits}
                            </span>
                        </TypographyBody>
                        <TypographyBody tag="span" theme="md-bold" color="#222">
                            Số tín chỉ học tập:{" "}
                            <span className={styles.valueRed}>
                                {learningResult.accumulatedCredits}
                            </span>
                        </TypographyBody>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.resultTable}>
                            <thead>
                                <tr>
                                    <th className={styles.center}>STT</th>
                                    <th className={styles.center}>
                                        Mã học phần
                                    </th>
                                    <th>Tên học phần</th>
                                    <th className={styles.center}>
                                        Số tín chỉ
                                    </th>
                                    <th className={styles.center}>Hệ số</th>
                                    <th>Điểm thành phần</th>
                                    <th className={styles.center}>Điểm thi</th>
                                    <th className={styles.center}>TBCHP</th>
                                    <th className={styles.center}>Điểm số</th>
                                    <th className={styles.center}>Điểm chữ</th>
                                    {/* <th className={styles.center}>
                                        Môn tự chọn
                                    </th> */}
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {learningResult.subjects?.map(
                                    (r: any, idx: any) => (
                                        <tr
                                            key={r.subjectId}
                                            className={
                                                idx % 2 === 1
                                                    ? styles.rowAlt
                                                    : undefined
                                            }
                                        >
                                            <td className={styles.center}>
                                                {idx + 1}
                                            </td>
                                            <td className={styles.center}>
                                                {r.subjectId}
                                            </td>
                                            <td>{r.subjectName}</td>
                                            <td className={styles.center}>
                                                {r.ltCredits + r.thCredits}
                                            </td>
                                            <td className={styles.center}>
                                                {r.subjectCoefficient}
                                            </td>

                                            <td>
                                                {r.componentScores &&
                                                    Object.entries(
                                                        r.componentScores
                                                    )
                                                        .map(
                                                            ([key, value]) =>
                                                                `${key}: ${value}`
                                                        )
                                                        .join(" | ")}
                                            </td>
                                            <td className={styles.center}>
                                                {r.finalScore}
                                            </td>
                                            <td className={styles.center}>
                                                {r.gpa4}
                                            </td>
                                            <td className={styles.center}>
                                                {r.averageScore}
                                            </td>
                                            <td className={styles.center}>
                                                {r.letter}
                                            </td>
                                            <td className={styles.center}>
                                                {r.letter !== "F" ? (
                                                    <span
                                                        className={
                                                            styles.electiveCheck
                                                        }
                                                    >
                                                        ✔
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            {/* <td>{r.note}</td> */}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default StudyResult;
