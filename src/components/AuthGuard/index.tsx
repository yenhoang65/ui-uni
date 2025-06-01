"use client";

import { AppDispatch, RootState } from "@/store";
import { getUserInfo } from "@/store/reducer/authReducer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    allowedRoles?: string[];
    children: React.ReactNode;
};

export default function AuthGuard({ allowedRoles, children }: Props) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [authorized, setAuthorized] = useState(false);
    const { role, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        async function checkAuth() {
            if (token && role) {
                if (router.pathname === "/login") {
                    window.location.href = "/dashboard";
                    return;
                }

                if (allowedRoles && !allowedRoles.includes(role)) {
                    window.location.href = "/not-allowed";
                    return;
                }

                setAuthorized(true);
                return;
            }

            if (!token || !role) {
                if (router.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        checkAuth();
    }, [router, allowedRoles, role, token]);

    useEffect(() => {
        if (token) {
            dispatch(getUserInfo(token));
        }
    }, [token]);

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
