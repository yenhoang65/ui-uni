import { ComponentPropsWithRef, createElement, ReactNode } from "react";
import styles from "./styles.module.css";
import { clsx } from "clsx";

type Tag = "p" | "span";
type Theme = "lg" | "md" | "md-bold" | "sm" | "sm-bold";
type TextAlign = "left" | "right" | "center";
type Props<T extends Tag> = {
    tag: T;
    theme?: Theme;
    textAlign?: TextAlign;
    color?: string;
    className?: string;
    children?: ReactNode;
} & ComponentPropsWithRef<T>;

export function TypographyBody<T extends Tag>({
    tag,
    theme = "md",
    textAlign = "left",
    color = "var(--primary-black)",
    className,
    children,
    ...props
}: Props<T>) {
    return createElement(
        tag,
        {
            style: {
                color,
            },
            ...props,
            className: clsx(styles.bodyText, className),
            "data-theme": theme,
            "data-textalign": textAlign,
        },
        children
    );
}
