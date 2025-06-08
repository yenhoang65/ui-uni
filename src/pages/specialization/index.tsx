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
import { getListMajor } from "@/store/reducer/majorReducer";
import toast from "react-hot-toast";
import {
    messageClear,
    searchSpec,
} from "@/store/reducer/specializationReducer";
import { deleteSpec, getListSpec } from "@/store/reducer/specializationReducer";

const Specialization = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { specializations, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.specialization
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteSpecializationId, setDeleteSpecializationId] = useState<
        string | null
    >(null);

    const handleDelete = () => {
        if (deleteSpecializationId) {
            setIsModalOpen(false);
            setDeleteSpecializationId(null);
            dispatch(deleteSpec(deleteSpecializationId));
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteSpecializationId(null);
    };

    useEffect(() => {
        dispatch(getListSpec());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getListMajor());
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchValue.trim() !== "") {
                dispatch(searchSpec(searchValue));
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

            dispatch(getListSpec());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const totalItem = specializations.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedSpecializations = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return specializations.slice(start, end);
    }, [specializations, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Quản lý chuyên ngành">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <Link
                            href="/specialization/create-edit"
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ width: "70px" }}>STT</th>
                                    <th style={{ minWidth: "150px" }}>
                                        Mã chuyên ngành
                                    </th>
                                    <th style={{ minWidth: "180px" }}>
                                        Tên chuyên ngành
                                    </th>
                                    <th style={{ minWidth: "180px" }}>
                                        Tên ngành
                                    </th>

                                    <th style={{ minWidth: "80px" }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSpecializations.map(
                                    (specialization, index) => (
                                        <tr
                                            key={
                                                specialization.specializationId
                                            }
                                        >
                                            <td>{index + 1}</td>
                                            <td>
                                                {
                                                    specialization.specializationId
                                                }
                                            </td>
                                            <td>
                                                {
                                                    specialization.specializationName
                                                }
                                            </td>

                                            <td>{specialization.majorName}</td>

                                            <td className={styles.buttonAction}>
                                                <Link
                                                    href={`/specialization/view?id=${specialization.specializationId}`}
                                                    className={clsx(
                                                        styles.viewButton
                                                    )}
                                                >
                                                    <FaEye />
                                                </Link>
                                                <Link
                                                    href={`/specialization/create-edit?id=${specialization.specializationId}&mode=edit`}
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
                                                        setDeleteSpecializationId(
                                                            specialization.specializationId
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
                                                    deleteSpecializationId ===
                                                        specialization.specializationId && (
                                                        <ModalConfirm
                                                            message="Are you sure you want to delete?"
                                                            onConfirm={
                                                                handleDelete
                                                            }
                                                            onCancel={
                                                                handleCancel
                                                            }
                                                        />
                                                    )}
                                            </td>
                                        </tr>
                                    )
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

export default Specialization;
