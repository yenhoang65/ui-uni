import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";
import { AppDispatch, RootState } from "@/store";
import { getUserInfo } from "@/store/reducer/authReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardAdmin from "./dashboard/admin";
import DashboardStudent from "./dashboard/student";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(getUserInfo(token));
        }
    }, [token]);

    return (
        <>
            {userInfo.role === "admin" && <DashboardAdmin />}
            {userInfo.role === "student" && <DashboardStudent />}
        </>
    );
}
