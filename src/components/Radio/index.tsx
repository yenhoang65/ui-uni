import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export const Radio = forwardRef<
    HTMLInputElement,
    Omit<ComponentPropsWithoutRef<"input">, "type">
>(function RadioBase({ className, ...props }, ref) {
    return (
        <span className={clsx(className, styles.radio)}>
            <input {...props} ref={ref} className={styles.input} type="radio" />
        </span>
    );
});
