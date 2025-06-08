import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import clsx from "clsx";
import { IoMdAddCircle } from "react-icons/io";
import ModalConfirm from "@/components/ModalConfirm";
import SelectWithLabel from "@/components/SelectWithLabel";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getListClassOffical } from "@/store/reducer/classReducer";
import {
    deleteStudent,
    exportStudentByClass,
    filterStudent,
    getListStudent,
    messageClear,
} from "@/store/reducer/studentReducer";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";

const StudentManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classOfficals } = useSelector((state: RootState) => state.class);
    const { students, totalStudent, successMessage, errorMessage } =
        useSelector((state: RootState) => state.student);

    const [currentPage, setCurrentPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() => {
        dispatch(getListClassOffical());
    }, []);

    useEffect(() => {
        dispatch(
            getListStudent({
                perPage: parPage,
                currentPage: currentPage,
                searchValue: searchValue,
            })
        );
    }, [parPage, currentPage, searchValue]);

    const handleDelete = () => {
        if (deleteStudentId) {
            dispatch(deleteStudent(deleteStudentId));
            setIsModalOpen(false);
            setDeleteStudentId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteStudentId(null);
    };

    const handleClassFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedValue = e.target.value;
        setSelectedClass(selectedValue);

        if (selectedValue === "") {
            dispatch(
                getListStudent({
                    perPage: parPage,
                    currentPage: currentPage,
                    searchValue: searchValue,
                })
            );
        } else {
            dispatch(filterStudent(selectedValue));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            dispatch(
                getListStudent({
                    perPage: parPage,
                    currentPage: currentPage,
                    searchValue: searchValue,
                })
            );
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title="Quản lý sinh viên">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <div className={styles.filters}>
                            <Search
                                setParPage={setParPage}
                                setSearchValue={setSearchValue}
                                searchValue={searchValue}
                            />

                            <SelectWithLabel
                                name="classId"
                                value={selectedClass}
                                onChange={handleClassFilterChange}
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...classOfficals.map((classOffical) => ({
                                        value: String(
                                            classOffical.classId ?? ""
                                        ),
                                        label:
                                            String(classOffical.classId) ?? "",
                                    })),
                                ]}
                            />

                            <Button
                                onClick={() => {
                                    if (selectedClass) {
                                        dispatch(
                                            exportStudentByClass(
                                                Number(selectedClass)
                                            )
                                        );
                                    } else {
                                        toast.error(
                                            "Vui lòng chọn lớp để export"
                                        );
                                    }
                                }}
                                className={styles.exportButton}
                            >
                                Export Excel
                            </Button>
                        </div>

                        <Link
                            href="/student_management/create-edit"
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "100px" }}>Mã SV</th>
                                    <th style={{ minWidth: "200px" }}>
                                        Tên SV
                                    </th>
                                    <th style={{ minWidth: "150px" }}>Lớp</th>
                                    <th style={{ minWidth: "250px" }}>
                                        Chuyên ngành
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.userId}>
                                        <td>{student.userId}</td>
                                        <td>{student.userName}</td>
                                        <td>{student.classId}</td>
                                        <td>{student.specializationName}</td>
                                        <td className={styles.buttonAction}>
                                            <Link
                                                href={`/student_management/view?id=${student.userId}`} // Đường dẫn xem chi tiết
                                                className={clsx(
                                                    styles.viewButton
                                                )}
                                            >
                                                <FaEye />
                                            </Link>
                                            <Link
                                                href={`/student_management/create-edit?id=${student.userId}&mode=edit`} // Đường dẫn chỉnh sửa
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
                                                    setDeleteStudentId(
                                                        student.userId
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
                                                deleteStudentId ===
                                                    student.userId && (
                                                    <ModalConfirm
                                                        message="Bạn có chắc chắn muốn xóa sinh viên này?"
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

                    {totalStudent > parPage && (
                        <div className={styles.paginationWrapper}>
                            <Pagination
                                pageNumber={currentPage + 1}
                                setPageNumber={(page) =>
                                    setCurrentPage(page - 1)
                                }
                                totalItem={totalStudent}
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

export default StudentManagement;
