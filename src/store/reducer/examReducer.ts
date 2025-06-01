"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getExamAll = createAsyncThunk(
    "point/getExamAll",
    async (
        { semester, schoolyear }: { semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/exam-schedule/all?semester=${semester}&schoolyear=${schoolyear}`
            );

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

//lấy danh sách lớp thành công
export const getAllClassStudent = createAsyncThunk(
    "point/getAllClassStudent",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/class-student/success-classes-subject`
            );

            return fulfillWithValue(data);
        } catch (error) {
            const e = error as Error;
            return rejectWithValue(e.message || "An unknown error occurred");
        }
    }
);

//tạo lịch thi
export const createExam = createAsyncThunk(
    "exam/createExam",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/exam-schedule/midterm`, dto);

            return fulfillWithValue(data);
        } catch (error) {
            const e = error as Error;
            return rejectWithValue(e.message || "An unknown error occurred");
        }
    }
);

//get lịch thi theo id
//http://localhost:8080/api/exam-schedule/7
export const getExamByIds = createAsyncThunk(
    "point/getExamByIds",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/exam-schedule/${id}`);

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

//lịch thi theo sinh viên
export const getExamForStu = createAsyncThunk(
    "point/getExamForStu",
    async (
        { semester, schoolyear }: { semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/exam-schedule/student/all?semester=${semester}&schoolyear=${schoolyear}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(data);

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

export const updateExam = createAsyncThunk(
    "exam/updateExam",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(`/exam-schedule/${id}`, dto, {
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

export const deletePoint = createAsyncThunk(
    "point/deletePoint",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/grade-types/${id}`);

            return fulfillWithValue(data);
        } catch (error) {
            const e = error as Error;
            return rejectWithValue(e.message || "An unknown error occurred");
        }
    }
);

export const examReducer = createSlice({
    name: "exam",
    initialState: {
        successMessage: "",
        errorMessage: "",

        allExams: [] as any,
        examsForStu: [] as any,
        examDetail: {} as any,

        classStudent: [] as any,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExamAll.rejected, (state, { payload }) => {
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
            .addCase(getExamAll.fulfilled, (state, { payload }) => {
                state.allExams = payload.data;
            })

            .addCase(createExam.rejected, (state, { payload }) => {
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
            .addCase(createExam.fulfilled, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.successMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.successMessage = (
                        payload as { message: string }
                    ).message;
                }
            })

            .addCase(updateExam.rejected, (state, { payload }) => {
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
            .addCase(updateExam.fulfilled, (state, { payload }) => {
                if (typeof payload === "string") {
                    state.successMessage = payload;
                } else if (
                    payload &&
                    typeof payload === "object" &&
                    "message" in payload
                ) {
                    state.successMessage = (
                        payload as { message: string }
                    ).message;
                }
            })

            .addCase(getAllClassStudent.fulfilled, (state, { payload }) => {
                state.classStudent = payload.data;
            })

            .addCase(getExamForStu.fulfilled, (state, { payload }) => {
                state.examsForStu = payload.data;
            })

            .addCase(getExamByIds.fulfilled, (state, { payload }) => {
                state.examDetail = payload.data;
            });
    },
});

export const { messageClear } = examReducer.actions;
export default examReducer.reducer;
