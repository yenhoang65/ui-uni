import type { ComponentPropsWithRef, ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { Radio } from "../Radio";

type Props = {
    children?: ReactNode;
    size?: "small" | "large";
    labelProps?: ComponentPropsWithRef<"label">;
    inputProps?: ComponentPropsWithRef<"input">;
};

export const RadioWithLabel = ({
    children,
    size = "small",
    labelProps,
    inputProps,
}: Props) => {
    return (
        <label
            {...labelProps}
            className={clsx(styles.label, styles[size], labelProps?.className)}
        >
            <Radio {...inputProps} />
            <span className={styles.children}>{children}</span>
        </label>
    );
};
