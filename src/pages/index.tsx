import { AppDispatch, RootState } from "@/store";
import { getUserInfo } from "@/store/reducer/authReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassScheduleToday from "./list-class-follow-day";
import TimeLine from "./student-timetable";
import LecturerTimeline from "./lecturer-timetable";

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
            {userInfo.role === "admin" && <ClassScheduleToday />}
            {userInfo.role === "student" && <TimeLine />}
            {userInfo.role === "lecturer" && <LecturerTimeline />}
        </>
    );
}
