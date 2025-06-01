import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ClassScheduleRow {
    stt: number;
    className: string;
    lecturerName: string;
    room: string;
    lesson: string;
}

export const exportScheduleExcel = (
    data: ClassScheduleRow[],
    selectedDate: string
) => {
    const header = [
        ["LỊCH HỌC THEO NGÀY", selectedDate],
        [],
        ["STT", "Mã lớp", "Tên giảng viên", "Phòng học", "Tiết học"],
    ];

    const body = data.map((item) => [
        item.stt,
        item.className,
        item.lecturerName,
        item.room,
        item.lesson,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...body]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LichHoc");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
        type: "application/octet-stream",
    });

    saveAs(blob, `LichHoc_${selectedDate}.xlsx`);
};
