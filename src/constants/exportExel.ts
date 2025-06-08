import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportStudentListToExcel = (
    students: { userId: number; fullName: string }[],
    className: string,
    subjectName: string
) => {
    const header = [
        ["Mã lớp:", className],
        ["Tên môn học:", subjectName],
        [],
        ["STT", "Mã sinh viên", "Tên sinh viên", "Ghi chú"],
    ];

    const data = students.map((student, index) => [
        index + 1,
        student.userId,
        student.fullName,
        "", // Ghi chú để trống
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
    });
    saveAs(blob, `DanhSach_${className}_${subjectName}.xlsx`);
};
