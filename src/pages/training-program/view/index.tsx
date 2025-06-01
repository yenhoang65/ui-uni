import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { Button } from "@/components/Button";
import { TypographyHeading } from "@/components/TypographyHeading";
import { FaMinusCircle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Modal from "@/components/Modal";
import ModalConfirm from "@/components/ModalConfirm";
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    addSubjectForTP,
    deleteAllSubjectForTP,
    deleteSubjectFollowTrainingProgram,
    getSubjectFollowTrainingProgram,
    messageClear,
} from "@/store/reducer/trainingProgramReducer";
import toast from "react-hot-toast";
import { getListSubject } from "@/store/reducer/subjectReducer";

const ViewTrainingProgram = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subjectFollowTrainingProgram, successMessage, errorMessage } =
        useSelector((state: RootState) => state.trainingProgram);

    const { subjects } = useSelector((state: RootState) => state.subject);

    const router = useRouter();
    const { id } = router.query;

    const [selectedSubjectsToAdd, setSelectedSubjectsToAdd] = useState<
        {
            subjectId: string;
            schoolYear: string | null;
            subjectType: string | null;
        }[]
    >([]);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

    // Confirm delete modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [subjectIdPendingRemove, setSubjectIdPendingRemove] = useState<
        string | null
    >(null);

    const [deleteAllSubjectTrainingId, setDeleteAllSubjectTrainingId] =
        useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(getSubjectFollowTrainingProgram(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        dispatch(getListSubject());
    }, []);

    // Xác nhận xóa môn học
    const handleRemoveSubject = (subjectIdToRemove: string) => {
        setSubjectIdPendingRemove(subjectIdToRemove);
        setShowConfirmModal(true);
    };

    ///xóa 1 môn học trong CTĐT
    const handleConfirmRemove = () => {
        if (!id || !subjectIdPendingRemove) return;
        dispatch(
            deleteSubjectFollowTrainingProgram({
                trainingProgramId: id,
                subjectId: subjectIdPendingRemove,
            })
        );
        setShowConfirmModal(false);
        setSubjectIdPendingRemove(null);
    };

    const handleCancelRemove = () => {
        setShowConfirmModal(false);
        setSubjectIdPendingRemove(null);
    };

    const programSubjectIds = new Set(
        (subjectFollowTrainingProgram.subjects ?? []).map((s: any) =>
            String(s.subjectId)
        )
    );

    const availableSubjectsToAdd = subjects.filter(
        (subj) => !programSubjectIds.has(String(subj.subjectId))
    );

    // Nếu chỉ gửi 1 môn/lần:
    const handleAddSelectedSubjects = () => {
        if (selectedSubjectsToAdd.length === 0) return;
        const selected = selectedSubjectsToAdd[0];

        dispatch(
            addSubjectForTP({
                dto: {
                    trainingProgramId: Number(id),
                    subjectId: Number(selected.subjectId),
                    schoolYear: selected.schoolYear,
                    subjectType: "",
                },
            })
        );
        setIsOpenModal(false);
    };

    const handleDeleteAll = () => {
        if (deleteAllSubjectTrainingId) {
            const trainingProgramId = Number(deleteAllSubjectTrainingId);
            dispatch(deleteAllSubjectForTP(trainingProgramId));
            setIsDeleteAllModalOpen(false);
            setDeleteAllSubjectTrainingId(null);
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            if (id) dispatch(getSubjectFollowTrainingProgram(id));
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, id, dispatch]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox
                title={`Chương trình Đào tạo: ${
                    subjectFollowTrainingProgram?.trainingProgramId || ""
                } - ${subjectFollowTrainingProgram?.trainingProgramName || ""}`}
            >
                <div className={styles.groupTitle}>
                    <div className={styles.group}>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Mã CTĐT:
                            </TypographyHeading>{" "}
                            {subjectFollowTrainingProgram?.trainingProgramId}
                        </div>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Tên CTĐT:
                            </TypographyHeading>{" "}
                            {subjectFollowTrainingProgram?.trainingProgramName}
                        </div>
                        <div>
                            <TypographyHeading tag="span" theme="lg">
                                Năm học:
                            </TypographyHeading>{" "}
                            {subjectFollowTrainingProgram?.schoolYear}
                        </div>
                    </div>
                    <div
                        className={styles.buttonAdd}
                        onClick={() => {
                            setIsDeleteAllModalOpen(true);
                            if (id) {
                                setDeleteAllSubjectTrainingId(
                                    Array.isArray(id) ? id[0] : id
                                );
                            }
                        }}
                    >
                        <FaMinusCircle /> Xóa toàn bộ
                    </div>

                    {isDeleteAllModalOpen && (
                        <ModalConfirm
                            message="Bạn có chắc chắn muốn xóa toàn bộ môn học khỏi chương trình đào tạo?"
                            onConfirm={handleDeleteAll}
                            onCancel={() => setIsDeleteAllModalOpen(false)}
                        />
                    )}
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
                    <div
                        className={styles.buttonAddSubject}
                        onClick={() => setIsOpenModal(true)}
                    >
                        Thêm môn học
                    </div>
                </div>
                {subjectFollowTrainingProgram?.subjects?.length > 0 ? (
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
                                    <th style={{ textAlign: "center" }}>
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectFollowTrainingProgram.subjects.map(
                                    (subject: any) => (
                                        <tr key={subject.subjectId}>
                                            <td style={{ textAlign: "center" }}>
                                                {subject.subjectId}
                                            </td>
                                            <td>{subject.subjectName}</td>
                                            <td style={{ textAlign: "center" }}>
                                                {subject.prerequisiteFor
                                                    ?.length > 0
                                                    ? subject.prerequisiteFor.map(
                                                          (
                                                              pre: any,
                                                              idx: number
                                                          ) => (
                                                              <span
                                                                  key={
                                                                      pre.subjectId
                                                                  }
                                                              >
                                                                  {
                                                                      pre.subjectName
                                                                  }
                                                                  {idx <
                                                                  subject
                                                                      .prerequisiteFor
                                                                      .length -
                                                                      1
                                                                      ? ", "
                                                                      : ""}
                                                              </span>
                                                          )
                                                      )
                                                    : "—"}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Button
                                                    className={
                                                        styles.actionButton
                                                    }
                                                    onClick={() =>
                                                        handleRemoveSubject(
                                                            subject.subjectId
                                                        )
                                                    }
                                                >
                                                    <FaMinusCircle />
                                                </Button>
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
                <Modal
                    isOpen={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                    title={`Thêm môn học vào CTĐT: ${
                        subjectFollowTrainingProgram?.trainingProgramId || ""
                    } - ${
                        subjectFollowTrainingProgram?.trainingProgramName || ""
                    }`}
                >
                    <div className={styles.checkboxTableWrapper}>
                        <TypographyBody
                            tag="span"
                            className={styles.titleModal}
                        >
                            Các môn học chưa tồn tại trong CTĐT:{" "}
                            {subjectFollowTrainingProgram?.trainingProgramId} -{" "}
                            {subjectFollowTrainingProgram?.trainingProgramName}
                        </TypographyBody>
                        <table className={styles.checkboxTable}>
                            <thead>
                                <tr>
                                    <th>Chọn</th>
                                    <th>Mã học phần</th>
                                    <th>Tên học phần</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableSubjectsToAdd?.map((subject) => (
                                    <tr key={subject.subjectId}>
                                        <td>
                                            <input
                                                type="radio"
                                                name="subjectId"
                                                value={String(
                                                    subject.subjectId
                                                )}
                                                checked={
                                                    selectedSubjectsToAdd[0]
                                                        ?.subjectId ===
                                                    String(subject.subjectId)
                                                }
                                                onChange={() =>
                                                    setSelectedSubjectsToAdd([
                                                        {
                                                            subjectId: String(
                                                                subject.subjectId
                                                            ),
                                                            schoolYear:
                                                                subjectFollowTrainingProgram?.schoolYear ??
                                                                null,
                                                            subjectType: null,
                                                        },
                                                    ])
                                                }
                                            />
                                        </td>
                                        <td>{subject.subjectId}</td>
                                        <td>{subject.subjectName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.modalActions}>
                        <Button
                            onClick={handleAddSelectedSubjects}
                            disabled={selectedSubjectsToAdd.length === 0}
                        >
                            Thêm
                        </Button>
                        <Button onClick={() => setIsOpenModal(false)}>
                            Hủy
                        </Button>
                    </div>
                </Modal>
                {showConfirmModal && (
                    <ModalConfirm
                        message="Bạn sẽ xóa môn học này khỏi chương trình đào tạo. Hành động này không thể hoàn tác!"
                        confirmText="xóa môn học khỏi CTĐT"
                        buttonText="Xóa"
                        onConfirm={handleConfirmRemove}
                        onCancel={handleCancelRemove}
                    />
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default ViewTrainingProgram;
