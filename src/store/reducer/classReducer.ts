"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ClassOffical = {
    classId: number;
    lecturerId: number;
    lecturerName: string | null;
    schoolYear: number;
    trainingProgramId: number;
    trainingProgramName: string | null;
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
};

type classSubjectFollowLecturer = {
    classStudentId: string;
    className: string;
    subjectName: string;
};

export interface TeachingSchedule {
    scheduleId: number;
    lesson: string;
    dateTime: string;
    endDate: string;
    assignment: {
        assignmentId: number;
        lecturer: {
            lecturerId: number;
            lecturerName: string;
        };
        subject: {
            subjectId: number;
            subjectName: string;
            ltCredits: number;
            thCredits: number;
        };
        termClass: {
            termClassId: number;
            termName: string;
        };
    };
    scheduleDetails: {
        classroomId: number;
        lesson: string;
        dateTime: string;
        endDate: string;
        classType: "LT" | "TH"; // Hoặc string nếu có thêm loại
    }[];
    materials: {
        lt: string;
        th: string;
    }[];
}

//class offical
export const getListClassOffical = createAsyncThunk(
    "class/getListClassOffical",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/classes`, {
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

//delete class offical
export const deleteClassOffical = createAsyncThunk(
    "class/deleteClassOffical",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/classes/${id}`, {
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

export const getClassOfficalDetail = createAsyncThunk(
    "class/getClassOfficalDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/classes/${id}`, {
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

export const updateClassOfficial = createAsyncThunk(
    "class/updateClassOfficial",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(`/classes/${id}`, dto, {
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

export const createClassOfficial = createAsyncThunk(
    "class/createClassOfficial",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/classes`, dto, {
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

//term class
export const getListTermClass = createAsyncThunk(
    "class/getListTermClass",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/term-classes`, {
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

export const getClassTermDetail = createAsyncThunk(
    "classTerm/getClassTermDetail",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/term-classes/${id}`, {
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

export const updateTermClass = createAsyncThunk(
    "class/updateTermClass",
    async (
        { id, dto }: { id: any; dto: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.put(`/term-classes/${id}`, dto, {
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

export const createTermClass = createAsyncThunk(
    "class/createTermClass",
    async ({ dto }: { dto: any }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/term-classes`, dto, {
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

export const deleteTermClass = createAsyncThunk(
    "class/deleteTermClass",
    async (id: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/term-classes/${id}`);

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

// get list lớp học success  - lecturer
export const getClassByStatusLecturer = createAsyncThunk(
    "class/getClassByStatusLecturer",
    async (
        { statuses, currentPage, perPage, searchValue }: any,
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/teaching-schedule/by-status?currentPage=${currentPage}&perPage=${perPage}&statuses=${statuses}&searchValue=${searchValue}`,
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

//lấy danh sách lớp học phần đủ điều kiện mở lớp theo giảng viên
export const getClassSubjectFollowLecturer = createAsyncThunk(
    "class/getClassSubjectFollowLecturer",
    async (
        { semester, schoolyear }: { semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/class-student/successful?semester=${semester}&schoolyear=${schoolyear}`,
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

//lấy danh sách lớp học phần đủ điều kiện mở lớp theo sinh viên
export const getClassSubjectFollowStudent = createAsyncThunk(
    "class/getClassSubjectFollowStudent",
    async (
        { semester, schoolyear }: { semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/class-subject-student/student/successful?semester=${semester}&schoolYear=${schoolyear}`,
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

//sinh viên xem điểm danh
export const getViewAttendanceForStu = createAsyncThunk(
    "class/getViewAttendanceForStu",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/attendance/class-student/${classStudentId}`,
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

//sinh viên xem tài liệu theo buổi
export const getViewMaterialForStu = createAsyncThunk(
    "class/getViewMaterialForStu",
    async (classStudentId: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            // const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/slides/class-student/full/${classStudentId}`
                // {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // }
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

export const getClassFollowDay = createAsyncThunk(
    "class/getClassFollowDay",
    async (date: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(
                `/attendance-sessions/by-date?scheduledDate=${date}`
            );

            console.log("data: ", data);

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

export const classReducer = createSlice({
    name: "class",
    initialState: {
        successMessage: "",
        errorMessage: "",
        classOfficals: [] as ClassOffical[],
        classOffical: {} as ClassOffical,

        classTerms: [] as ClassTerm[],
        classTerm: {} as ClassTerm,

        classByStatus: [] as TeachingSchedule[],

        classSubjectFollowLecturer: [] as classSubjectFollowLecturer[],
        classSubjectFollowStudent: [] as any,

        classFollowDay: [] as any,
        totalClassByStatus: 0,

        attendance: [] as any,

        materials: {} as any,
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
            .addCase(getListClassOffical.fulfilled, (state, { payload }) => {
                state.classOfficals = payload.data;
            })
            .addCase(getClassFollowDay.fulfilled, (state, { payload }) => {
                state.classFollowDay = payload.data;
            })

            .addCase(
                getViewAttendanceForStu.fulfilled,
                (state, { payload }) => {
                    state.attendance = payload.data;
                }
            )

            .addCase(getViewMaterialForStu.fulfilled, (state, { payload }) => {
                state.materials = payload.data;
            })

            .addCase(deleteClassOffical.rejected, (state, { payload }) => {
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

            .addCase(deleteClassOffical.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa lớp thành công";
            })
            .addCase(getClassOfficalDetail.fulfilled, (state, { payload }) => {
                state.classOffical = payload.data;
            })

            .addCase(updateClassOfficial.rejected, (state, { payload }) => {
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

            .addCase(updateClassOfficial.fulfilled, (state, { payload }) => {
                state.successMessage = "Chỉnh sửa lớp thành công";
            })
            .addCase(createClassOfficial.rejected, (state, { payload }) => {
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

            .addCase(createClassOfficial.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm lớp thành công";
            })

            //term class
            .addCase(getListTermClass.fulfilled, (state, { payload }) => {
                state.classTerms = payload.data;
            })
            .addCase(getClassTermDetail.fulfilled, (state, { payload }) => {
                state.classTerm = payload.data;
            })
            .addCase(updateTermClass.rejected, (state, { payload }) => {
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
            .addCase(updateTermClass.fulfilled, (state, { payload }) => {
                state.successMessage = "Update class học phần thành công";
            })
            .addCase(createTermClass.rejected, (state, { payload }) => {
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
            .addCase(createTermClass.fulfilled, (state, { payload }) => {
                state.successMessage = "Thêm class học phần thành công";
            })
            .addCase(deleteTermClass.rejected, (state, { payload }) => {
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
            .addCase(deleteTermClass.fulfilled, (state, { payload }) => {
                state.successMessage = "Xóa class học phần thành công";
            })
            .addCase(
                getClassByStatusLecturer.fulfilled,
                (state, { payload }) => {
                    state.classByStatus = payload.data.content;
                    state.totalClassByStatus = payload.data.totalElements;
                }
            )
            .addCase(
                getClassSubjectFollowLecturer.fulfilled,
                (state, { payload }) => {
                    state.classSubjectFollowLecturer = payload;
                }
            )
            .addCase(
                getClassSubjectFollowStudent.fulfilled,
                (state, { payload }) => {
                    state.classSubjectFollowStudent = payload;
                }
            );
    },
});

export const { messageClear } = classReducer.actions;
export default classReducer.reducer;
