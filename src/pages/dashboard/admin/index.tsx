import AuthGuard from "@/components/AuthGuard";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const DashboardAdmin = () => {
    return (
        <AuthGuard allowedRoles={["admin", "lecturer"]}>
            <div>admin</div>
        </AuthGuard>
    );
};

export default DashboardAdmin;
