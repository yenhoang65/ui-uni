import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { FaBan, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import clsx from "clsx";
import ModalConfirm from "@/components/ModalConfirm";
import AuthGuard from "@/components/AuthGuard";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    cancelRegisteredCreditClasses,
    getRegisteredCreditClasses,
    messageClear,
} from "@/store/reducer/creditRegistrationReducer";
import toast from "react-hot-toast";
import { TypographyBody } from "@/components/TypographyBody";

const getVietnameseDay = (dayNumber: number) => {
    const days = [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
    ];
    return days[dayNumber];
};

const RegisteredCreditClasses = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { creditClasses, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.creditRegistration
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteClassId, setDeleteClassId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(getRegisteredCreditClasses());
    }, []);

    const handleDelete = () => {
        if (deleteClassId) {
            dispatch(cancelRegisteredCreditClasses(deleteClassId));
            setIsModalOpen(false);
            setDeleteClassId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteClassId(null);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            dispatch(getRegisteredCreditClasses());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    console.log(creditClasses);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Các lớp tín chỉ đã đăng ký">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th style={{ minWidth: "100px" }}>
                                        Mã lớp
                                    </th>
                                    <th style={{ minWidth: "250px" }}>
                                        Tên môn học
                                    </th>
                                    {/* <th style={{ minWidth: "180px" }}>
                                        Thời gian bắt đầu
                                    </th>
                                    <th style={{ minWidth: "180px" }}>
                                        Thời gian kết thúc
                                    </th> */}
                                    <th style={{ minWidth: "250px" }}>
                                        Thời gian học
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Trạng thái
                                    </th>
                                    <th style={{ minWidth: "120px" }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditClasses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            style={{ textAlign: "center" }}
                                        >
                                            Không có lớp nào đã đăng ký.
                                        </td>
                                    </tr>
                                )}
                                {creditClasses.map((cls) => (
                                    <tr key={cls.classSubjectStudentId}>
                                        <td>
                                            {cls.classSubjectStudentId}-
                                            {cls.classname}
                                        </td>
                                        <td>
                                            {cls.subjectName} - ({cls.ltCredits}{" "}
                                            + {cls.thCredits}*)
                                        </td>
                                        {/* <td>
                                            {cls.scheduleDetails &&
                                            cls.scheduleDetails.length > 0
                                                ? moment(
                                                      cls.scheduleDetails[0]
                                                          .date_time
                                                  ).format("DD/MM/YYYY")
                                                : ""}
                                        </td>
                                        <td>
                                            {cls.scheduleDetails &&
                                            cls.scheduleDetails.length > 0
                                                ? moment(
                                                      cls.scheduleDetails[0]
                                                          .end_date
                                                  ).format("DD/MM/YYYY")
                                                : ""}
                                        </td> */}
                                        <td style={{ lineHeight: "24px" }}>
                                            {cls.scheduleDetails?.map(
                                                (sch, idx) => {
                                                    const startDate = moment(
                                                        sch.date_time
                                                    );
                                                    const endDate = moment(
                                                        sch.end_date
                                                    );
                                                    const weekday =
                                                        getVietnameseDay(
                                                            startDate.day()
                                                        );
                                                    const type =
                                                        sch.class_type === "LT"
                                                            ? "LT"
                                                            : "TH";
                                                    return (
                                                        <div key={idx}>
                                                            {type}: {weekday}{" "}
                                                            {startDate.format(
                                                                "DD/MM/YYYY"
                                                            )}{" "}
                                                            →{" "}
                                                            {endDate.format(
                                                                "DD/MM/YYYY"
                                                            )}{" "}
                                                            ({sch.lesson})
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </td>
                                        <td>
                                            {cls.classStudentStatus ===
                                            "success" ? (
                                                <span
                                                    className={
                                                        styles.statusSuccess
                                                    }
                                                >
                                                    Đã đăng ký
                                                </span>
                                            ) : cls.classStudentStatus ===
                                              "cancel" ? (
                                                <span
                                                    className={
                                                        styles.statusCancel
                                                    }
                                                >
                                                    Đã huỷ
                                                </span>
                                            ) : (
                                                <span
                                                    className={
                                                        styles.statusPending
                                                    }
                                                >
                                                    Chờ duyệt
                                                </span>
                                            )}
                                        </td>
                                        <td className={styles.buttonAction}>
                                            {cls.classStudentStatus ===
                                            "pending" ? (
                                                <>
                                                    <Link
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsModalOpen(
                                                                true
                                                            );
                                                            setDeleteClassId(
                                                                cls.classSubjectStudentId
                                                            );
                                                        }}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.viewButtonDelete
                                                        )}
                                                    >
                                                        <MdDeleteForever /> Hủy
                                                        đăng ký
                                                    </Link>
                                                    {isModalOpen &&
                                                        deleteClassId ===
                                                            cls.classSubjectStudentId && (
                                                            <ModalConfirm
                                                                message="Bạn có chắc chắn muốn hủy đăng ký lớp này?"
                                                                onConfirm={
                                                                    handleDelete
                                                                }
                                                                onCancel={
                                                                    handleCancel
                                                                }
                                                            />
                                                        )}
                                                </>
                                            ) : (
                                                <TypographyBody tag="span">
                                                    <FaBan />
                                                </TypographyBody>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className={styles.paginationWrapper}>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={filteredClasses.length}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div> */}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default RegisteredCreditClasses;
