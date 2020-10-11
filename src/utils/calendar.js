export const dayOfWeekList = [
    {
        lang: "en",
        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    {
        lang: "ko",
        data: ["일", "월", "화", "수", "목", "금", "토"]
    }
];

export const getDateInfo = (date = new Date()) => {
    return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() };
};

export const getMonthInfo = ({ year, month }) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const lastDayOfWeek = lastDay.getDay();
    const lastDate = lastDay.getDate();

    return {
        firstDayOfWeek,
        lastDayOfWeek,
        lastDate
    };
};

export const calcWeekCount = ({ year, month }) => {
    const monthInfo = getMonthInfo({ year, month });
    let weekCount = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7);

    return weekCount;
};
