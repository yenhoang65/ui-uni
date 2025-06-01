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
import SelectWithLabel from "@/components/SelectWithLabel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getExamAll } from "@/store/reducer/examReducer";
import { TypographyBody } from "@/components/TypographyBody";
import { useRouter } from "next/router";

const ExamScheduleManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { allExams } = useSelector((state: RootState) => state.exam);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [semester, setSemester] = useState<number>(1);
    const [schoolyear, setSchoolyear] = useState<number>(2026);

    useEffect(() => {
        dispatch(
            getExamAll({
                semester: semester || undefined,
                schoolyear: schoolyear || undefined,
            })
        );
    }, [dispatch, schoolyear, semester]);

    const totalItem = allExams.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedallExams = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return allExams.slice(start, end);
    }, [allExams, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <AuthGuard allowedRoles={["admin", "employee"]}>
            <BorderBox title="Quản lý lịch thi">
                <div className={styles.box}>
                    <div className={styles.add}>
                        <Search
                            setParPage={setParPage}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                        />

                        <div className={styles.filterRow}>
                            <SelectWithLabel
                                label=""
                                value={semester}
                                onChange={(e) =>
                                    setSemester(Number(e.target.value))
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    { value: 1, label: "Kỳ 1" },
                                    { value: 2, label: "Kỳ 2" },
                                ]}
                                className={styles.selectFilter}
                            />
                            <SelectWithLabel
                                label=""
                                value={schoolyear}
                                onChange={(e) =>
                                    setSchoolyear(Number(e.target.value))
                                }
                                options={[
                                    { value: "", label: "Tất cả" },
                                    ...Array.from({ length: 6 }, (_, i) => {
                                        const year =
                                            new Date().getFullYear() + 1 - i;
                                        return {
                                            value: year,
                                            label: `${year} - ${year + 1}`,
                                        };
                                    }),
                                ]}
                                className={styles.selectFilter}
                            />
                        </div>

                        <Link
                            href="/exam-schedule-management/create-edit"
                            className={styles.buttonAdd}
                        >
                            <IoMdAddCircle /> Thêm mới
                        </Link>
                    </div>

                    <div className={styles.tableWrapper}>
                        {paginatedallExams.length > 0 ? (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th style={{ width: "70px" }}>STT</th>
                                        <th>Mã lớp học phần</th>
                                        <th>Tên môn học</th>
                                        <th>Mã phòng</th>
                                        <th>Ngày thi</th>
                                        <th>Giờ bắt đầu</th>
                                        <th>Giờ kết thúc</th>
                                        <th>Hình thức thi</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allExams.map((item: any, index: any) => (
                                        <tr key={item.examScheduleId}>
                                            <td>{index + 1}</td>
                                            <td>{item.className}</td>
                                            <td>{item.subjectName}</td>
                                            <td>
                                                {item.classroom.classroomId}
                                            </td>
                                            <td>{item.startDate}</td>
                                            <td>{item.startTime}</td>
                                            <td>{item.endTime}</td>
                                            <td>{item.examForm}</td>
                                            <td className={styles.buttonAction}>
                                                <Link
                                                    href={`/exam-schedule-management/create-edit?id=${item.examScheduleId}&mode=edit`}
                                                    className={clsx(
                                                        styles.viewButton,
                                                        styles.viewButtonUpdate
                                                    )}
                                                >
                                                    <AiFillEdit />
                                                </Link>

                                                {/* <Link
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsModalOpen(true);
                                                        setDeleteExamScheduleId(
                                                            item.id
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
                                                    deleteExamScheduleId ===
                                                        item.id && (
                                                        <ModalConfirm
                                                            message="Bạn chắc chắn muốn xoá lịch thi này?"
                                                            onConfirm={
                                                                handleDelete
                                                            }
                                                            onCancel={
                                                                handleCancel
                                                            }
                                                        />
                                                    )} */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <TypographyBody
                                className={styles.noData}
                                tag="span"
                                theme="lg"
                            >
                                Không có dữ liệu
                            </TypographyBody>
                        )}
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

export default ExamScheduleManagement;
