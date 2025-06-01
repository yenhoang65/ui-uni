"use client";

import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    role?: string | string[];
}

type LoginData = {
    userId: string;
    password: string;
};

type UserInfo = {
    academicDegree: string | null;
    address: string | null;
    admissionDate: string | null;
    bank: string | null;
    bankAccountNumber: string | null;
    bankAccountOwner: string | null;
    dateOfBirth: string | null;
    educationLevel: string | null;
    email: string | null;
    ethnicGroup: string | null;
    facultyName: string | null;
    idNumber: string | null;
    majorName: string | null;
    permanentResident: string | null;
    phoneNumber: string | null;
    placeOfBirth: string | null;
    position: string | null;
    religion: string | null;
    role: string | null;
    status: string | null;
    userId: string;
    userName: string;
};

export const login = createAsyncThunk(
    "auth/login",
    async (info: LoginData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post("/auth/login", info, {
                withCredentials: true,
            });

            if (typeof window !== "undefined") {
                window.localStorage.setItem("accessToken", data.token);
            }

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

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (token: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            if (!token) {
                throw new Error("Token is required");
            }

            const { data } = await api.get("user/profile", {
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

export const updateUserInfo = createAsyncThunk(
    "auth/updateUserInfo",
    async (
        { dto }: { dto: any },
        { getState, rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const token = (getState() as any).auth.token;

            const { data } = await api.post("user/update", dto, {
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

const returnRole = (token: string | null | undefined): string => {
    if (token) {
        try {
            const decodedToken: CustomJwtPayload = jwtDecode(token);

            if (decodedToken?.exp) {
                const expiryDate = new Date(decodedToken.exp * 1000);
                const now = new Date();

                if (expiryDate < now) {
                    window.localStorage.removeItem("accessToken");
                    return "";
                }
            }

            const role = decodedToken?.role || [];
            return Array.isArray(role) ? role[0] : role || "";
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            return "";
        }
    } else {
        return "";
    }
};

export const authReducer = createSlice({
    name: "auth",
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        userInfo: {} as UserInfo,
        role:
            typeof window !== "undefined"
                ? returnRole(window.localStorage.getItem("accessToken"))
                : "",
        token:
            typeof window !== "undefined"
                ? window.localStorage.getItem("accessToken")
                : null,
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
            .addCase(login.rejected, (state, { payload }) => {
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
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = "Đăng nhập thành công";
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(getUserInfo.fulfilled, (state, { payload }) => {
                state.userInfo = payload.data;
            })
            .addCase(updateUserInfo.rejected, (state, { payload }) => {
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
            .addCase(updateUserInfo.fulfilled, (state, { payload }) => {
                state.successMessage = "Update profile thành công";
            });
    },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
