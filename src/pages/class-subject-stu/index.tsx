import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useMemo, useState } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { BiListCheck } from "react-icons/bi";
import clsx from "clsx";
import AuthGuard from "@/components/AuthGuard";
import { TypographyBody } from "@/components/TypographyBody";
import SelectWithLabel from "@/components/SelectWithLabel";
import { getCurrentSemesterAndSchoolYear } from "@/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getClassSubjectFollowStudent } from "@/store/reducer/classReducer";

const ClassSubjectStu = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { classSubjectFollowStudent } = useSelector(
        (state: RootState) => state.class
    );

    const [listStudent, setListStudent] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [parPage, setParPage] = useState(10);

    const [semester, setSemester] = useState<number>(
        () => getCurrentSemesterAndSchoolYear().semester
    );
    const [schoolyear, setSchoolyear] = useState<number>(
        () => getCurrentSemesterAndSchoolYear().schoolyear
    );

    useEffect(() => {
        dispatch(
            getClassSubjectFollowStudent({
                semester: semester,
                schoolyear: schoolyear,
            })
        );
    }, [dispatch, schoolyear, semester]);

    const paginatedData = useMemo(() => {
        const filtered = classSubjectFollowStudent.filter((item: any) => {
            const keyword = searchValue.toLowerCase();
            const subject = item.subjectName?.toLowerCase() || "";
            const classname = item.classname?.toLowerCase() || "";
            return subject.includes(keyword) || classname.includes(keyword);
        });

        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return filtered.slice(start, end);
    }, [classSubjectFollowStudent, searchValue, currentPage, parPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    console.log(classSubjectFollowStudent);

    return (
        <AuthGuard allowedRoles={["student"]}>
            <BorderBox title="Quản lý lớp học phần">
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
                        {paginatedData.length > 0 ? (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th style={{ minWidth: "50px" }}>
                                            STT
                                        </th>
                                        <th style={{ minWidth: "200px" }}>
                                            Lớp học phần
                                        </th>
                                        <th style={{ minWidth: "150px" }}>
                                            Môn học
                                        </th>
                                        <th
                                            style={{
                                                minWidth: "300px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map(
                                        (classSubject: any, index: any) => (
                                            <tr
                                                key={
                                                    classSubject.classStudentId
                                                }
                                            >
                                                <td>
                                                    {(currentPage - 1) *
                                                        parPage +
                                                        index +
                                                        1}
                                                </td>
                                                <td>
                                                    {classSubject.classname}
                                                </td>
                                                <td>
                                                    {
                                                        classSubject.subject
                                                            .subjectName
                                                    }
                                                </td>
                                                <td
                                                    className={
                                                        styles.buttonAction
                                                    }
                                                >
                                                    <Link
                                                        href={`/class-subject-stu/view-attendance?classId=${classSubject.classStudentId}&&subject=${classSubject.subject.subjectName}&&subjectId=${classSubject.subject.subjectId}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.attendanceButton
                                                        )}
                                                    >
                                                        <AiOutlineCheckSquare />
                                                        Lịch sử điểm danh
                                                    </Link>

                                                    <Link
                                                        href={`/class-subject-stu/submit-assignment?classId=${classSubject.classStudentId}&&subject=${classSubject.subjectName}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.assignment
                                                        )}
                                                    >
                                                        <BiListCheck /> Bài tập
                                                    </Link>
                                                    <Link
                                                        href={`/class-subject-stu/materials?classId=${classSubject.classStudentId}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.materials
                                                        )}
                                                    >
                                                        <BiListCheck /> Tài liệu
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <TypographyBody tag="span" theme="lg">
                                Không có bản ghi
                            </TypographyBody>
                        )}
                    </div>

                    <div className={styles.paginationWrapper}>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={paginatedData.length}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassSubjectStu;
