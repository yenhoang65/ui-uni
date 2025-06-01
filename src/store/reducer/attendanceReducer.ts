"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAttendancceSession = createAsyncThunk(
    "attendance/getAttendancceSession",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/attendance/sessions/by-class-student/${classStudentId}`
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

export const getListStudentFollowClassSubject = createAsyncThunk(
    "attendance/getListStudentFollowClassSubject",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/attendance/students/by-class-student/${classStudentId}`
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

export const markAttendance = createAsyncThunk(
    "attendance/markAttendance",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/attendance/mark`, dto);

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

export const getListAttendanceAfterMark = createAsyncThunk(
    "attendance/getListAttendanceAfterMark",
    async (attendanceId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/attendance/get-by-session/${attendanceId}`
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

export const updateMarkAttendance = createAsyncThunk(
    "attendance/updateMarkAttendance",
    async (
        { attendanceId, dto }: { attendanceId: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(
                `/attendance/update/${attendanceId}`,
                dto
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

export const attendanceReducer = createSlice({
    name: "attendance",
    initialState: {
        successMessage: "",
        errorMessage: "",
        attendanceSession: [] as any,
        listStudent: [] as any,

        listAttendanceAfterMark: [] as any,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAttendancceSession.fulfilled, (state, { payload }) => {
                state.attendanceSession = payload.data;
            })
            .addCase(
                getListStudentFollowClassSubject.fulfilled,
                (state, { payload }) => {
                    state.listStudent = payload.data;
                }
            )

            .addCase(markAttendance.rejected, (state, { payload }) => {
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

            .addCase(markAttendance.fulfilled, (state, { payload }) => {
                state.successMessage = "Saved";
            })

            .addCase(
                getListAttendanceAfterMark.rejected,
                (state, { payload }) => {
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
                        state.errorMessage =
                            "Đã có lỗi xảy ra, vui lòng thử lại";
                    }
                }
            )

            .addCase(
                getListAttendanceAfterMark.fulfilled,
                (state, { payload }) => {
                    state.listAttendanceAfterMark = payload.data;
                }
            )

            .addCase(updateMarkAttendance.rejected, (state, { payload }) => {
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

            .addCase(updateMarkAttendance.fulfilled, (state, { payload }) => {
                state.successMessage = "Saved";
            });
    },
});

export const { messageClear } = attendanceReducer.actions;
export default attendanceReducer.reducer;
