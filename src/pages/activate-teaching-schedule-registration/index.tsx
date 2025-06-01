import React, { useState, useEffect } from "react";
import BorderBox from "@/components/BorderBox";
import InputWithLabel from "@/components/InputWithLabel";
import { Button } from "@/components/Button";
import styles from "./styles.module.css";
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import toast from "react-hot-toast";
import {
    createActiveTimeRegisLecturer,
    deleteActiveTimeRegisLecturer,
    getListActiveTimeLecturer,
    messageClear,
} from "@/store/reducer/activateTimeReducer";
import clsx from "clsx";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import ModalConfirm from "@/components/ModalConfirm";
import { useTranslation } from "react-i18next";

type ActivateTime = {
    schoolYear: number;
    semester: number;
    startDate: Date;
    endDate: Date;
    // status: string | null;
};

const toDatetimeLocal = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const ActivateTeachingScheduleRegistration = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const {
        activeTimeLecturers,
        activeTimeStudent,
        successMessage,
        errorMessage,
    } = useSelector((state: RootState) => state.activateTime);

    const [state, setState] = useState<ActivateTime>({
        schoolYear: new Date(Date.now()).getFullYear(),
        semester: 0,
        startDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        // status: null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteActiveTimeId, setDeleteActiveTimeId] = useState<number | null>(
        null
    );

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "startDate" || name === "endDate") {
            const [datePart, timePart] = value.split("T");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);
            const localDate = new Date(year, month - 1, day, hour, minute);

            setState((prev) => ({ ...prev, [name]: localDate }));
        } else {
            setState((prev) => ({
                ...prev,
                [name]:
                    name === "schoolYear" || name === "semester"
                        ? Number(value)
                        : value,
            }));
        }
    };

    useEffect(() => {
        dispatch(getListActiveTimeLecturer());
    }, []);

    const handleActivateTime = () => {
        const obj = {
            schoolYear: state.schoolYear,
            semester: state.semester,
            startDate: state.startDate,
            endDate: state.endDate,
            status: "active",
        };
        dispatch(createActiveTimeRegisLecturer({ dto: obj }));
    };

    const handleDelete = () => {
        if (deleteActiveTimeId) {
            dispatch(deleteActiveTimeRegisLecturer(deleteActiveTimeId));
            setIsModalOpen(false);
            setDeleteActiveTimeId(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setDeleteActiveTimeId(null);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            dispatch(getListActiveTimeLecturer());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin"]}>
            <BorderBox title={t("activate.title")}>
                <div className={styles.activationForm}>
                    <InputWithLabel
                        label={t("activate.startDate")}
                        type="datetime-local"
                        name="startDate"
                        value={toDatetimeLocal(state.startDate)}
                        onChange={inputHandle}
                        required
                    />
                    <InputWithLabel
                        label={t("activate.endDate")}
                        type="datetime-local"
                        name="endDate"
                        value={toDatetimeLocal(state.endDate)}
                        onChange={inputHandle}
                        required
                    />
                    <InputWithLabel
                        label={t("activate.semester")}
                        type="number"
                        name="semester"
                        value={String(state.semester)}
                        onChange={inputHandle}
                        required
                    />
                    <InputWithLabel
                        label={t("activate.schoolYear")}
                        type="number"
                        name="schoolYear"
                        value={String(state.schoolYear)}
                        onChange={inputHandle}
                        required
                    />

                    <Button
                        onClick={handleActivateTime}
                        className={styles.activateButton}
                    >
                        {t("activate.button")}
                    </Button>
                </div>

                <div className={styles.activatedList}>
                    <TypographyBody
                        tag="span"
                        theme="md-bold"
                        className={styles.listTitle}
                    >
                        {t("activate.listTitle")}
                    </TypographyBody>
                    {activeTimeLecturers.length > 0 ? (
                        <table className={styles.activatedTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{t("activate.startDate")}</th>
                                    <th>{t("activate.endDate")}</th>
                                    <th>
                                        {t("activate.semester")} -{" "}
                                        {t("activate.schoolYear")}
                                    </th>
                                    <th>{t("activate.status")}</th>
                                    <th style={{ minWidth: "70px" }}>
                                        {t("activate.action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTimeLecturers.map((time) => (
                                    <tr key={time.id}>
                                        <td>{time.id}</td>
                                        <td>
                                            {new Date(
                                                time.startDate
                                            ).toLocaleString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                time.endDate
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {`${time.semester} - ${time.schoolYear}`}
                                        </td>
                                        <td>{time.status}</td>
                                        <td
                                            className={clsx(
                                                styles.buttonAction,
                                                styles.tableCell
                                            )}
                                        >
                                            <Link
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsModalOpen(true);
                                                    setDeleteActiveTimeId(
                                                        time.id
                                                    );
                                                }}
                                                href="#"
                                                className={clsx(
                                                    styles.viewButton,
                                                    styles.viewButtonDelete
                                                )}
                                            >
                                                <MdDeleteForever />
                                            </Link>

                                            {isModalOpen &&
                                                deleteActiveTimeId ===
                                                    time.id && (
                                                    <ModalConfirm
                                                        message={t(
                                                            "activate.confirmDelete"
                                                        )}
                                                        onConfirm={handleDelete}
                                                        onCancel={handleCancel}
                                                    />
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <TypographyBody
                            tag="span"
                            theme="sm"
                            className={styles.noData}
                        >
                            {t("activate.noData")}
                        </TypographyBody>
                    )}
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default ActivateTeachingScheduleRegistration;
