import type { AppProps } from "next/app";
import "../styles/reset.css";
import "../styles/global.css";
import "../styles/base.css";
import "../config-translation";
import MainLayout from "@/components/layout/main";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import store, { RootState } from "@/store";
import AuthGuard from "@/components/AuthGuard";

const publicRoutes = ["/login", "/not-found"];

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const isPublicRoute = useMemo(() => {
        return publicRoutes.includes(router.pathname);
    }, [router.pathname]);

    const accessToken =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

    useEffect(() => {
        if (!accessToken && router.pathname !== "/login") {
            router.push("/login");
        }

        if (accessToken && router.pathname === "/login") {
            router.push("/");
        }
    }, [accessToken, router]);

    return (
        <Provider store={store}>
            {isPublicRoute ? (
                <Component {...pageProps} />
            ) : (
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            )}
            <Toaster
                toastOptions={{
                    position: "top-center",
                    style: {
                        background: "#283046",
                        color: "white",
                    },
                }}
            />
        </Provider>
    );
}

export default App;
