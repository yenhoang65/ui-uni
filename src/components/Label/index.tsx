import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type LabelColor =
    | "red50"
    | "red400"
    | "primary50"
    | "primary200"
    | "primary400"
    | "yellow50";

type Props = ComponentPropsWithoutRef<"div"> & {
    color: LabelColor;
    content: string;
};

export const Label = forwardRef<HTMLDivElement, Props>(function LabelBase(
    { className, content, color, ...props },
    ref
) {
    return (
        <div
            role="presentation"
            {...props}
            ref={ref}
            className={clsx(styles.label, className)}
            data-color={color}
        >
            <span>{content}</span>
        </div>
    );
});
