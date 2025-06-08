import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

type InputWithLabelProps = {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    pattern?: string;
    title?: string;
};

const InputWithLabel: React.FC<InputWithLabelProps> = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    required,
    placeholder,
    className,
    readOnly,
    disabled,
    pattern,
    title,
}) => {
    return (
        <div className={clsx(styles.inputGroup, className)}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}> *</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={styles.input}
                readOnly={readOnly}
                disabled={disabled}
                pattern={pattern}
                title={title}
            />
        </div>
    );
};

export default InputWithLabel;
