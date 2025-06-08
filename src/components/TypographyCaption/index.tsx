import { createElement, ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Tag = "p" | "span";

type Theme = "xs" | "xs-bold" | "2xs" | "2xs-bold";

type TextAlign = "left" | "center" | "right";

type Props<T extends Tag> = {
    tag: T;
    theme?: Theme;
    textAlign?: TextAlign;
    color?: string;
    className?: string;
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function TypographyCaption<T extends Tag>({
    tag,
    theme = "xs",
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
            className: clsx(styles.captionText, className),
            "data-theme": theme,
            "data-textalign": textAlign,
        },
        children
    );
}
