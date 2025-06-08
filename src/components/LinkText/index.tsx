import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import Link from "next/link";

import { TypographyBody } from "../TypographyBody";
import { TypographyCaption } from "../TypographyCaption";
import styles from "./styles.module.css";

type Size = "md" | "sm" | "xs" | "2xs";

type Props = ComponentPropsWithoutRef<typeof Link> & {
    size?: Size;
    disabled?: boolean;
};

export const LinkText = forwardRef<HTMLAnchorElement, Props>(
    function LinkTextBase(
        { className, size = "md", disabled = false, ...props },
        ref
    ) {
        const sharedProps = {
            ...props,
            ref,
            "aria-disabled": disabled,
            className: clsx(
                styles.link,
                disabled && styles.disabled,
                className
            ),
        };

        if (size === "md" || size === "sm") {
            return (
                <TypographyBody tag="span" theme={size}>
                    <Link {...sharedProps} />
                </TypographyBody>
            );
        }

        return (
            <TypographyCaption tag="span" theme={size}>
                <Link {...sharedProps} />
            </TypographyCaption>
        );
    }
);
