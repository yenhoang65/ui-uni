import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Props = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
    className?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, Props>(
    function CheckboxBase({ className, ...props }, ref) {
        return (
            <span className={clsx(styles.checkbox, className)}>
                <input
                    {...props}
                    ref={ref}
                    type="checkbox"
                    className={styles.input}
                />
            </span>
        );
    }
);
