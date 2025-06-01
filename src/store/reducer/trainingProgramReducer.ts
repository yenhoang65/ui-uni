"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type TrainingProgram = {
    trainingProgramId: number;
    trainingCode: string | null;
    trainingProgramName: string | null;
    createdAt: Date;
    specializationId: number;
    specializationName: string;

    subjectId: number;
    schoolYear: string | null;
    subjectType: string | null;
    prerequisiteFor: string;
};

export type Subject = {
    subjectId: number;
    subjectName: string;
    subjectType: string;
    prerequisiteFor: {
        subjectId: number;
        subjectName: string;
    }[];
};

export type TrainingProgramWithSubjects = {
    trainingProgramId: number;
    trainingProgramName: string;
    schoolYear: string;
    subjects: Subject[];
};

type GetParam = {
    currentPage: number;
    parPage: number;
    searchValue: string;
};

export const getListTrainingProgram = createAsyncThunk(
    "trainingProgram/getListTrainingProgram",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/training-programs`, {
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

export const getTrainingProgramDetail = createAsyncThunk(
    "trainingProgram/getTrainingProgramDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/training-programs/${id}`, {
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

export const updateTrainingProgram = createAsyncThunk(
    "trainingProgram/updateTrainingProgram",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            // Gửi yêu cầu PUT với FormData
            const { data } = await api.put(`/training-programs/${id}`, dto, {
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

export const createTrainingProgram = createAsyncThunk(
    "trainingProgram/createTrainingProgram",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/training-programs`, dto, {
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

export const deleteTrainingProgram = createAsyncThunk(
    "trainingProgram/deleteTrainingProgram",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/training-programs/${id}`);

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

//thêm môn học vào CTĐT
export const addSubjectForTP = createAsyncThunk(
    "trainingProgram/addSubjectForTP",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/intermediaries`, dto, {
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

//xóa toàn bộ môn học trong chương trình đào tạo
export const deleteAllSubjectForTP = createAsyncThunk(
    "trainingProgram/deleteAllSubjectForTP",
    async (trainingProgramId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(
                `/intermediaries/program/${trainingProgramId}`
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

//lấy danh sách các môn học theo mã CTĐT
export const getSubjectFollowTrainingProgram = createAsyncThunk(
    "trainingProgram/getSubjectFollowTrainingProgram",
    async (trainingProgramId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/intermediaries/search/program/${trainingProgramId}`
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

//xóa môn học ra khỏi CTĐT:
export const deleteSubjectFollowTrainingProgram = createAsyncThunk(
    "trainingProgram/deleteSubjectFollowTrainingProgram",
    async (
        {
            trainingProgramId,
            subjectId,
        }: { trainingProgramId: any; subjectId: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.delete(
                `/intermediaries?trainingProgramId=${trainingProgramId}&subjectId=${subjectId}`
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

//ctđt theo sinh viên
export const getTrainingProgramByStu = createAsyncThunk(
    "trainingProgram/getTrainingProgramByStu",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(`/training-programs/all-subjects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

export const getTrainingProgramBySpec = createAsyncThunk(
    "trainingProgram/getTrainingProgramBySpec",
    async (specializationId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/training-programs/specialization?specializationId=${specializationId}`
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

export const searchTP = createAsyncThunk(
    "trainingProgram/searchTP",
    async (name: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/training-programs/search?code=${name}`,
                {
                    withCredentials: true,
                }
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

export const trainingProgramReducer = createSlice({
    name: "trainingProgram",
    initialState: {
        successMessage: "",
        errorMessage: "",
        trainingPrograms: [] as TrainingProgram[],
        trainingProgram: {} as TrainingProgram,
        subjectFollowTrainingProgram: {} as any,
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
            .addCase(getListTrainingProgram.fulfilled, (state, { payload }) => {
                state.trainingPrograms = payload.data;
            })
            .addCase(searchTP.fulfilled, (state, { payload }) => {
                state.trainingPrograms = payload.data;
            })
            .addCase(
                getTrainingProgramBySpec.fulfilled,
                (state, { payload }) => {
                    state.trainingPrograms = payload.data;
                }
            )
            .addCase(
                getTrainingProgramDetail.fulfilled,
                (state, { payload }) => {
                    state.trainingProgram = payload.data;
                }
            )
            .addCase(createTrainingProgram.rejected, (state, { payload }) => {
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

            .addCase(createTrainingProgram.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm CTĐT thành công";
            })
            .addCase(deleteTrainingProgram.rejected, (state, { payload }) => {
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
            .addCase(deleteTrainingProgram.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa CTĐT thành công";
            })
            .addCase(
                getSubjectFollowTrainingProgram.fulfilled,
                (state, { payload }) => {
                    state.subjectFollowTrainingProgram = Array.isArray(
                        payload.data
                    )
                        ? payload.data[0]
                        : null;
                }
            )
            .addCase(
                deleteSubjectFollowTrainingProgram.rejected,
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
                deleteSubjectFollowTrainingProgram.fulfilled,
                (state, { payload }) => {
                    state.successMessage = "Xóa thành công";
                }
            )
            .addCase(updateTrainingProgram.rejected, (state, { payload }) => {
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
            .addCase(updateTrainingProgram.fulfilled, (state, { payload }) => {
                state.successMessage = "Update thành công";
            })
            .addCase(deleteAllSubjectForTP.pending, (state, { payload }) => {
                state.successMessage = "Đang xóa";
            })
            .addCase(deleteAllSubjectForTP.rejected, (state, { payload }) => {
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
            .addCase(deleteAllSubjectForTP.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa thành công";
            })
            .addCase(addSubjectForTP.rejected, (state, { payload }) => {
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

            .addCase(addSubjectForTP.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm môn học vào CTĐT thành công";
            })
            .addCase(getTrainingProgramByStu.rejected, (state, { payload }) => {
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
            .addCase(
                getTrainingProgramByStu.fulfilled,
                (state, { payload }) => {
                    state.subjectFollowTrainingProgram = payload.data;
                }
            );
    },
});

export const { messageClear } = trainingProgramReducer.actions;
export default trainingProgramReducer.reducer;
