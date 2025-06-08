"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type scheduleDetail = {
    classroom_id: number;
    lesson: string;
    date_time: Date;
    end_date: string;
    class_type: string;
};

type TeachingAssignment = {
    assignmentId: number;
    lecturerId: number;
    lecturerName: string | null;
    subjectId: number;
    subjectName: string;
    subject: {
        subjectId: number;
        subjectName: string;
        ltCredits: number;
        thCredits: number;
        subjectDescription: string;
        subjectCoefficient: number;
    };
    termClassId: number;
    className: string | null;
    semester: string;
    schoolYears: string;
    progress: string;

    status: string;
    scheduleDetails: scheduleDetail[];
    materials: { lt: string; th: string }[];
};

type ClassTerm = {
    termclassId: number;
    classname: string;
    progress: string;
    semester: string;
    schoolyears: string;
};

type GetParam = {
    currentPage: number;
    parPage: number;
    searchValue: string;
    token?: any;
    statuses?: string;
};

export const getListTeachingAssignment = createAsyncThunk(
    "teachingAssignment/getListTeachingAssignment",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/teaching-assignment`, {
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

// export const getListTeachingAssignmentByLecturerId = createAsyncThunk(
//     "teachingAssignment/getListTeachingAssignmentByLecturerId",
//     async (
//         { token, currentPage, parPage, searchValue }: GetParam,
//         { getState, rejectWithValue, fulfillWithValue }
//     ) => {
//         try {
//             const { data } = await api.get(
//                 `/teaching-assignment/paging?currentPage=${currentPage}&perPage=${parPage}&searchValue=${searchValue}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             return fulfillWithValue(data);
//         } catch (error) {
//             const e = error as Error;
//             return rejectWithValue(e.message || "An unknown error occurred");
//         }
//     }
// );

export const getListTeachingAssignmentByLecturerId = createAsyncThunk(
    "teachingAssignment/getListTeachingAssignmentByLecturerId",
    async (
        {
            currentPage,
            perPage,
            searchValue,
            semester,
            schoolyear,
        }: {
            currentPage: any;
            perPage: any;
            searchValue?: any;
            semester: any;
            schoolyear: any;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(`/teaching-assignment/paging`, {
                params: {
                    currentPage,
                    perPage,
                    searchValue,
                    semester,
                    schoolyear,
                },
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

export const getTeachingAssignmentDetail = createAsyncThunk(
    "teachingAssignment/getTeachingAssignmentDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/teaching-assignment/${id}`, {
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

export const updateTeachingAssignment = createAsyncThunk(
    "teachingAssignment/updateTeachingAssignment",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            // Gửi yêu cầu PUT với FormData
            const { data } = await api.put(`/teaching-assignment/${id}`, dto, {
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

export const createTeachingAssignment = createAsyncThunk(
    "teachingAssignment/createTeachingAssignment",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/teaching-assignment`, dto, {
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

export const deleteTeachingAssignment = createAsyncThunk(
    "teachingAssignment/deleteTeachingAssignment",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/teaching-assignment/${id}`);

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

export const getClassTermUnAssign = createAsyncThunk(
    "teachingAssignment/getClassTermUnAssign",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/teaching-assignment/unassigned-classes`
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

export const regisSchedule = createAsyncThunk(
    "schedule/regisSchedule",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.post(
                `/teaching-schedule/register`,
                dto,
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

export const getTeachingScheduleWithAssignID = createAsyncThunk(
    "regis/getTeachingScheduleWithAssignID",
    async (scheduleId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/teaching-assignment/with-schedules/${scheduleId}`
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

export const getListScheduleRequestFollowStatus = createAsyncThunk(
    "teachingAssignment/getListScheduleRequestFollowStatus",
    async (
        { statuses, currentPage, parPage, searchValue }: GetParam,
        { getState, rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(`/teaching-schedule/by-status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    perPage: parPage,
                    currentPage: currentPage,
                    searchValue: searchValue,
                    statuses: statuses,
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

export const teachingAssignmentReducer = createSlice({
    name: "teachingAssignment",
    initialState: {
        successMessage: "",
        errorMessage: "",
        teachingAssignments: [] as TeachingAssignment[],
        teachingAssignment: {} as TeachingAssignment,

        totalCounts: 0,

        classTermUnAssigns: [] as ClassTerm[],

        teachingScheduleFollowAssignId: {},
        scheduleRequests: [] as any,
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
            .addCase(
                getListTeachingAssignment.fulfilled,
                (state, { payload }) => {
                    state.teachingAssignments = payload.data;
                }
            )
            .addCase(
                getListTeachingAssignmentByLecturerId.rejected,
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
                getListTeachingAssignmentByLecturerId.fulfilled,
                (state, { payload }) => {
                    state.teachingAssignments = payload.data.content;
                    state.totalCounts = payload.data.totalElements;
                }
            )
            .addCase(getClassTermUnAssign.fulfilled, (state, { payload }) => {
                state.classTermUnAssigns = payload.data;
            })
            .addCase(
                getTeachingAssignmentDetail.fulfilled,
                (state, { payload }) => {
                    state.teachingAssignment = payload.data;
                }
            )
            .addCase(
                updateTeachingAssignment.rejected,
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
                updateTeachingAssignment.fulfilled,
                (state, { payload }) => {
                    state.successMessage =
                        "Update teachingAssignment thành công";
                }
            )
            .addCase(
                createTeachingAssignment.rejected,
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
                createTeachingAssignment.fulfilled,
                (state, { payload }) => {
                    state.successMessage = "Thêm teachingAssignment thành công";
                }
            )

            .addCase(
                deleteTeachingAssignment.rejected,
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
                deleteTeachingAssignment.fulfilled,
                (state, { payload }) => {
                    state.successMessage = "Xóa teachingAssignment thành công";
                }
            )

            .addCase(regisSchedule.rejected, (state, { payload }) => {
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

            .addCase(regisSchedule.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm teachingAssignment thành công";
            })
            .addCase(
                getTeachingScheduleWithAssignID.fulfilled,
                (state, { payload }) => {
                    state.teachingScheduleFollowAssignId = payload.data;
                }
            )
            .addCase(
                getListScheduleRequestFollowStatus.fulfilled,
                (state, { payload }) => {
                    state.scheduleRequests = payload.data.content;
                }
            );
    },
});

export const { messageClear } = teachingAssignmentReducer.actions;
export default teachingAssignmentReducer.reducer;
