import BorderBox from "@/components/BorderBox";
import styles from "./styles.module.css";
import InputWithLabel from "@/components/InputWithLabel";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"; // Thêm useRef
import { Button } from "@/components/Button";
import SelectWithLabel from "@/components/SelectWithLabel";
import clsx from "clsx";
import { TypographyBody } from "@/components/TypographyBody";
import AuthGuard from "@/components/AuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createClassroom,
    getClassroomDetail,
    messageClear,
    updateClassroom,
} from "@/store/reducer/classroomReducer";
import toast from "react-hot-toast";

type State = {
    classroomId: number | null;
    classroomName: string | null;
    numberOfSeats: number;
    status: string | null;
};

const classroomTypeOptions = [
    { value: "Phòng học lý thuyết", label: "Lý thuyết" },
    { value: "Phòng học thực hành", label: "Thực hành" },
];

const deviceOptions = [
    { value: "Máy chiếu", label: "Máy chiếu" },
    { value: "Bảng trắng", label: "Bảng trắng" },
    { value: "Điều hòa", label: "Điều hòa" },
    { value: "Máy tính", label: "Máy tính" },
    { value: "Bàn thực hành", label: "Bàn thực hành" },
    { value: "Âm thanh", label: "Âm thanh" },
    { value: "Bảng tương tác", label: "Bảng tương tác" },
    { value: "Thiết bị thí nghiệm", label: "Thiết bị thí nghiệm" },
];

const CreateEditClassroom = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { classroom, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.classroom
    );

    const router = useRouter();
    const { query } = router;
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [state, setState] = useState<State>({
        classroomId: null,
        classroomName: "",
        numberOfSeats: 0,
        status: "active",
    });
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Tạo một ref cho dropdown

    const inputHandle = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (query.id) {
            dispatch(getClassroomDetail(query.id));
        }
    }, [query.id]);

    const toggleDeviceDropdown = () => {
        setIsDeviceDropdownOpen(!isDeviceDropdownOpen);
    };

    const handleDeviceSelect = (deviceValue: string) => {
        if (selectedDevices.includes(deviceValue)) {
            setSelectedDevices(
                selectedDevices.filter((dv) => dv !== deviceValue)
            );
        } else {
            setSelectedDevices([...selectedDevices, deviceValue]);
        }
    };

    useEffect(() => {
        setSelectedDevices(selectedDevices);
    }, [selectedDevices]);

    useEffect(() => {
        if (classroom && query.id) {
            setMode("edit");

            setState({
                classroomId: classroom.classroomId,
                classroomName: classroom.classroomName,
                numberOfSeats: classroom.numberOfSeats,
                status: classroom.status || "active",
            });

            setSelectedDevices(classroom.devices || []);
        } else {
            setMode("create");
            setState({
                classroomId: null,
                classroomName: "",
                numberOfSeats: 0,
                status: "active",
            });
            setSelectedDevices([]);
        }
    }, [classroom, query.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                event.target !==
                    document.querySelector(`.${styles.multiSelectInput}`)
            ) {
                setIsDeviceDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDeviceDropdownOpen]);

    const handleSubmit = () => {
        if (mode === "create") {
            const obj = {
                classroomId: state.classroomId,
                classroomName: state.classroomName,
                numberOfSeats: state.numberOfSeats,
                status: state.status || "active",
                devices: selectedDevices,
            };
            dispatch(createClassroom({ dto: obj }));
        } else {
            const obj = {
                classroomName: state.classroomName,
                numberOfSeats: state.numberOfSeats,
                status: state.status || "active",
                devices: selectedDevices,
            };
            dispatch(updateClassroom({ id: classroom.classroomId, dto: obj }));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());

            router.push("/classroom");
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <AuthGuard allowedRoles={["admin", "employee"]}>
            <BorderBox
                title={
                    mode === "create" ? "Thêm phòng học" : "Chỉnh sửa phòng học"
                }
            >
                <section className={styles.container}>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Mã phòng"
                            name="classroomId"
                            value={String(state.classroomId)}
                            onChange={inputHandle}
                            type="text"
                            required
                            disabled={mode === "edit"}
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <InputWithLabel
                            label="Số chỗ ngồi"
                            name="numberOfSeats"
                            value={String(state.numberOfSeats)}
                            onChange={inputHandle}
                            type="number"
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Loại phòng"
                            name="classroomName"
                            value={state.classroomName || ""}
                            onChange={
                                inputHandle as React.ChangeEventHandler<HTMLSelectElement>
                            }
                            options={classroomTypeOptions}
                            required
                        />
                    </div>
                    <div className={styles.gridItem}>
                        <SelectWithLabel
                            label="Trạng thái"
                            name="status"
                            value={state.status || "active"}
                            onChange={inputHandle}
                            options={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                        />
                    </div>
                    <div className={styles.gridItemFull}>
                        <div className={styles.multiSelectContainer}>
                            <TypographyBody tag="span" theme="md-bold">
                                Thiết bị
                            </TypographyBody>
                            <div
                                onClick={toggleDeviceDropdown}
                                className={styles.multiSelectInput}
                            >
                                {selectedDevices.length > 0 ? (
                                    selectedDevices.map((dv) => (
                                        <span
                                            key={dv}
                                            className={styles.selectedDevice}
                                        >
                                            {deviceOptions.find(
                                                (opt) => opt.value === dv
                                            )?.label || dv}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.placeholder}>
                                        Chọn thiết bị
                                    </span>
                                )}
                                <span className={styles.arrow}>
                                    {isDeviceDropdownOpen ? "▲" : "▼"}
                                </span>
                            </div>
                            {isDeviceDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className={styles.multiSelectDropdown}
                                >
                                    {deviceOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={clsx(
                                                styles.dropdownItem,
                                                {
                                                    [styles.selected]:
                                                        selectedDevices.includes(
                                                            option.value
                                                        ),
                                                }
                                            )}
                                            onClick={() =>
                                                handleDeviceSelect(option.value)
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedDevices.includes(
                                                    option.value
                                                )}
                                                readOnly
                                            />
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className={styles.button}>
                    <Button
                        className={styles.buttonAction}
                        onClick={handleSubmit}
                    >
                        {mode === "create" ? "Lưu" : "Cập nhật"}
                    </Button>
                </div>
            </BorderBox>
        </AuthGuard>
    );
};

export default CreateEditClassroom;
