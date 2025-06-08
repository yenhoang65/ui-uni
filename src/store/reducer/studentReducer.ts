"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FileDownload from "js-file-download"; // dùng để download file dễ dàng

type Student = {
    userId: number;
    userName: string | "";
    gender: string | "";
    phoneNumber: string | "";
    dateOfBirth: string | "";
    educationLevel: string | "";
    admissionDate: string | "";
    typeOfTraining: string | "";
    specializationId: number;
    specializationName: string | "";
    status: string | "";
    classId: number;

    email: string | "";
    address: string | "";
    ethnicGroup: string | "";
    religion: string | "";

    idNumber: string | "";
    placeOfBirth: string | "";
    permanentResident: string | "";
    bank: string | "";
    bankAccountOwner: string | "";
    bankAccountNumber: string | "";
};

type GetParam = {
    currentPage: number;
    parPage: number;
    searchValue: string | "";
};

export const getListStudent = createAsyncThunk(
    "student/getListstudent",
    async (
        {
            perPage,
            currentPage,
            searchValue,
        }: { perPage: any; currentPage: any; searchValue: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/students/paging?currentPage=${currentPage}&perPage=${perPage}&searchValue=${searchValue}`,
                {
                    withCredentials: true,
                }
            );

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const getStudentDetail = createAsyncThunk(
    "student/getStudentDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/students/${id}`, {
                withCredentials: true,
            });

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const updateStudent = createAsyncThunk(
    "student/updateStudent",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            // Gửi yêu cầu PUT với FormData
            const { data } = await api.put(`/students/${id}`, dto, {
                withCredentials: true,
            });

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const createStudent = createAsyncThunk(
    "student/createStudent",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/students`, dto, {
                withCredentials: true,
            });

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const deleteStudent = createAsyncThunk(
    "student/deleteStudent",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/students/${id}`);

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const filterStudent = createAsyncThunk(
    "student/filterStudent",
    async (classId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/students/filter?classId=${classId}`
            );

            return fulfillWithValue(data);
        } catch (error: any) {
            // const e = error as Error;
            // return rejectWithValue(e.message);
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const importFileStudent = createAsyncThunk(
    "student/importFileStudent",
    async (file: File, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const { data } = await api.post(`/students/import`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            return fulfillWithValue(data);
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Lỗi không xác định từ máy chủ.",
            });
        }
    }
);

export const exportStudentByClass = createAsyncThunk(
    "student/exportStudentByClass",
    async (classId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `/students/export/class/${classId}`,
                {
                    responseType: "blob",
                    withCredentials: true,
                }
            );

            FileDownload(response.data, "students.xlsx");
            return true;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: "Không thể export dữ liệu.",
            });
        }
    }
);

export const studentReducer = createSlice({
    name: "student",
    initialState: {
        successMessage: "",
        errorMessage: "",
        students: [] as Student[],
        student: {} as Student,
        totalStudent: 0,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(login.pending, (state) => {
            //     state.loader = true;
            // })
            // .addCase(login.rejected, (state, { payload }) => {
            //     state.loader = false;
            // })
            .addCase(getListStudent.fulfilled, (state, { payload }) => {
                state.students = payload.data.content;
                state.totalStudent = payload.data.totalElements;
            })
            .addCase(getStudentDetail.fulfilled, (state, { payload }) => {
                state.student = payload.data;
            })
            .addCase(updateStudent.rejected, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(updateStudent.fulfilled, (state, { payload }) => {
                state.successMessage = "Update student thành công";
            })
            .addCase(createStudent.rejected, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(createStudent.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm student thành công";
            })
            .addCase(deleteStudent.rejected, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(deleteStudent.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa student thành công";
            })
            .addCase(filterStudent.fulfilled, (state, { payload }) => {
                state.students = payload.data;
            })
            .addCase(importFileStudent.rejected, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(importFileStudent.fulfilled, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(exportStudentByClass.rejected, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.errorMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.errorMessage = (
                        payload as { message: string }
                    ).message;
                } else {
                    state.errorMessage = "Lỗi khi export dữ liệu.";
                }
            })
            .addCase(exportStudentByClass.fulfilled, (state) => {
                state.successMessage = "Export thành công";
            });
    },
});

export const { messageClear } = studentReducer.actions;
export default studentReducer.reducer;
