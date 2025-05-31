import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Size = "middle" | "small" | "large" | "x-large";
type Theme = "primary" | "normal" | "login" | "alert";

type Props = ComponentPropsWithoutRef<"button"> & {
    size?: Size;
    theme?: Theme;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function ButtonBase(
    { className, size = "middle", theme = "normal", ...props },
    ref
) {
    return (
        <button
            {...props}
            ref={ref}
            className={clsx(
                styles.button,
                styles[size],
                styles[theme],
                className
            )}
        />
    );
});
