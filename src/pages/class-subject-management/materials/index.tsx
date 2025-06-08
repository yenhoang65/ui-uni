import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import { getViewMaterialForStu } from "@/store/reducer/classReducer";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import clsx from "clsx";
import { AiFillEdit, AiFillPlusCircle } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import Modal from "@/components/Modal";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/Button";
import {
    createSlide,
    updateSlide,
    deleteSlide,
    messageClear,
} from "@/store/reducer/materialReducer";
import toast from "react-hot-toast";
import ModalConfirm from "@/components/ModalConfirm";

const ViewMaterials: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { materials } = useSelector((state: RootState) => state.class);
    const { successMessage, errorMessage } = useSelector(
        (state: RootState) => state.material
    );

    const router = useRouter();
    const { classId } = router.query;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(
        null
    );
    const [currentSlideId, setCurrentSlideId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: "", fileUrl: "" });
    const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);

    useEffect(() => {
        if (classId) {
            dispatch(getViewMaterialForStu(classId));
        }
    }, [dispatch, classId]);

    const handleOpenModal = (
        sessionId: number,
        slideId: number | null,
        title: string,
        url: string
    ) => {
        setCurrentSessionId(sessionId);
        setCurrentSlideId(slideId);
        setFormData({ title, fileUrl: url });
        setIsEditModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.fileUrl || !currentSessionId) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (currentSlideId) {
            dispatch(
                updateSlide({
                    id: currentSlideId,
                    dto: {
                        title: formData.title,
                        fileUrl: formData.fileUrl,
                        sessionId: currentSessionId,
                    },
                })
            );
        } else {
            dispatch(
                createSlide({
                    dto: {
                        title: formData.title,
                        fileUrl: formData.fileUrl,
                        sessionId: currentSessionId,
                    },
                })
            );
        }

        setIsEditModalOpen(false);
    };

    const handleDeleteSlide = () => {
        if (deleteSlideId != null) {
            dispatch(deleteSlide(deleteSlideId));
            setIsDeleteModalOpen(false);
            setDeleteSlideId(null);
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            if (classId) dispatch(getViewMaterialForStu(classId));
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["lecturer"]}>
            <BorderBox title="Tài liệu">
                <div className={styles.container}>
                    {materials?.classInfo && (
                        <div className={styles.classInfo}>
                            <p>
                                <strong>Môn học:</strong>{" "}
                                {materials.classInfo.className} -{" "}
                                {materials.classInfo.subjectName}
                            </p>
                            <p>
                                <strong>Giảng viên:</strong>{" "}
                                {materials.classInfo.lecturerName}
                            </p>
                            <p>
                                <strong>Học kỳ:</strong>{" "}
                                {materials.classInfo.semester} /{" "}
                                {materials.classInfo.schoolYear}
                            </p>
                        </div>
                    )}

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày học</th>
                                <th>Tài liệu</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.sessions?.map(
                                (session: any, index: number) => (
                                    <tr key={session.sessionId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {format(
                                                new Date(session.scheduledDate),
                                                "EEEE, dd/MM/yyyy",
                                                { locale: vi }
                                            )}
                                        </td>
                                        <td>
                                            {session.slideUrl ? (
                                                <a
                                                    href={session.slideUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={styles.link}
                                                >
                                                    {session.slideTitle ||
                                                        "Xem slide"}
                                                </a>
                                            ) : (
                                                <span
                                                    className={styles.noSlide}
                                                >
                                                    Chưa có tài liệu
                                                </span>
                                            )}
                                        </td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModal(
                                                        session.sessionId,
                                                        session.teachingSlideId,
                                                        session.slideTitle ||
                                                            "",
                                                        session.slideUrl || ""
                                                    );
                                                }}
                                                className={clsx(
                                                    styles.viewButton,
                                                    session.slideUrl
                                                        ? styles.viewButtonUpdate
                                                        : styles.viewButtonAdd
                                                )}
                                                title={
                                                    session.slideUrl
                                                        ? "Chỉnh sửa tài liệu"
                                                        : "Thêm tài liệu"
                                                }
                                            >
                                                {session.slideUrl ? (
                                                    <AiFillEdit />
                                                ) : (
                                                    <AiFillPlusCircle />
                                                )}
                                            </Link>
                                            {session.slideUrl && (
                                                <>
                                                    <Link
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setDeleteSlideId(
                                                                session.teachingSlideId
                                                            );
                                                            setIsDeleteModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.viewButtonDelete
                                                        )}
                                                        title="Xóa tài liệu"
                                                    >
                                                        <MdDeleteForever />
                                                    </Link>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title={
                        currentSlideId ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"
                    }
                >
                    <div className={styles.modalForm}>
                        <InputWithLabel
                            label="Tiêu đề tài liệu"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tiêu đề"
                        />
                        <InputWithLabel
                            label="URL tài liệu"
                            name="fileUrl"
                            value={formData.fileUrl}
                            onChange={handleChange}
                            required
                            placeholder="https://..."
                            type="url"
                        />
                        <div style={{ textAlign: "right", marginTop: "16px" }}>
                            <Button
                                size="middle"
                                theme="primary"
                                onClick={handleSubmit}
                                className={styles.buttonSave}
                            >
                                {currentSlideId ? "Cập nhật" : "Lưu tài liệu"}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {isDeleteModalOpen && deleteSlideId && (
                    <ModalConfirm
                        message="Bạn chắc chắn muốn xoá tài liệu này?"
                        onConfirm={handleDeleteSlide}
                        onCancel={() => setIsDeleteModalOpen(false)}
                    />
                )}
            </BorderBox>
        </AuthGuard>
    );
};

export default ViewMaterials;
