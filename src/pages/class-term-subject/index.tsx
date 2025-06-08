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
    deleteTermClass,
    getListTermClass,
    messageClear,
} from "@/store/reducer/classReducer";
import toast from "react-hot-toast";

const ClassTermSubject = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { classTerms, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.class
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteClassTermId, setDeleteClassTermId] = useState<number | null>(
        null
    );

    useEffect(() => {
        dispatch(getListTermClass());
    }, []);

    const handleDelete = () => {
        if (deleteClassTermId) {
            dispatch(deleteTermClass(deleteClassTermId));
            setIsModalOpen(false);
            setDeleteClassTermId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteClassTermId(null);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            dispatch(getListTermClass());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const totalItem = classTerms.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedclassTerms = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return classTerms.slice(start, end);
    }, [classTerms, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Class Term Management">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href={"/class-term-subject/create-edit"} // Adjust the link as needed
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Add New
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "80px" }}>No</th>
                                    <th style={{ minWidth: "150px" }}>
                                        Class Name
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Progress
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Semester
                                    </th>
                                    <th style={{ minWidth: "150px" }}>
                                        School Year
                                    </th>
                                    <th style={{ minWidth: "70px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedclassTerms.map((term, index) => (
                                    <tr key={term.termclassId}>
                                        <td>{term.termclassId}</td>
                                        <td>{term.classname}</td>
                                        <td>{term.progress}</td>
                                        <td>{term.semester}</td>
                                        <td>{term.schoolyears}</td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/class-term-subject/view?id=${term.termclassId}`}
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/class-term-subject/create-edit?id=${term.termclassId}&mode=edit`}
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
                                                    setDeleteClassTermId(
                                                        term.termclassId
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
                                                deleteClassTermId ===
                                                    term.termclassId && (
                                                    <ModalConfirm
                                                        message="Are you sure you want to delete?"
                                                        onConfirm={handleDelete}
                                                        onCancel={handleCancel}
                                                    />
                                                )}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedclassTerms.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className={styles.noData}
                                        >
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalItem > parPage && (
                        <div className={styles.paginationWrapper}>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={classTerms.length}
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

export default ClassTermSubject;
