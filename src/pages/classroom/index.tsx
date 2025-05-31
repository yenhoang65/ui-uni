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
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    deleteClassroom,
    getListClassroom,
    messageClear,
} from "@/store/reducer/classroomReducer";
import toast from "react-hot-toast";

const Classroom = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classrooms, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.classroom
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteClassroomId, setDeleteClassroomId] = useState<number | null>(
        null
    );

    const handleDelete = () => {
        if (deleteClassroomId) {
            dispatch(deleteClassroom(deleteClassroomId));
            setIsModalOpen(false);
            setDeleteClassroomId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteClassroomId(null);
    };

    useEffect(() => {
        dispatch(getListClassroom());
    }, []);

    const totalItem = classrooms.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedclassrooms = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return classrooms.slice(start, end);
    }, [classrooms, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(getListClassroom());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin", "employee"]}>
            <BorderBox title="Quản lý phòng học">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href={"/classroom/create-edit"}
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ width: "70px" }}>No</th>
                                    <th style={{ width: "120px" }}>Mã</th>
                                    <th style={{ minWidth: "150px" }}>
                                        Số chỗ ngồi
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        Loại phòng
                                    </th>
                                    <th style={{ minWidth: "200px" }}>
                                        Thiết bị
                                    </th>
                                    <th style={{ minWidth: "70px" }}>
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedclassrooms.map((classroom, index) => (
                                    <tr key={classroom.classroomId}>
                                        <td>
                                            {(currentPage - 1) * parPage +
                                                index +
                                                1}
                                        </td>
                                        <td>{classroom.classroomId}</td>
                                        <td>{classroom.numberOfSeats}</td>
                                        <td>{classroom.classroomName}</td>
                                        <td>
                                            {classroom.devices.map(
                                                (dev, idx) => (
                                                    <TypographyBody
                                                        key={idx}
                                                        tag="span"
                                                        className={
                                                            styles.deviceItem
                                                        }
                                                    >
                                                        {dev}
                                                        {idx <
                                                            classroom.devices
                                                                .length -
                                                                1 && ", "}
                                                    </TypographyBody>
                                                )
                                            )}
                                        </td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/classroom/view?id=${classroom.classroomId}`}
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/classroom/create-edit?id=${classroom.classroomId}&mode=edit`}
                                                className={clsx(
                                                    styles.viewButton,
                                                    styles.viewButtonUpdate
                                                )}
                                            >
                                                <AiFillEdit />
                                            </Link>
                                            <Link
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsModalOpen(true);
                                                    setDeleteClassroomId(
                                                        classroom.classroomId
                                                    );
                                                }}
                                                href="#"
                                                className={clsx(
                                                    styles.viewButton,
                                                    styles.viewButtonDelete
                                                )}
                                            >
                                                <MdDeleteForever />
                                            </Link>

                                            {isModalOpen &&
                                                deleteClassroomId ===
                                                    classroom.classroomId && (
                                                    <ModalConfirm
                                                        message="Bạn có chắc chắn muốn xóa?"
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

export default Classroom;
