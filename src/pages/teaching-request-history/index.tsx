import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getListScheduleRequestFollowStatus } from "@/store/reducer/teachingAssignment";
import { Span } from "next/dist/trace";
import { TypographyBody } from "@/components/TypographyBody";

const weekdays = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
];

function getWeekday(dateString: string) {
    const date = new Date(dateString);
    return weekdays[date.getDay()];
}

const ScheduleRequestFollowStatus = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(100);
    const [searchValue] = useState("");

    const { scheduleRequests } = useSelector(
        (state: RootState) => state.teachingAssignment
    );

    useEffect(() => {
        dispatch(
            getListScheduleRequestFollowStatus({
                currentPage: currentPage,
                parPage: perPage,
                searchValue,
                statuses: "success",
            })
        );
    }, [currentPage, perPage, searchValue, dispatch]);

    // Helper để lấy thông tin từng loại lớp
    function renderScheduleDetail(details: any[], classType: "LT" | "TH") {
        const filtered = details.filter((d) => d.classType === classType);
        if (filtered.length === 0) return null;
        return filtered.map((d, idx) => (
            <div key={idx}>
                <b>{classType}:</b> {getWeekday(d.dateTime)}{" "}
                {new Date(d.dateTime).toLocaleDateString("vi-VN")} →{" "}
                {new Date(d.endDate).toLocaleDateString("vi-VN")}
                {d.lesson ? ` (${d.lesson})` : ""}
            </div>
        ));
    }

    return (
        <BorderBox title="Lịch sử đăng ký giảng dạy">
            <div className={styles.tableWrapper}>
                {scheduleRequests.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th>STT</th>
                                <th>Môn học</th>
                                <th>Lớp</th>
                                <th>GV</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleRequests.map(
                                (item: any, index: number) => (
                                    <tr key={item.scheduleId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {
                                                item.assignment.subject
                                                    .subjectName
                                            }
                                        </td>
                                        <td>
                                            {item.assignment.termClass.termName}
                                        </td>
                                        <td>
                                            {
                                                item.assignment.lecturer
                                                    .lecturerName
                                            }
                                        </td>
                                        <td style={{ whiteSpace: "pre-line" }}>
                                            {renderScheduleDetail(
                                                item.scheduleDetails,
                                                "LT"
                                            )}
                                            {renderScheduleDetail(
                                                item.scheduleDetails,
                                                "TH"
                                            )}
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
        </BorderBox>
    );
};

export default ScheduleRequestFollowStatus;
