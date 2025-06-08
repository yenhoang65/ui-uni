import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useMemo, useState } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import clsx from "clsx";
import { IoMdAddCircle } from "react-icons/io";
import ModalConfirm from "@/components/ModalConfirm";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    deleteLecturer,
    getListLecturer,
    messageClear,
} from "@/store/reducer/lecturerReducer";
import toast from "react-hot-toast";

const LecturerManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { lecturers, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.lecturer
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteLecturerId, setDeleteLecturerId] = useState<number | null>(
        null
    );

    const handleDelete = () => {
        if (deleteLecturerId) {
            setIsModalOpen(false);
            setDeleteLecturerId(null);

            dispatch(deleteLecturer(deleteLecturerId));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteLecturerId(null);
    };

    useEffect(() => {
        dispatch(getListLecturer());
    }, []);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(getListLecturer());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const filteredLecturers = useMemo(() => {
        if (!searchValue.trim()) return lecturers;

        const lowerSearch = searchValue.toLowerCase();
        return lecturers.filter(
            (lecturer) =>
                lecturer.userName.toLowerCase().includes(lowerSearch) ||
                lecturer.majorName.toLowerCase().includes(lowerSearch) ||
                lecturer.position.toLowerCase().includes(lowerSearch) ||
                lecturer.phoneNumber.includes(searchValue)
        );
    }, [lecturers, searchValue]);

    const totalItem = filteredLecturers.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedlecturers = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return filteredLecturers.slice(start, end);
    }, [filteredLecturers, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Quản lý giảng viên">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href="/lecturer_management/create-edit"
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "100px" }}>Mã GV</th>
                                    <th style={{ minWidth: "200px" }}>
                                        Tên GV
                                    </th>
                                    <th style={{ minWidth: "250px" }}>
                                        Tên ngành
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        Vị trí
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        Số điện thoại
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedlecturers.map((lecturer) => (
                                    <tr key={lecturer.userId}>
                                        <td>{lecturer.userId}</td>
                                        <td>{lecturer.userName}</td>
                                        <td>{lecturer.majorName}</td>
                                        <td>{lecturer.position}</td>
                                        <td>{lecturer.phoneNumber}</td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/lecturer_management/view?id=${lecturer.userId}`} // Đường dẫn xem chi tiết
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/lecturer_management/create-edit?id=${lecturer.userId}&mode=edit`} // Đường dẫn chỉnh sửa
                                                className={clsx(
                                                    styles.viewButton,
                                                    styles.viewButtonUpdate
                                                )}
                                            >
                                                <AiFillEdit />
                                            </Link>
                                            <Link
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsModalOpen(true);
                                                    setDeleteLecturerId(
                                                        lecturer.userId
                                                    );
                                                }}
                                                className={clsx(
                                                    styles.viewButton,
                                                    styles.viewButtonDelete
                                                )}
                                            >
                                                <MdDeleteForever />
                                            </Link>

                                            {isModalOpen &&
                                                deleteLecturerId ===
                                                    lecturer.userId && (
                                                    <ModalConfirm
                                                        message="Bạn có chắc chắn muốn xóa giảng viên này?"
                                                        onConfirm={handleDelete}
                                                        onCancel={handleCancel}
                                                    />
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalItem > parPage && (
                        <div className={styles.paginationWrapper}>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalItem}
                                parPage={parPage}
                                showItem={3}
                            />
                        </div>
                    )}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default LecturerManagement;
