"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    role?: string | string[];
    user_id?: string;
}

//grade type
export const getPoint = createAsyncThunk(
    "point/getPoint",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/grade-types`);

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

export const getPointDetail = createAsyncThunk(
    "point/getPointDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/grade-types/${id}`);

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

export const createPoint = createAsyncThunk(
    "point/createPoint",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/grade-types`, dto);

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

export const updatePoint = createAsyncThunk(
    "point/updatePoint",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(`/grade-types/${id}`, dto);

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

export const deletePoint = createAsyncThunk(
    "point/deletePoint",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/grade-types/${id}`);

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

//danh sách bài tập theo lớp - lecturer - grade event
export const getExerciseByClass = createAsyncThunk(
    "exercise/getExerciseByClass",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/grade-event/by-class/${classStudentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

//tạo bài tập theo
export const createExercice = createAsyncThunk(
    "exercise/createExercice",
    async (
        { request }: { request: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.post(`/grade-event/midterm`, request);

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

export const updateExercice = createAsyncThunk(
    "exercise/updateExercice",
    async (
        { gradeEventId, request }: { gradeEventId: any; request: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(
                `/grade-event/${gradeEventId}`,
                request
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

//xem chi tiet bai tap
export const getExerciseDetail = createAsyncThunk(
    "exercise/getExerciseDetail",
    async (gradeEventId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/grade-event/${gradeEventId}`);

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

//lấy danh sách bài tập theo sinh viên
// export const getExerciseByStudent = createAsyncThunk(
//     "exercise/getExerciseByStudent",
//     async (_, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const token = window.localStorage.getItem("accessToken");
//             const { data } = await api.get(`/student-grade/assignments`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             return fulfillWithValue(data);
//         } catch (error: any) {
//             if (error.response && error.response.data) {
//                 return rejectWithValue(error.response.data);
//             }
//             return rejectWithValue({
//                 message: "Lỗi không xác định từ máy chủ.",
//             });
//         }
//     }
// );

//lấy danh sách bài tập theo lớp của sinh viên
export const getExerciseByClassStu = createAsyncThunk(
    "exercise/getExerciseByClassStu",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/student-grade/assignments/by-class-student/${classStudentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

//nộp bài tập
export const submitExercise = createAsyncThunk(
    "exercise/submitExercise",
    async (
        { request }: { request: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.post("/student-grade/submit", request, {
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

//lấy danh sách các bài nộp
export const getViewSubmissions = createAsyncThunk(
    "exercise/getViewSubmissions",
    async (
        { classStudentId, gradeEventId }: any,
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/student-grade/submission-status?classStudentId=${classStudentId}&gradeEventId=${gradeEventId}`
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

//chấm điểm
export const gradeSubmission = createAsyncThunk(
    "exercise/gradeSubmission",
    async (
        {
            studentGradeId,
            score,
            feedback,
        }: { studentGradeId: number; score: number; feedback: string },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.post(
                `/student-grade/grade/${studentGradeId}`,
                { score, feedback }
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

//chấm 1 list điểm offline
export const gradeListSubmission = createAsyncThunk(
    "exercise/gradeListSubmission",
    async (
        grades: {
            classSubjectStudentId: any;
            gradeEventId: any;
            score: number;
            feedback: string;
        }[],
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.post(
                `/student-grade/grade/offline`,
                grades
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

//kết quả học tập
export const getLearningResult = createAsyncThunk(
    "exercise/getLearningResult",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            if (!token) throw new Error("No access token found");
            const decodedToken: CustomJwtPayload = jwtDecode(token);

            const { data } = await api.get(
                `/transcript/student/${decodedToken.user_id}`
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

export const pointReducer = createSlice({
    name: "point",
    initialState: {
        successMessage: "",
        errorMessage: "",
        listPoint: [] as any,
        point: {} as any,
        exercises: [] as any,
        exercise: {} as any,

        exerciseByStudent: [] as any,

        viewSubmissions: [] as any,

        learningResult: {} as any,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPoint.fulfilled, (state, { payload }) => {
                state.listPoint = payload.data;
            })
            .addCase(getPointDetail.fulfilled, (state, { payload }) => {
                state.point = payload.data;
            })
            .addCase(createPoint.rejected, (state, { payload }) => {
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
            .addCase(createPoint.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm đầu điểm thành công";
            })

            .addCase(updatePoint.rejected, (state, { payload }) => {
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

            .addCase(updatePoint.fulfilled, (state, { payload }) => {
                state.successMessage = "Sửa đầu điểm thành công";
            })

            .addCase(deletePoint.rejected, (state, { payload }) => {
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

            .addCase(deletePoint.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa đầu điểm thành công";
            })

            .addCase(createExercice.rejected, (state, { payload }) => {
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

            .addCase(createExercice.fulfilled, (state, { payload }) => {
                state.successMessage = "Đã thêm bài tập thành công";
            })

            .addCase(updateExercice.rejected, (state, { payload }) => {
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

            .addCase(updateExercice.fulfilled, (state, { payload }) => {
                state.successMessage = "Sửa bài tập thành công";
            })

            .addCase(submitExercise.rejected, (state, { payload }) => {
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
            .addCase(submitExercise.fulfilled, (state, { payload }) => {
                state.successMessage = "Nộp bài tập thành công";
            })

            .addCase(getExerciseByClass.fulfilled, (state, { payload }) => {
                state.exercises = payload;
            })
            .addCase(getExerciseByClassStu.rejected, (state, { payload }) => {
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
            .addCase(getExerciseByClassStu.fulfilled, (state, { payload }) => {
                state.exerciseByStudent = payload.data;
            })
            .addCase(getExerciseDetail.fulfilled, (state, { payload }) => {
                state.exercise = payload.data;
            })

            .addCase(getViewSubmissions.fulfilled, (state, { payload }) => {
                state.viewSubmissions = payload.data;
            })
            .addCase(gradeSubmission.rejected, (state, { payload }) => {
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
            .addCase(gradeSubmission.fulfilled, (state, { payload }) => {
                state.successMessage = "Chấm điểm thành công";
            })

            .addCase(getLearningResult.fulfilled, (state, { payload }) => {
                state.learningResult = payload;
            })
            .addCase(gradeListSubmission.rejected, (state, { payload }) => {
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

            .addCase(gradeListSubmission.fulfilled, (state, { payload }) => {
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
            });
    },
});

export const { messageClear } = pointReducer.actions;
export default pointReducer.reducer;
