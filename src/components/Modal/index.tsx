import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { IoClose } from "react-icons/io5";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    <button className={styles.closeButton} onClick={onClose}>
                        <IoClose size={20} />
                    </button>
                </div>
                <div className={styles.modalContent}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
