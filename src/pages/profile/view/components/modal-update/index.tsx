import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import Title from "../title";
import { Button } from "@/components/Button";
import { RiEdit2Fill } from "react-icons/ri";

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

const ModalUpdateProfile = ({ isOpen, setIsOpen }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={t("common.update-profile")}
        >
            <div className={styles.gridContainer}>
                <div className={styles.gridItem}>
                    <InputWithLabel
                        label="Mã giảng viên"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Email"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />

                    <Title title="Thông tin cơ bản" />
                    <InputWithLabel
                        label="CMND/CCCD"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Nơi cấp CCCD"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Ngày cấp CCCD"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Số điện thoại"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />

                    <InputWithLabel
                        label="Dân tộc"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Tôn giáo"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Nơi sinh"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Số tài khoản"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                </div>
                <div className={styles.gridItem}>
                    <InputWithLabel
                        label="Họ tên"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Địa chỉ"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />

                    <Title title="Thông tin chức vụ" />
                    <InputWithLabel
                        label="Học hàm"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Học vị"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Chức vụ"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Loại giảng viên"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />

                    <InputWithLabel
                        label="Chuyên ngành"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Khoa"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Tên ngân hàng"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Chủ tài khoản"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                </div>
                <div className={styles.gridItem}>
                    <InputWithLabel
                        label="Giới tính"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Ngày sinh"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />

                    <Title title="Thông tin quan hệ nhân thân" />
                    <InputWithLabel
                        label="Họ tên cha/mẹ"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Năm sinh"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Quốc tịch"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Số điện thoại"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Tôn giáo"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Địa chỉ thường trú"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Nghề nghiệp"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                    <InputWithLabel
                        label="Nơi ở hiện tại"
                        name="teacherCode"
                        value="125213"
                        type="text"
                        required
                    />
                </div>
            </div>

            <Button size="large" className={styles.button}>
                <RiEdit2Fill />
                Lưu thông tin
            </Button>
        </Modal>
    );
};

export default ModalUpdateProfile;
