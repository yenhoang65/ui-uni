"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createSlide = createAsyncThunk(
    "faculty/createSlide",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/slides`, dto);

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

export const updateSlide = createAsyncThunk(
    "faculty/updateSlide",
    async (
        { id, dto }: { id: number; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(`/slides/${id}`, dto);
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

export const deleteSlide = createAsyncThunk(
    "faculty/deleteSlide",
    async (id: number, { rejectWithValue, fulfillWithValue }) => {
        try {
            await api.delete(`/slides/${id}`);
            return fulfillWithValue("Xoá slide thành công!");
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Xảy ra lỗi khi xóa slide."
            );
        }
    }
);

export const materialReducer = createSlice({
    name: "material",
    initialState: {
        successMessage: "",
        errorMessage: "",
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSlide.rejected, (state, { payload }) => {
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
            .addCase(createSlide.fulfilled, (state, { payload }) => {
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
                } else {
                    state.successMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })
            .addCase(updateSlide.rejected, (state, { payload }) => {
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
            .addCase(updateSlide.fulfilled, (state, { payload }) => {
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
                } else {
                    state.successMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            })

            .addCase(deleteSlide.rejected, (state, { payload }) => {
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
            .addCase(deleteSlide.fulfilled, (state, { payload }) => {
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
                } else {
                    state.successMessage = "Đã có lỗi xảy ra, vui lòng thử lại";
                }
            });
    },
});

export const { messageClear } = materialReducer.actions;
export default materialReducer.reducer;
