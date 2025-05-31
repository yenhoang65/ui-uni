import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import clsx from "clsx";
import ModalConfirm from "@/components/ModalConfirm";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    deletePoint,
    getPoint,
    messageClear,
} from "@/store/reducer/pointReducer";
import toast from "react-hot-toast";

// Mock data for grade_type
type GradeType = {
    grade_type_id: number;
    code: string;
    name: string;
    coefficient: number;
};

const MOCK_GRADE_TYPES: GradeType[] = [
    { grade_type_id: 1, code: "MID", name: "Giữa kỳ", coefficient: 0.4 },
    { grade_type_id: 2, code: "FINAL", name: "Cuối kỳ", coefficient: 0.6 },
    {
        grade_type_id: 3,
        code: "QUIZ",
        name: "Kiểm tra nhanh",
        coefficient: 0.2,
    },
];

const PointManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { listPoint, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.point
    );

    const [gradeTypes, setGradeTypes] = useState<GradeType[]>(MOCK_GRADE_TYPES);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(getPoint());
    }, []);

    const handleDelete = () => {
        if (deleteId !== null) {
            dispatch(deletePoint(deleteId));
            setIsModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteId(null);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(getPoint());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Quản lý loại điểm">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />
                        <Link
                            href="/point-management/create-edit"
                            className={styles.buttonAdd}
                        >
                            + Thêm mới
                        </Link>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "100px" }}>ID</th>
                                    <th style={{ minWidth: "150px" }}>
                                        Mã loại điểm
                                    </th>
                                    <th style={{ minWidth: "200px" }}>
                                        Tên loại điểm
                                    </th>
                                    <th style={{ minWidth: "120px" }}>Hệ số</th>
                                    <th style={{ minWidth: "120px" }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listPoint.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            style={{ textAlign: "center" }}
                                        >
                                            Không có loại điểm nào.
                                        </td>
                                    </tr>
                                )}
                                {listPoint.map((type: any) => (
                                    <tr key={type.gradeTypeId}>
                                        <td>{type.gradeTypeId}</td>
                                        <td>{type.code}</td>
                                        <td>{type.name}</td>
                                        <td>{type.coefficient}</td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/point-management/create-edit?id=${type.gradeTypeId}&mode=edit`}
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
                                                    setDeleteId(
                                                        type.gradeTypeId
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
                                                deleteId ===
                                                    type.gradeTypeId && (
                                                    <ModalConfirm
                                                        message="Bạn có chắc chắn muốn xóa loại điểm này?"
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
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default PointManagement;
