import styles from "./styles.module.css";
import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";
import { Checkbox } from "../Checkbox";
import { TypographyBody } from "../TypographyBody";
import { TypographyCaption } from "../TypographyCaption";

type Theme = "Medium" | "Medium_Subtext" | "Small";

type Props = {
    theme: Theme;
    mainLabel?: string;
    subLabel?: string;
    labelProps?: ComponentPropsWithRef<"label">;
    inputProps?: ComponentPropsWithRef<"input">;
};

export const LabelCheckBox = ({
    theme,
    mainLabel,
    subLabel,
    labelProps,
    inputProps,
}: Props) => {
    return (
        <label
            {...labelProps}
            className={clsx(styles.label, styles[theme], labelProps?.className)}
        >
            <Checkbox
                {...inputProps}
                className={clsx(styles.checkbox, inputProps?.className)}
            />

            <div className={styles.children}>
                {mainLabel && (
                    <TypographyBody
                        tag="p"
                        theme={
                            theme === "Medium"
                                ? "md"
                                : theme === "Medium_Subtext"
                                ? "md-bold"
                                : "sm-bold"
                        }
                        className={styles.mainLabel}
                    >
                        {mainLabel}
                    </TypographyBody>
                )}

                {subLabel && (
                    <TypographyCaption
                        tag="p"
                        theme="2xs"
                        className={styles.subLabel}
                    >
                        {subLabel}
                    </TypographyCaption>
                )}
            </div>
        </label>
    );
};
