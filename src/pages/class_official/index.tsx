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
    deleteClassOffical,
    getListClassOffical,
    messageClear,
} from "@/store/reducer/classReducer";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ClassOffical = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const { classOfficals, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.class
    );
    const { lecturers } = useSelector((state: RootState) => state.lecturer);
    const { trainingPrograms } = useSelector(
        (state: RootState) => state.trainingProgram
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteClassOfficalId, setDeleteClassOfficalId] = useState<
        number | null
    >(null);

    useEffect(() => {
        dispatch(getListClassOffical());
    }, []);

    const handleDelete = () => {
        if (deleteClassOfficalId) {
            dispatch(deleteClassOffical(deleteClassOfficalId));
            setIsModalOpen(false);
            setDeleteClassOfficalId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteClassOfficalId(null);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(getListClassOffical());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const totalItem = classOfficals.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedclassOfficals = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return classOfficals.slice(start, end);
    }, [classOfficals, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);
    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={t("classOfficial.title")}>
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href={"/class_official/create-edit"}
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> {t("classOfficial.addNew")}
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ width: "80px" }}>
                                        {t("classOfficial.index")}
                                    </th>
                                    <th style={{ width: "150px" }}>
                                        {t("classOfficial.classId")}
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        {t("classOfficial.lecturer")}
                                    </th>
                                    <th style={{ width: "420px" }}>
                                        {t("classOfficial.trainingProgram")}
                                    </th>
                                    <th style={{ width: "150px" }}>
                                        {t("classOfficial.schoolYear")}
                                    </th>
                                    <th style={{ minWidth: "70px" }}>
                                        {t("classOfficial.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedclassOfficals.map((term, index) => (
                                    <tr key={term.classId}>
                                        <td>{index + 1}</td>
                                        <td>{term.classId}</td>
                                        <td>{term.lecturerName}</td>
                                        <td>{term.trainingProgramName}</td>
                                        <td>{term.schoolYear}</td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/class_official/create-edit?id=${term.classId}&mode=edit`}
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
                                                    setDeleteClassOfficalId(
                                                        term.classId
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
                                                deleteClassOfficalId ===
                                                    term.classId && (
                                                    <ModalConfirm
                                                        message={t(
                                                            "classOfficial.confirmDelete"
                                                        )}
                                                        onConfirm={handleDelete}
                                                        onCancel={handleCancel}
                                                    />
                                                )}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedclassOfficals.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className={styles.noData}
                                        >
                                            {t("classOfficial.noData")}
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

export default ClassOffical;
