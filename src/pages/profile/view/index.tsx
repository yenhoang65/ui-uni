import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TypographyBody } from "@/components/TypographyBody";
import { Button } from "@/components/Button";
import { RiEdit2Fill } from "react-icons/ri";
import BasicInfomation from "./components/basic-infomation";
import Title from "./components/title";
import AuthGuard from "@/components/AuthGuard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

const Profile = () => {
    const router = useRouter();
    const { userInfo, role } = useSelector((state: RootState) => state.auth);

    const isLecturer = role === "lecturer";
    const isStudent = role === "student";
    const isAdminOrEmployee = role === "admin" || role === "employee";

    return (
        <AuthGuard allowedRoles={["admin", "employee", "student", "lecturer"]}>
            <div className={styles.content}>
                <BorderBox title="Profile">
                    <main className={styles.container}>
                        <div className={styles.left}>
                            <div className={styles.userImageProfile}>
                                <Image
                                    src={require("./assets/avatar.jpg")}
                                    width={180}
                                    height={180}
                                    alt="Picture of the author"
                                    className={styles.userImage}
                                />
                            </div>
                            <div className={styles.basicInfo}>
                                <BasicInfomation
                                    title="User ID"
                                    content={userInfo.userId}
                                />
                                <BasicInfomation
                                    title="Full Name"
                                    content={userInfo.userName}
                                />
                                <BasicInfomation
                                    title="Gender"
                                    content={"N/A"}
                                />
                                <BasicInfomation
                                    title="Email"
                                    content={userInfo.email || "N/A"}
                                />
                                <BasicInfomation
                                    title="Permanent Address"
                                    content={
                                        userInfo.permanentResident || "N/A"
                                    }
                                />
                                <Button
                                    onClick={() => router.push(`/profile/edit`)}
                                    size="large"
                                    className={styles.button}
                                >
                                    <RiEdit2Fill />
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.basicInformation}>
                                <Title title="Basic Information" />
                                <div className={styles.informationContent}>
                                    <div>
                                        <BasicInfomation
                                            title="Citizen ID"
                                            content={userInfo.idNumber || "N/A"}
                                        />
                                        <BasicInfomation
                                            title="Phone"
                                            content={
                                                userInfo.phoneNumber || "N/A"
                                            }
                                        />
                                        <BasicInfomation
                                            title="Ethnicity"
                                            content={
                                                userInfo.ethnicGroup || "N/A"
                                            }
                                        />
                                        <BasicInfomation
                                            title="Date of Birth"
                                            content={
                                                userInfo.dateOfBirth || "N/A"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <BasicInfomation
                                            title="ID Issue Place"
                                            content={
                                                userInfo.placeOfBirth || "N/A"
                                            }
                                        />
                                        <BasicInfomation
                                            title="ID Issue Date"
                                            content={"N/A"}
                                        />
                                        <BasicInfomation
                                            title="Religion"
                                            content={userInfo.religion || "N/A"}
                                        />
                                    </div>
                                </div>
                            </div>

                            {isLecturer ||
                                (isAdminOrEmployee && (
                                    <div className={styles.positionInformation}>
                                        <Title title="Position Information" />
                                        <div
                                            className={
                                                styles.informationContent
                                            }
                                        >
                                            <div>
                                                <BasicInfomation
                                                    title="Academic Rank"
                                                    content={
                                                        userInfo.academicDegree ||
                                                        "N/A"
                                                    }
                                                />
                                                <BasicInfomation
                                                    title="Position"
                                                    content={
                                                        userInfo.position ||
                                                        "N/A"
                                                    }
                                                />
                                                <BasicInfomation
                                                    title="Major"
                                                    content={
                                                        userInfo.majorName ||
                                                        "N/A"
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <BasicInfomation
                                                    title="Degree"
                                                    content={
                                                        userInfo.academicDegree ||
                                                        "N/A"
                                                    }
                                                />
                                                <BasicInfomation
                                                    title="Faculty"
                                                    content={
                                                        userInfo.facultyName ||
                                                        "N/A"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            {isStudent && (
                                <div className={styles.academicInformation}>
                                    <Title title="Academic Information" />
                                    <div className={styles.informationContent}>
                                        <div>
                                            <BasicInfomation
                                                title="Education Level"
                                                content={
                                                    userInfo.educationLevel ||
                                                    "N/A"
                                                }
                                            />
                                            <BasicInfomation
                                                title="Type of Training"
                                                content={"N/A"}
                                            />
                                            <BasicInfomation
                                                title="Specialization"
                                                content={"N/A"}
                                            />
                                        </div>
                                        <div
                                            className={
                                                styles.informationContent
                                            }
                                        >
                                            <div>
                                                <BasicInfomation
                                                    title="Major"
                                                    content={
                                                        userInfo.majorName ||
                                                        "N/A"
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <BasicInfomation
                                                    title="Faculty"
                                                    content={
                                                        userInfo.facultyName ||
                                                        "N/A"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={styles.bankInformation}>
                                <Title title="Bank Information" />
                                <div className={styles.informationContent}>
                                    <div>
                                        <BasicInfomation
                                            title="Bank Account Number"
                                            content={
                                                userInfo.bankAccountNumber ||
                                                "N/A"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <BasicInfomation
                                            title="Bank Account Type"
                                            content={userInfo.bank || "N/A"}
                                        />
                                    </div>
                                    <div>
                                        <BasicInfomation
                                            title="Bank Account Owner"
                                            content={
                                                userInfo.bankAccountOwner ||
                                                "N/A"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.relationshipInformation}>
                                <Title title="Relationship Information" />
                                <div className={styles.informationContent}>
                                    <div>
                                        <BasicInfomation
                                            title="Parent Name"
                                            content={"N/A"}
                                        />
                                        <BasicInfomation
                                            title="Nationality"
                                            content={"N/A"}
                                        />
                                    </div>
                                    <div>
                                        <BasicInfomation
                                            title="Contact Number"
                                            content={"N/A"}
                                        />
                                        <BasicInfomation
                                            title="Permanent Address"
                                            content={"N/A"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </BorderBox>
            </div>
        </AuthGuard>
    );
};

export default Profile;
