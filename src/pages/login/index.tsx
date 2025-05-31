import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import logo from "./assets/utehy_logo.png";
import { useRouter } from "next/router";
import { login, messageClear } from "@/store/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/store";

type LoginData = {
    userId: string;
    password: string;
};

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { token, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.auth
    );

    const [state, setState] = useState({
        userId: "",
        password: "",
    });

    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const isFormValid =
        state.userId.trim() !== "" && state.password.trim() !== "";

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginData: LoginData = { ...state };

        dispatch(login(loginData));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            router.push("/");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <Image
                    src={logo}
                    width={250}
                    height={250}
                    alt="Picture of the author"
                    className={styles.logo}
                />
                <h1>
                    TRƯỜNG ĐẠI HỌC <br /> SƯ PHẠM KỸ THUẬT HƯNG YÊN
                </h1>
            </div>

            <div className={styles.right}>
                <span className={styles.title}>ĐĂNG NHẬP HỆ THỐNG</span>

                <form className={styles.form} onSubmit={submit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="userId"
                            value={state.userId}
                            name="userId"
                            onChange={inputHandle}
                            placeholder="Tên đăng nhập"
                            className={styles.input}
                            autoComplete="off"
                        />
                        <label htmlFor="username" className={styles.label}>
                            Tên đăng nhập
                        </label>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            id="password"
                            value={state.password}
                            name="password"
                            onChange={inputHandle}
                            placeholder="Mật khẩu"
                            className={styles.input}
                            autoComplete="off"
                        />
                        <label htmlFor="password" className={styles.label}>
                            Mật khẩu
                        </label>
                    </div>

                    <div className={styles.forgotPassword}>Quên mật khẩu</div>

                    <button
                        className={`${styles.loginBtn} ${
                            !isFormValid ? styles.disabledBtn : ""
                        }`}
                        disabled={!isFormValid}
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
