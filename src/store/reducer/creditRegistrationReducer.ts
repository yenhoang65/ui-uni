"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Subject = {
    subject: {
        subjectId: number;
        subjectName: string;
        ltCredits: number;
        thCredits: number;
        subjectDescription: string;
        subjectCoefficient: number;
    };
    subjectType: string;
    schoolYear: string;
};

type ClassFollowSubject = {
    classStudentId: number;
    teachingScheduleRequest: {
        assignmentId: number;
        status: string;
        materials: [
            {
                lt: string;
                th: string;
            }
        ];
        scheduleDetails: [
            {
                classroom_id: number;
                lesson: string;
                date_time: string;
                end_date: string;
                class_type: "LT";
            },
            {
                classroom_id: number;
                lesson: string;
                date_time: string;
                end_date: string;
                class_type: "LT";
            }
        ];
    };
    teachingAssignment: {
        lecturerId: number;
        subjectId: number;
        subjectName: string;
        termClassId: number;
        assignmentType: null;
    };
    termClass: {
        classname: string;
        progress: string;
        semester: string;
        schoolyears: string;
    };
    subject: {
        subjectId: number;
        subjectName: string;
        ltCredits: number;
        thCredits: number;
        subjectDescription: string;
        subjectCoefficient: number;
    };
};

type GetParam = {
    currentPage: number;
    parPage: number;
    searchValue: string;
};

export type ScheduleDetail = {
    classroom_id: number;
    lesson: string;
    date_time: string;
    end_date: string;
    class_type: "LT" | "TH";
};

export type Material = {
    lt: string;
    th: string;
};

export type RegisteredCreditClass = {
    classSubjectStudentId: number;
    classSubjectStudentStatus: "success" | "pending";
    classStudentId: number;
    classStudentStatus: "success" | "pending" | "cancel";
    classStudentCreatedAt: string;
    classStudentEndDate: string;
    classStudentMaterials: any;
    scheduleId: number;
    endDate: string;
    dateTime: string;
    scheduleStatus: "success" | "pending";
    scheduleDetails: ScheduleDetail[];
    materials: Material[];
    assignmentId: number;
    assignmentType: string | null;
    subjectId: number;
    subjectName: string;
    subjectDescription: string;
    ltCredits: number;
    thCredits: number;
    subjectCoefficient: number;
    termclassId: number;
    classname: string;
    schoolyears: string;
    semester: string;
    progress: string;
    classroomId: number;
    classroomName: string;
    numberOfSeats: number;
    device: string;
    classroomStatus: string;
};

export type RegisteredCreditClasses = RegisteredCreditClass[];

export const getSubjectsFollowUser = createAsyncThunk(
    "regis/getSubjectsFollowUser",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(`/training-programs/subjects`, {
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

// export const getClassFollowSubject = createAsyncThunk(
//     "regis/getClassFollowSubject",
//     async (subjectId: any, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await api.get(
//                 `/class-student/opened-classes/${subjectId}`
//             );

//             return fulfillWithValue(data);
//         } catch (error) {
//             // return rejectWithValue(error.response.data);
//         }
//     }
// );

export const getClassFollowSubject = createAsyncThunk(
    "regis/getClassFollowSubject",
    // Thêm params vào hàm, ví dụ: { subjectId, semester, schoolyear }
    async (
        {
            subjectId,
            semester,
            schoolyear,
        }: { subjectId: any; semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const { data } = await api.get(
                `/class-student/opened-classes/${subjectId}`,
                {
                    params: {
                        semester,
                        schoolyear,
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

//get all class
export const getAllClass = createAsyncThunk(
    "regis/getAllClass",
    async (
        { semester, schoolyear }: { semester: any; schoolyear: any },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/class-student/opened-classes?semester=${semester}&schoolYear=${schoolyear}`,
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

export const registerTC = createAsyncThunk(
    "regis/registerTC",
    async (dto: any, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.post(
                `/class-registration/register`,
                dto,
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

//get lớp đã đăng ký
export const getRegisteredCreditClasses = createAsyncThunk(
    "regis/getRegisteredCreditClasses",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(`/class-registration/student`, {
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

//hủy đăng ký lớp TC
export const cancelRegisteredCreditClasses = createAsyncThunk(
    "regis/cancelRegisteredCreditClasses",
    async (
        classSubjectStudentId: any,
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.post(
                "/class-registration/unregister",
                { classSubjectStudentId },
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

//TKB Lecturer
export const lecturerTimeline = createAsyncThunk(
    "timeline/lecturerTimeline",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = window.localStorage.getItem("accessToken");
            const { data } = await api.get(
                `/teaching-schedule/status-success`,
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

//TKB Student

export const creditRegistrationReducer = createSlice({
    name: "creditRegistration",
    initialState: {
        successMessage: "",
        errorMessage: "",
        subjects: [] as Subject[],
        classOpenFollowSubject: [],
        lecturerTimelines: [],
        creditClasses: [] as RegisteredCreditClasses,

        allClassRegis: [],
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = "";
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubjectsFollowUser.fulfilled, (state, { payload }) => {
                state.subjects = payload.data;
            })
            .addCase(getClassFollowSubject.fulfilled, (state, { payload }) => {
                state.classOpenFollowSubject = payload.data;
            })
            .addCase(getAllClass.fulfilled, (state, { payload }) => {
                state.allClassRegis = payload.data;
            })
            .addCase(registerTC.rejected, (state, { payload }) => {
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

            .addCase(registerTC.fulfilled, (state, { payload }) => {
                state.successMessage = "Đăng ký tín chỉ thành công";
            })
            .addCase(lecturerTimeline.fulfilled, (state, { payload }) => {
                state.lecturerTimelines = payload.data;
            })
            .addCase(
                getRegisteredCreditClasses.fulfilled,
                (state, { payload }) => {
                    state.creditClasses = payload.data;
                }
            )
            .addCase(
                cancelRegisteredCreditClasses.rejected,
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
                cancelRegisteredCreditClasses.fulfilled,
                (state, { payload }) => {
                    state.successMessage = "Hủy lớp tín chỉ thành công";
                }
            );
    },
});

export const { messageClear } = creditRegistrationReducer.actions;
export default creditRegistrationReducer.reducer;
