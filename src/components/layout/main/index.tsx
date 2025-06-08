import { ReactNode } from "react";
import styles from "./styles.module.css";
import Header from "../header";
import Sidebar from "../sidebar";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <Sidebar />
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default MainLayout;
