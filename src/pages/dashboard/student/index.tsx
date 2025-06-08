import React from "react";
import styles from "./styles.module.css";
import AuthGuard from "@/components/AuthGuard";
import BorderBox from "@/components/BorderBox";

const DashboardStudent = () => {
    return (
        <AuthGuard allowedRoles={["student"]}>
            <div className={styles.container}>Student</div>
        </AuthGuard>
    );
};

export default DashboardStudent;
