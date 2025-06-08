import React, { useEffect, useMemo, useState } from "react";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { TypographyHeading } from "@/components/TypographyHeading";
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getTrainingProgramByStu } from "@/store/reducer/trainingProgramReducer";

const TrainingProgramByStudent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subjectFollowTrainingProgram, successMessage, errorMessage } =
        useSelector((state: RootState) => state.trainingProgram);

    useEffect(() => {
        dispatch(getTrainingProgramByStu());
    }, [dispatch]);

    console.log(subjectFollowTrainingProgram);

    const trainingProgram = subjectFollowTrainingProgram?.length
        ? subjectFollowTrainingProgram[0].trainingProgram
        : null;

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox
                title={`Chương trình Đào tạo: ${
                    trainingProgram?.trainingProgramId || ""
                } - ${trainingProgram?.trainingProgramName || ""}`}
            >
                <div className={styles.groupTitle}>
                    <div className={styles.group}>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Mã CTĐT:
                            </TypographyHeading>{" "}
                            {trainingProgram?.trainingProgramId}
                        </div>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Tên CTĐT:
                            </TypographyHeading>{" "}
                            {trainingProgram?.trainingProgramName}
                        </div>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Năm học:
                            </TypographyHeading>{" "}
                            {trainingProgram?.trainingCode}
                        </div>
                    </div>
                </div>
                <div className={styles.action}>
                    <TypographyHeading
                        tag="h5"
                        theme="xl"
                        color="var(--secondary-blue)"
                        className={styles.headingSubject}
                    >
                        Các môn học trong chương trình
                    </TypographyHeading>
                </div>
                {subjectFollowTrainingProgram.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ textAlign: "center" }}>
                                        Mã học phần
                                    </th>
                                    <th>Tên học phần</th>
                                    <th style={{ textAlign: "center" }}>
                                        Môn học phụ thuộc
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectFollowTrainingProgram.map(
                                    (item: any) => (
                                        <tr key={item.subject.subjectId}>
                                            <td style={{ textAlign: "center" }}>
                                                {item.subject.subjectId}
                                            </td>
                                            <td>{item.subject.subjectName}</td>

                                            <td style={{ textAlign: "center" }}>
                                                {item.intermediary
                                                    .prerequisiteForList
                                                    .length > 0
                                                    ? item.intermediary.prerequisiteForList.map(
                                                          (
                                                              id: number,
                                                              idx: number
                                                          ) => (
                                                              <span key={id}>
                                                                  {id}
                                                                  {idx <
                                                                  item
                                                                      .intermediary
                                                                      .prerequisiteForList
                                                                      .length -
                                                                      1
                                                                      ? ", "
                                                                      : ""}
                                                              </span>
                                                          )
                                                      )
                                                    : "—"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noSubjects}>
                        Chưa có môn học nào trong chương trình này.
                    </p>
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default TrainingProgramByStudent;
