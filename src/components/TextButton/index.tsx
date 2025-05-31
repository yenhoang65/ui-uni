import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Props = ComponentPropsWithoutRef<"button">;

export const TextButton = forwardRef<HTMLButtonElement, Props>(
    function ButtonBase({ className, ...props }, ref) {
        return (
            <button
                {...props}
                ref={ref}
                className={clsx(styles.textButton, className)}
            />
        );
    }
);
