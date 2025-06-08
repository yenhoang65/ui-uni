"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Major = {
    majorId: string | null;
    majorName: string | null;
    majorDateOfEstablishment: string | null;
    majorDescription: string | null;
    majorStatus: string | null;
    facultyName: string | null;
    facultyId: string | null;
};

type GetParam = {
    currentPage: number;
    parPage: number;
    searchValue: string;
};

export const getListMajor = createAsyncThunk(
    "major/getListMajor",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/majors`, {
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

export const getMajorDetail = createAsyncThunk(
    "major/getMajorDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/majors/${id}`, {
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

export const updateMajor = createAsyncThunk(
    "major/updateMajor",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            // Gửi yêu cầu PUT với FormData
            const { data } = await api.put(`/majors/${id}`, dto, {
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

export const createMajor = createAsyncThunk(
    "major/createMajor",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/majors`, dto, {
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

export const deleteMajor = createAsyncThunk(
    "major/deleteMajor",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/majors/${id}`);

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

export const searchMajor = createAsyncThunk(
    "major/searchFaculty",
    async (name: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/majors/search?name=${name}`, {
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

export const majorReducer = createSlice({
    name: "auth",
    initialState: {
        successMessage: "",
        errorMessage: "",
        majors: [] as Major[],
        major: {} as Major,
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
            .addCase(getListMajor.fulfilled, (state, { payload }) => {
                state.majors = payload.data;
            })
            .addCase(searchMajor.fulfilled, (state, { payload }) => {
                state.majors = payload.data;
            })
            .addCase(getMajorDetail.fulfilled, (state, { payload }) => {
                state.major = payload.data;
            })
            .addCase(updateMajor.rejected, (state, { payload }) => {
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
            .addCase(updateMajor.fulfilled, (state, { payload }) => {
                state.successMessage = "Update major thành công";
            })
            .addCase(createMajor.rejected, (state, { payload }) => {
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
            .addCase(createMajor.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm major thành công";
            })
            .addCase(deleteMajor.rejected, (state, { payload }) => {
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
            .addCase(deleteMajor.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa major thành công";
            });
    },
});

export const { messageClear } = majorReducer.actions;
export default majorReducer.reducer;
