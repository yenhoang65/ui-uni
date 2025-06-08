import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
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
    deleteFaculty,
    getListFaculty,
    searchFaculty,
} from "@/store/reducer/facultyReducer";

const Faculty = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const { faculties } = useSelector((state: RootState) => state.faculty);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(20);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteFacultyId, setDeleteFacultyId] = useState<string | null>(null);

    const handleDelete = () => {
        if (deleteFacultyId) {
            dispatch(deleteFaculty(deleteFacultyId));
            setIsModalOpen(false);
            setDeleteFacultyId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteFacultyId(null);
    };

    useEffect(() => {
        dispatch(getListFaculty());
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchValue.trim() !== "") {
                dispatch(searchFaculty(searchValue));
            } else {
                dispatch(getListFaculty());
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchValue]);

    const totalItem = faculties.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedFaculties = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return faculties.slice(start, end);
    }, [faculties, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={t("common.faculty-management")}>
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href={"/faculty/create-edit"}
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
                                    <th style={{ width: "250px" }}>
                                        {t("common.name")}
                                    </th>
                                    <th style={{ width: "150px" }}>
                                        {t("common.logo")}
                                    </th>
                                    <th style={{ width: "180px" }}>
                                        {t("common.established-date")}
                                    </th>

                                    <th
                                        style={{
                                            width: "200px",
                                            textAlign: "center",
                                        }}
                                    >
                                        {t("common.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedFaculties.map((faculty, index) => (
                                    <tr key={faculty.facultyId}>
                                        <td>{index + 1}</td>
                                        <td>{faculty.facultyName}</td>
                                        <td>
                                            {faculty.facultyLogo && (
                                                <img
                                                    src={faculty.facultyLogo}
                                                    alt="logo"
                                                    width={80}
                                                    height={80}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            {faculty.facultyDateOfEstablishment}
                                        </td>
                                        {/* <td>
                                            <a
                                                href={faculty.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {faculty.website}
                                            </a>
                                        </td> */}
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/faculty/view?id=${faculty.facultyId}`}
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/faculty/create-edit?id=${faculty.facultyId}&mode=edit`}
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
                                                    setDeleteFacultyId(
                                                        faculty.facultyId
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
                                                deleteFacultyId ===
                                                    faculty.facultyId && (
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

                    {totalItem >= parPage && (
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

export default Faculty;
