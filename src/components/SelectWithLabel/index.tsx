import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

type SelectWithLabelProps = {
    label?: string;
    name?: string;
    value?: string | number | readonly string[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    options: { value: string | number; label: string }[];
    multiple?: boolean;
};

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
    label,
    name,
    value,
    onChange,
    required,
    className,
    disabled,
    options,
    multiple,
}) => {
    return (
        <div className={clsx(styles.inputGroup, className)}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}> *</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={clsx(styles.select, className)}
                disabled={disabled}
                multiple={multiple}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectWithLabel;
