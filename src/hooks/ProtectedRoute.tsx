import { useEffect } from "react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
// import { role, userInfo } from "@/pages/constant";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const role = "admin";
export const userInfo = {
    role: "admin",
    status: "active",
    name: "dao thao",
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Redux
    // const role = useSelector((state) => state.auth.role);
    // const userInfo = useSelector((state) => state.auth.userInfo);

    const router = useRouter();

    const isAuthenticated = !!role && !!userInfo;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null; // <Loading />

    return <>{children}</>;
};

export default ProtectedRoute;
