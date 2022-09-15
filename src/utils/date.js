"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthArr = exports.sameMonth = exports.sameDate = exports.now = exports.roundDate = exports.lz = exports.getWeekDayShortName = exports.getMonthName = void 0;
const date_fns_1 = require("date-fns");
// Get month name
const getMonthName = (date) => {
    return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ][date.getMonth()];
};
exports.getMonthName = getMonthName;
const getWeekDayShortName = (day) => ["Mon", "Thu", "Thi", "Wed", "Fri", "Sat", "Sun"][day % 7];
exports.getWeekDayShortName = getWeekDayShortName;
// Function to add leading zeroes
const lz = (num, length = 2) => {
    return (100000 + num).toString().substring(6 - length);
};
exports.lz = lz;
// Remove hours minutes and seconds from Date
const roundDate = (date, to = "hours") => {
    const d = new Date(date);
    switch (to) {
        // @ts-ignore
        case "hours": // eslint-disable-line
            d.setHours(0);
        // @ts-ignore
        case "minutes": // eslint-disable-line
            d.setMinutes(0);
        // @ts-ignore
        case "seconds": // eslint-disable-line
            d.setSeconds(0);
        // @ts-ignore
        case "miliseconds": // eslint-disable-line
            d.setMilliseconds(0);
        default: // eslint-disable-line
            break;
    }
    return d;
};
exports.roundDate = roundDate;
// Get today, rounded to hours
const now = () => (0, exports.roundDate)(new Date());
exports.now = now;
// Check if two dates are the same, ignoring hours, minutes, seconds and miliseconds
const sameDate = (date1, date2) => {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
};
exports.sameDate = sameDate;
// Check if two dates are in the same month
const sameMonth = (date1, date2) => {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth());
};
exports.sameMonth = sameMonth;
const nextDaysMonth = (arr) => {
    const last = arr.length;
    if (!last) {
        return -1;
    }
    const lastValLen = arr[last - 1].length;
    if (!lastValLen) {
        return -1;
    }
    const today = arr[last - 1][lastValLen - 1];
    const nextDay = (0, date_fns_1.add)(today, { days: 1 });
    return today.getMonth() === 11 && nextDay.getMonth() === 0
        ? 12
        : nextDay.getMonth();
};
const getMonthArr = (date, { getNumOfWeeks = 6, skipDaysFromOtherMonths = false } = {}) => {
    // Get current month
    const currentMonth = date.getMonth();
    // Get first day of month
    const firstDay = new Date(date.getTime());
    firstDay.setMilliseconds(0);
    firstDay.setSeconds(0);
    firstDay.setMinutes(0);
    firstDay.setHours(0);
    firstDay.setDate(1);
    // Get day of week
    const firstDayOfWeek = firstDay.getDay();
    // Get date of monday
    const mondayDateUTC = firstDay.getTime() - firstDayOfWeek * 24 * 60 * 60 * 1000;
    // Generate array for month
    const month = [];
    while (month.length < getNumOfWeeks || nextDaysMonth(month) <= currentMonth) {
        const weekArr = [];
        for (let day = 0; day < 7; day++) {
            const today = new Date(mondayDateUTC +
                month.length * 7 * 24 * 60 * 60 * 1000 +
                day * 24 * 60 * 60 * 1000);
            weekArr.push(today);
        }
        month.push(weekArr);
    }
    return month;
};
exports.getMonthArr = getMonthArr;
