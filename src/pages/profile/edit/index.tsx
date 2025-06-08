import { Button } from "@/components/Button";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import Title from "../view/components/title";
import BorderBox from "@/components/BorderBox";
import { useTranslation } from "react-i18next";
import AuthGuard from "@/components/AuthGuard";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

type UserInfo = {
    academicDegree: string;
    address: string;
    admissionDate: string;
    bank: string;
    bankAccountNumber: string;
    bankAccountOwner: string;
    dateOfBirth: string;
    educationLevel: string;
    email: string;
    ethnicGroup: string;
    facultyName: string;
    idNumber: string;
    majorName: string;
    permanentResident: string;
    phoneNumber: string;
    placeOfBirth: string;
    position: string;
    religion: string;
    role: string;
    status: string;
    userId: string;
    userName: string;
    teacherCode?: string;
    studentCode?: string;
    fullName?: string;
    contactAddress?: string;
    gender?: string;
    birthDate?: string;
    citizenId?: string;
    issuePlace?: string;
    issueDate?: string;
    birthPlace?: string;
    ethnicity?: string;
    academicRank?: string;
    degree?: string;
    major?: string;
    lecturerType?: string;
    faculty?: string;
    typeOfTraining?: string;
    trainingProgram?: string;
    class?: string;
    bankName?: string;
    bankNumber?: string;
    accountOwner?: string;
    parentName?: string;
    parentBirthYear?: string;
    nationality?: string;
    parentPhone?: string;
    parentReligion?: string;
    parentAddress?: string;
    parentJob?: string;
    parentCurrentAddress?: string;
};

const EditProfile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { role, userInfo } = useSelector((state: RootState) => state.auth);
    const [state, setState] = useState<UserInfo>({
        academicDegree: userInfo?.academicDegree || "",
        address: userInfo?.address || "",
        admissionDate: userInfo?.admissionDate || "",
        bank: userInfo?.bank || "",
        bankAccountNumber: userInfo?.bankAccountNumber || "",
        bankAccountOwner: userInfo?.bankAccountOwner || "",
        dateOfBirth: userInfo?.dateOfBirth || "",
        educationLevel: userInfo?.educationLevel || "",
        email: userInfo?.email || "",
        ethnicGroup: userInfo?.ethnicGroup || "",
        facultyName: userInfo?.facultyName || "",
        idNumber: userInfo?.idNumber || "",
        majorName: userInfo?.majorName || "",
        permanentResident: userInfo?.permanentResident || "",
        phoneNumber: userInfo?.phoneNumber || "",
        placeOfBirth: userInfo?.placeOfBirth || "",
        position: userInfo?.position || "",
        religion: userInfo?.religion || "",
        role: userInfo?.role || "",
        status: userInfo?.status || "",
        userId: userInfo?.userId || "",
        userName: userInfo?.userName || "",
        teacherCode: userInfo?.userId || "",
        studentCode: userInfo?.userId || "",
        fullName: userInfo?.userName || "",
        contactAddress: "",
        gender: "",
        birthDate: "",
        citizenId: "",
        issuePlace: "",
        issueDate: "",
        birthPlace: "",
        ethnicity: "",
        academicRank: "",
        degree: "",
        major: "",
        lecturerType: "",
        faculty: "",
        typeOfTraining: "",
        trainingProgram: "",
        class: "",
        bankName: "",
        bankNumber: "",
        accountOwner: "",
        parentName: "",
        parentBirthYear: "",
        nationality: "",
        parentPhone: "",
        parentReligion: "",
        parentAddress: "",
        parentJob: "",
        parentCurrentAddress: "",
    });

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthGuard allowedRoles={["admin", "employee", "student", "lecturer"]}>
            <div className={styles.container}>
                <BorderBox title={t("common.update-profile")}>
                    <form action="">
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                {(role as string) === "admin" && (
                                    <InputWithLabel
                                        label={t("common.teacher-code")}
                                        name="teacherCode"
                                        value={state.teacherCode || ""}
                                        type="text"
                                        required
                                        disabled
                                        onChange={inputHandle}
                                    />
                                )}
                                {role === "student" && (
                                    <InputWithLabel
                                        label={t("common.student-code")}
                                        name="studentCode"
                                        value={state.studentCode || ""}
                                        type="text"
                                        required
                                        disabled
                                        onChange={inputHandle}
                                    />
                                )}
                                <InputWithLabel
                                    label={t("common.email")}
                                    name="email"
                                    value={state.email || ""}
                                    type="text"
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.full-name")}
                                    name="fullName"
                                    value={state.fullName || ""}
                                    type="text"
                                    required
                                    disabled
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.address-contact")}
                                    name="contactAddress"
                                    value={state.contactAddress || ""}
                                    type="text"
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.gender")}
                                    name="gender"
                                    value={state.gender || ""}
                                    type="text"
                                    required
                                    disabled
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.birth-date")}
                                    name="birthDate"
                                    value={state.birthDate || ""}
                                    type="text"
                                    required
                                    disabled
                                    onChange={inputHandle}
                                />
                            </div>
                        </div>

                        <Title
                            title={t("common.basic-info")}
                            className={styles.title}
                        />
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.citizen-id")}
                                    name="citizenId"
                                    value={state.citizenId || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.id-issue-place")}
                                    name="issuePlace"
                                    value={state.issuePlace || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.religion")}
                                    name="religion"
                                    value={state.religion || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.phone")}
                                    name="phoneNumber"
                                    value={state.phoneNumber || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.id-issue-date")}
                                    name="issueDate"
                                    value={state.issueDate || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.birth-place")}
                                    name="birthPlace"
                                    value={state.birthPlace || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.ethnicity")}
                                    name="ethnicGroup"
                                    value={state.ethnicGroup || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                        </div>

                        {(role as string) === "admin" && (
                            <>
                                <Title
                                    title={t("common.position-info")}
                                    className={styles.title}
                                />
                                <div className={styles.gridContainer}>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.academic-rank")}
                                            name="academicRank"
                                            value={state.academicRank || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.degree")}
                                            name="degree"
                                            value={state.degree || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.position")}
                                            name="position"
                                            value={state.position || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.lecturer-type")}
                                            name="lecturerType"
                                            value={state.lecturerType || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.major")}
                                            name="majorName"
                                            value={state.majorName || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.faculty")}
                                            name="facultyName"
                                            value={state.facultyName || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {role === "student" && (
                            <>
                                <Title
                                    title={t("common.training-info")}
                                    className={styles.title}
                                />
                                <div className={styles.gridContainer}>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.education-level")}
                                            name="educationLevel"
                                            value={state.educationLevel || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.admission-date")}
                                            name="admissionDate"
                                            value={state.admissionDate || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.major")}
                                            name="majorName"
                                            value={state.majorName || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.type-of-training")}
                                            name="typeOfTraining"
                                            value={state.typeOfTraining || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                    <div className={styles.gridItem}>
                                        <InputWithLabel
                                            label={t("common.training-program")}
                                            name="trainingProgram"
                                            value={state.trainingProgram || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                        <InputWithLabel
                                            label={t("common.class")}
                                            name="class"
                                            value={state.class || ""}
                                            required
                                            onChange={inputHandle}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <Title
                            title={t("common.bank-info")}
                            className={styles.title}
                        />
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.bank-name")}
                                    name="bankName"
                                    value={state.bankName || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.bank-number")}
                                    name="bankNumber"
                                    value={state.bankNumber || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.account-owner")}
                                    name="accountOwner"
                                    value={state.accountOwner || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                        </div>

                        <Title
                            title={t("common.relation-info")}
                            className={styles.title}
                        />
                        <div className={styles.gridContainer}>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.parent-name")}
                                    name="parentName"
                                    value={state.parentName || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.birth-year")}
                                    name="parentBirthYear"
                                    value={state.parentBirthYear || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.nationality")}
                                    name="nationality"
                                    value={state.nationality || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.contact-number")}
                                    name="parentPhone"
                                    value={state.parentPhone || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.religion")}
                                    name="parentReligion"
                                    value={state.parentReligion || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.address-permanent")}
                                    name="parentAddress"
                                    value={state.parentAddress || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                            <div className={styles.gridItem}>
                                <InputWithLabel
                                    label={t("common.job")}
                                    name="parentJob"
                                    value={state.parentJob || ""}
                                    required
                                    onChange={inputHandle}
                                />
                                <InputWithLabel
                                    label={t("common.current-address")}
                                    name="parentCurrentAddress"
                                    value={state.parentCurrentAddress || ""}
                                    required
                                    onChange={inputHandle}
                                />
                            </div>
                        </div>

                        <div className={styles.actionContent}>
                            <Button
                                onClick={(e) => e.preventDefault()}
                                size="large"
                                className={styles.button}
                            >
                                {t("common.update-profile")}
                            </Button>
                        </div>
                    </form>
                </BorderBox>
            </div>
        </AuthGuard>
    );
};

export default EditProfile;
