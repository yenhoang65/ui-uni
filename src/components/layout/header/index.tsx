import { TypographyHeading } from "@/components/TypographyHeading";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";

const Header: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");
    const [showMenu, setShowMenu] = useState(false);
    const avatarWrapperRef = useRef<HTMLDivElement>(null);

    const handleChangeLanguage = () => {
        const nextLang = currentLanguage === "vi" ? "en" : "vi";
        setCurrentLanguage(nextLang);
        i18n.changeLanguage(nextLang);
    };

    const handleLogout = () => {
        window.localStorage.removeItem("accessToken");
        window.location.href = "/login";
        setShowMenu(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                avatarWrapperRef.current &&
                !avatarWrapperRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        }
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.headerInner}>
                <div className={styles.searchInputWrapper}>
                    <TypographyHeading
                        tag="h1"
                        theme="lg"
                        color="var(--primary-white)"
                    >
                        {t("common.utehy")}
                    </TypographyHeading>
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userContent}>
                        <button
                            onClick={handleChangeLanguage}
                            className={styles.buttonChangeLang}
                        >
                            <Image
                                src={
                                    currentLanguage === "vi"
                                        ? require("./assets/vietnam.webp")
                                        : require("./assets/usa.png")
                                }
                                alt={
                                    currentLanguage === "vi"
                                        ? "Cờ Việt Nam"
                                        : "Cờ Hoa Kỳ"
                                }
                                width={30}
                                height={20}
                                objectFit="contain"
                            />
                        </button>
                        <span>
                            <FaBell
                                size={20}
                                color="white"
                                className={styles.iconLabel}
                            />
                        </span>
                        <div
                            className={styles.avatarWrapper}
                            ref={avatarWrapperRef}
                            style={{
                                position: "relative",
                                display: "inline-block",
                            }}
                        >
                            <Image
                                src={require("./assets/user-image.webp")}
                                width={35}
                                height={35}
                                alt="Ảnh tác giả"
                                className={styles.userImage}
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowMenu((prev) => !prev)}
                            />
                            {showMenu && (
                                <div className={styles.userMenu} tabIndex={-1}>
                                    <button
                                        className={styles.menuItem}
                                        onClick={handleLogout}
                                    >
                                        {t("nav.logout")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
