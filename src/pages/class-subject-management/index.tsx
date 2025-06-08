import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useState, useMemo } from "react";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { BiListCheck } from "react-icons/bi";
import clsx from "clsx";
import AuthGuard from "@/components/AuthGuard";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TypographyBody } from "@/components/TypographyBody";
import { getClassSubjectFollowLecturer } from "@/store/reducer/classReducer";
import SelectWithLabel from "@/components/SelectWithLabel";
import { getCurrentSemesterAndSchoolYear } from "@/constants/constants";
import { getListStudentFollowClassSubject } from "@/store/reducer/attendanceReducer";
import { exportStudentListToExcel } from "@/constants/exportExel";

const ClassSubjectManagement = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const { classSubjectFollowLecturer } = useSelector(
        (state: RootState) => state.class
    );

    const { listStudent } = useSelector((state: RootState) => state.attendance);

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
            getClassSubjectFollowLecturer({
                semester: semester,
                schoolyear: schoolyear,
            })
        );
    }, [dispatch, schoolyear, semester]);

    const paginatedData = useMemo(() => {
        const filtered = classSubjectFollowLecturer.filter((item) => {
            const keyword = searchValue.toLowerCase();
            return (
                item.subjectName.toLowerCase().includes(keyword) ||
                item.className.toLowerCase().includes(keyword)
            );
        });

        const start = (currentPage - 1) * parPage;
        const end = start + parPage;
        return filtered.slice(start, end);
    }, [classSubjectFollowLecturer, searchValue, currentPage, parPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <BorderBox title={t("classSubject.title")}>
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
                        {classSubjectFollowLecturer.length > 0 ? (
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th style={{ minWidth: "50px" }}>
                                            {t("common.index")}
                                        </th>
                                        <th style={{ minWidth: "200px" }}>
                                            {t("classSubject.className")}
                                        </th>
                                        <th style={{ minWidth: "150px" }}>
                                            {t("classSubject.subjectName")}
                                        </th>
                                        <th
                                            style={{
                                                minWidth: "300px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {t("common.action")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map(
                                        (classSubject: any, index: number) => (
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
                                                    {classSubject.className}
                                                </td>
                                                <td>
                                                    {classSubject.subjectName}
                                                </td>

                                                <td
                                                    className={
                                                        styles.buttonAction
                                                    }
                                                >
                                                    <Link
                                                        href={`class-subject-management/attendance/${classSubject.classStudentId}?classname=${classSubject.className}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.attendanceButton
                                                        )}
                                                    >
                                                        <AiOutlineCheckSquare />
                                                        {t(
                                                            "classSubject.attendance"
                                                        )}
                                                    </Link>
                                                    <Link
                                                        href={`#`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.listButton
                                                        )}
                                                        onClick={async (e) => {
                                                            e.preventDefault();

                                                            await dispatch(
                                                                getListStudentFollowClassSubject(
                                                                    classSubject.classStudentId
                                                                )
                                                            );

                                                            setTimeout(() => {
                                                                if (
                                                                    !Array.isArray(
                                                                        listStudent
                                                                    ) ||
                                                                    listStudent.length ===
                                                                        0
                                                                ) {
                                                                    alert(
                                                                        "Không có sinh viên nào trong lớp."
                                                                    );
                                                                    return;
                                                                }

                                                                exportStudentListToExcel(
                                                                    listStudent,
                                                                    classSubject.className,
                                                                    classSubject.subjectName
                                                                );
                                                            }, 200); // đợi redux cập nhật state
                                                        }}
                                                    >
                                                        <BiListCheck />{" "}
                                                        {t(
                                                            "classSubject.printList"
                                                        )}
                                                    </Link>
                                                    <Link
                                                        href={`../assignment/${classSubject.classStudentId}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.materials
                                                        )}
                                                    >
                                                        <BiListCheck />{" "}
                                                        {t(
                                                            "classSubject.assignment"
                                                        )}
                                                    </Link>
                                                    <Link
                                                        href={`/class-subject-management/materials?classId=${classSubject.classStudentId}`}
                                                        className={clsx(
                                                            styles.viewButton,
                                                            styles.assignment
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
                            totalItem={classSubjectFollowLecturer.length}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ClassSubjectManagement;
