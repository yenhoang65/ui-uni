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
import SelectWithLabel from "@/components/SelectWithLabel";
import { getExamForStu } from "@/store/reducer/examReducer";
import { TypographyBody } from "@/components/TypographyBody";

// Mock data với tên môn học (subject_name)
const mockExamSchedules = [
    {
        id: "EXS001",
        class_subject_id: "CS001",
        subject_name: "Công nghệ phần mềm",
        classroom_id: "A101",
        exam_date: "2025-06-10",
        start_time: "08:00",
        end_time: "10:00",
        exam_form: "Trắc nghiệm",
    },
    {
        id: "EXS002",
        class_subject_id: "CS002",
        subject_name: "Cơ sở dữ liệu",
        classroom_id: "B202",
        exam_date: "2025-06-12",
        start_time: "13:30",
        end_time: "15:30",
        exam_form: "Tự luận",
    },
    {
        id: "EXS003",
        class_subject_id: "CS003",
        subject_name: "Lập trình Web",
        classroom_id: "C303",
        exam_date: "2025-06-15",
        start_time: "09:00",
        end_time: "11:00",
        exam_form: "Vấn đáp",
    },
];

const ExamScheduleManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { examsForStu } = useSelector((state: RootState) => state.exam);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(5);

    const [semester, setSemester] = useState<number>(1);
    const [schoolyear, setSchoolyear] = useState<number>(2026);

    useEffect(() => {
        dispatch(
            getExamForStu({
                semester: semester || undefined,
                schoolyear: schoolyear || undefined,
            })
        );
    }, [semester, schoolyear]);

    const totalItem = examsForStu.length;
    const totalPages = Math.ceil(totalItem / parPage);

    const paginatedexamsForStu = useMemo(() => {
        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return examsForStu.slice(start, end);
    }, [examsForStu, currentPage, parPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    console.log(examsForStu);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Lịch thi">
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
                    </div>

                    <div className={styles.tableWrapper}>
                        {paginatedexamsForStu.length > 0 ? (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th style={{ width: "70px" }}>STT</th>
                                        <th>Mã lớp học phần</th>
                                        <th>Tên môn học</th>
                                        <th>Bài thi</th>
                                        <th>Ngày thi</th>
                                        <th>Giờ bắt đầu</th>
                                        <th>Giờ kết thúc</th>
                                        <th>Hình thức thi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedexamsForStu.map(
                                        (item: any, index: any) => (
                                            <tr key={item.examScheduleId}>
                                                <td>{index + 1}</td>
                                                <td>{item.className}</td>
                                                <td>{item.subjectName}</td>
                                                <td>{item.gradeType}</td>
                                                <td>{item.startDate}</td>
                                                <td>{item.startTime}</td>
                                                <td>{item.endTime}</td>
                                                <td>{item.examForm}</td>
                                            </tr>
                                        )
                                    )}
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
