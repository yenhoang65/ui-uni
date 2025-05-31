import { createElement, ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "p";

type Size =
    | "Heading-01"
    | "Heading-02"
    | "Heading-03"
    | "Heading-06"
    | "Body-01"
    | "Body-02"
    | "Body-03";

type Theme = "Bold" | "Regular";

type TextAlign = "left" | "center" | "right";

type Props<T extends Tag> = {
    tag: T;
    size: Size;
    theme?: Theme;
    textAlign?: TextAlign;
    className?: string;
    children?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function Heading<T extends Tag>({
    tag,
    size,
    theme = "Bold",
    textAlign = "left",
    className,
    children,
    ...props
}: Props<T>) {
    return createElement(
        tag,
        {
            ...props,
            className: clsx(styles.heading, className),
            "data-size": size,
            "data-theme": theme,
            "data-textalign": textAlign,
        },
        children
    );
}
