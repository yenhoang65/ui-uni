import { TypographyHeading } from "@/components/TypographyHeading";
import styles from "./styles.module.css";
import clsx from "clsx";

type Props = {
    title: string;
    className?: string;
};
const Title = ({ title, className }: Props) => {
    return (
        <TypographyHeading
            tag="h3"
            theme="lg"
            className={clsx(styles.titleRight, className)}
        >
            {title}
        </TypographyHeading>
    );
};

export default Title;
