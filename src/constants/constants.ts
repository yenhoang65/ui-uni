export const getCurrentSemesterAndSchoolYear = (): {
    semester: number;
    schoolyear: number;
} => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    if ((month === 7 && date >= 15) || month > 7) {
        return {
            semester: 1,
            schoolyear: year,
        };
    }

    if (month < 3 || (month === 2 && date <= 28)) {
        return {
            semester: 1,
            schoolyear: year,
        };
    }

    return {
        semester: 2,
        schoolyear: year,
    };
};
