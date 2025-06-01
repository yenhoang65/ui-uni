import styles from "./styles.module.css";

interface BorderBoxProps {
    title: string;
    children: React.ReactNode;
}

const BorderBox: React.FC<BorderBoxProps> = ({ title, children }) => {
    return (
        <div className={styles.layoutWrapper}>
            <fieldset className={styles.boxContainer}>
                <legend className={styles.boxTitle}>{title}</legend>
                {children}
            </fieldset>
        </div>
    );
};

export default BorderBox;
