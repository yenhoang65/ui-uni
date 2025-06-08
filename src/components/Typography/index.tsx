import { createElement, ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Tag = "p" | "span";

type Size =
    | "Caption-01"
    | "Caption-02"
    | "Caption-03"
    | "Caption-04"
    | "Caption-05"
    | "Body-02"
    | "Body-03";

type Theme = "Bold" | "Regular";

type TextAlign = "left" | "center" | "right";

type Props<T extends Tag> = {
    tag: T;
    size?: Size;
    theme?: Theme;
    textAlign?: TextAlign;
    className?: string;
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function Typography<T extends Tag>({
    tag,
    size = "Caption-01",
    theme = "Regular",
    textAlign = "left",
    className,
    children,
    ...props
}: Props<T>) {
    return createElement(
        tag,
        {
            className: clsx(
                styles[size],
                styles[theme],
                styles[textAlign],
                className
            ),
            ...props,
        },
        children
    );
}
