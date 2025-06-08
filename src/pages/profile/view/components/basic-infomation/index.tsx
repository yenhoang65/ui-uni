import { TypographyBody } from "@/components/TypographyBody";
import styles from "./styles.module.css";

interface Props {
    title: string;
    content?: string;
}

const BasicInfomation: React.FC<Props> = ({ title, content }) => {
    return (
        <div>
            <TypographyBody
                tag="span"
                theme="md"
                className={styles.titleBasicInfo}
            >
                {title}:
            </TypographyBody>
            <TypographyBody
                tag="span"
                theme="md"
                color="var(--secondary-blue)"
                className={styles.contentTitleBasicInfo}
            >
                {content}
            </TypographyBody>
        </div>
    );
};

export default BasicInfomation;
