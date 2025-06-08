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
    deleteMajor,
    getListMajor,
    searchMajor,
} from "@/store/reducer/majorReducer";
import toast from "react-hot-toast";
import { messageClear } from "@/store/reducer/majorReducer";

const Major = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { majors, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.major
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteMajorId, setDeleteMajorId] = useState<string | null>(null);

    const handleDelete = () => {
        if (deleteMajorId) {
            setIsModalOpen(false);
            setDeleteMajorId(null);
            dispatch(deleteMajor(deleteMajorId));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteMajorId(null);
    };

    useEffect(() => {
        dispatch(getListMajor());
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchValue.trim() !== "") {
                dispatch(searchMajor(searchValue));
            } else {
                dispatch(getListMajor());
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchValue]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            dispatch(getListMajor());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const totalItem = majors.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedMajors = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return majors.slice(start, end);
    }, [majors, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Quản lý ngành học">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href="/major/create-edit"
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ width: "80px" }}>STT</th>
                                    <th style={{ width: "100px" }}>Mã ngành</th>
                                    <th style={{ width: "200px" }}>
                                        Tên ngành
                                    </th>
                                    <th style={{ width: "100px" }}>
                                        Ngày thành lập
                                    </th>
                                    <th style={{ width: "80px" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMajors.map((major, index) => (
                                    <tr key={major.majorId}>
                                        <td>{index + 1}</td>
                                        <td>{major.majorId}</td>
                                        <td>{major.majorName}</td>
                                        <td>
                                            {major.majorDateOfEstablishment}
                                        </td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/major/view?id=${major.majorId}`}
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/major/create-edit?id=${major.majorId}&mode=edit`}
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
                                                    setDeleteMajorId(
                                                        major.majorId
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
                                                deleteMajorId ===
                                                    major.majorId && (
                                                    <ModalConfirm
                                                        message="Are you sure you want to delete?"
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

export default Major;
