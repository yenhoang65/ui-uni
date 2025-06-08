import { createElement, ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "p" | "span";

type Theme = "4xl" | "3xl" | "2xl" | "xl" | "lg";

type TextAlign = "left" | "center" | "right";

type Props<T extends Tag> = {
    tag: T;
    theme: Theme;
    textAlign?: TextAlign;
    color?: string;
    className?: string;
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function TypographyHeading<T extends Tag>({
    tag,
    theme,
    textAlign = "left",
    color = "var(--Neutral-800)",
    className,
    children,
    ...props
}: Props<T>) {
    return createElement(
        tag,
        {
            style: { color },
            ...props,
            className: clsx(styles.heading, className),
            "data-theme": theme,
            "data-textalign": textAlign,
        },
        children
    );
}
