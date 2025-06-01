import { getNav, NavGroup } from "@/navigation";
import styles from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IoMdLogOut } from "react-icons/io";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { pathname } = router;
    const [allNav, setAllNav] = useState<NavGroup[]>([]);

    const { role, userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const navs = getNav([role]);
        setAllNav(navs);
    }, []);

    return (
        <div className={styles.sidebar}>
            <div className={styles.userSection}>
                <div className={styles.avatarWrapper}>
                    <Image
                        src={require("./assets/utehy.webp")}
                        alt="User Avatar"
                        width={70}
                        height={70}
                        className={styles.avatarIcon}
                    />
                </div>
                <span className={styles.username}>{userInfo.userName}</span>
                <span className={styles.position}>
                    {userInfo.role} {userInfo.position && "|"}
                    {userInfo.position}
                </span>
            </div>

            <div className={styles.navList}>
                {allNav.map((group) => (
                    <div key={group.group} className={styles.navGroup}>
                        <div className={styles.groupTitle}>
                            {t(group.group)}
                        </div>
                        <ul>
                            {group.items.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        className={`${styles.navItem} ${
                                            pathname.includes(item.path)
                                                ? styles.navItemActive
                                                : ""
                                        }`}
                                    >
                                        <span
                                            className={`${
                                                pathname.includes(item.path)
                                                    ? styles.navIconActive
                                                    : styles.navIcon
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span
                                            className={`${
                                                pathname.includes(item.path)
                                                    ? styles.titleActive
                                                    : styles.titleName
                                            }`}
                                        >
                                            {t(item.title)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
