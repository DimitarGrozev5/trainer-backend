import { last } from './array';
// Get month name
export const getMonthName = (date) => {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ][date.getUTCMonth()];
};
export const getWeekDayShortName = (day) => ['Mon', 'Thu', 'Thi', 'Wed', 'Fri', 'Sat', 'Sun'][day % 7];
// Function to add leading zeroes
export const lz = (num, length = 2) => {
    return (100000 + num).toString().substring(6 - length);
};
// Remove hours minutes and seconds from Date
export const roundDate = (date, to = 'hours') => {
    const d = new Date(date);
    switch (to) {
        // @ts-ignore
        case 'hours': // eslint-disable-line
            d.setUTCHours(0);
        // @ts-ignore
        case 'minutes': // eslint-disable-line
            d.setUTCMinutes(0);
        // @ts-ignore
        case 'seconds': // eslint-disable-line
            d.setUTCSeconds(0);
        // @ts-ignore
        case 'miliseconds': // eslint-disable-line
            d.setUTCMilliseconds(0);
        default: // eslint-disable-line
            break;
    }
    return d;
};
// Get today, rounded to hours
export const now = () => roundDate(new Date());
// Check if two dates are the same, ignoring hours, minutes, seconds and miliseconds
export const sameDate = (date1, date2) => {
    return (date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate());
};
// Check if two dates are in the same month
export const sameMonth = (date1, date2) => {
    return (date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth());
};
export const getMonthArr = (date, { getNumOfWeeks = 6 } = {}) => {
    // Get current month
    const currentMonth = date.getUTCMonth();
    // Get first day of month
    const firstDay = new Date(date.getTime());
    firstDay.setMilliseconds(0);
    firstDay.setSeconds(0);
    firstDay.setMinutes(0);
    firstDay.setHours(0);
    firstDay.setDate(1);
    // Get day of week
    const firstDayOfWeek = firstDay.getUTCDay();
    // Get date of monday
    const mondayDateUTC = firstDay.getTime() - firstDayOfWeek * 24 * 60 * 60 * 1000;
    // Generate array for month
    const month = [];
    let lastDayOfWeek = firstDay;
    // Loop through weeks until reaching the desired number of weeks or until the date goes to another month
    while (month.length < getNumOfWeeks ||
        lastDayOfWeek.getUTCMonth() === currentMonth) {
        const weekArr = [];
        for (let day = 0; day < 7; day++) {
            const today = new Date(mondayDateUTC +
                month.length * 7 * 24 * 60 * 60 * 1000 +
                day * 24 * 60 * 60 * 1000);
            weekArr.push(today);
        }
        month.push(weekArr);
        lastDayOfWeek = last(weekArr);
    }
    return month;
};
