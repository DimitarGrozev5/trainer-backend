import { add } from "date-fns";

// Get month name
export const getMonthName = (date: Date) => {
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

export const getWeekDayShortName = (day: number) =>
  ["Mon", "Thu", "Thi", "Wed", "Fri", "Sat", "Sun"][day % 7];

// Function to add leading zeroes
export const lz = (num: number, length: number = 2): string => {
  return (100000 + num).toString().substring(6 - length);
};

// Remove hours minutes and seconds from Date
export const roundDate = (
  date: Date,
  to: "miliseconds" | "seconds" | "minutes" | "hours" = "hours"
): Date => {
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

// Get today, rounded to hours
export const now = () => roundDate(new Date());

// Check if two dates are the same, ignoring hours, minutes, seconds and miliseconds
export const sameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if two dates are in the same month
export const sameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

// Generate an array of the days of a month, based on a Date from that month
type DateUTC = number;

const nextDaysMonth = (arr: Date[][]): number => {
  const last = arr.length;
  if (!last) {
    return -1;
  }

  const lastValLen = arr[last - 1].length;
  if (!lastValLen) {
    return -1;
  }

  const today = arr[last - 1][lastValLen - 1];
  const nextDay = add(today, { days: 1 });

  return today.getMonth() === 11 && nextDay.getMonth() === 0
    ? 12
    : nextDay.getMonth();
};

export const getMonthArr = (
  date: Date,
  { getNumOfWeeks = 6, skipDaysFromOtherMonths = false } = {}
): Date[][] => {
  // Get current month
  const currentMonth = date.getMonth();

  // Get first day of month
  const firstDay: Date = new Date(date.getTime());
  firstDay.setMilliseconds(0);
  firstDay.setSeconds(0);
  firstDay.setMinutes(0);
  firstDay.setHours(0);
  firstDay.setDate(1);

  // Get day of week
  const firstDayOfWeek: number = firstDay.getDay();

  // Get date of monday
  const mondayDateUTC: DateUTC =
    firstDay.getTime() - firstDayOfWeek * 24 * 60 * 60 * 1000;

  // Generate array for month
  const month: Date[][] = [];
  while (month.length < getNumOfWeeks || nextDaysMonth(month) <= currentMonth) {
    const weekArr: Date[] = [];
    for (let day = 0; day < 7; day++) {
      const today = new Date(
        mondayDateUTC +
          month.length * 7 * 24 * 60 * 60 * 1000 +
          day * 24 * 60 * 60 * 1000
      );
      weekArr.push(today);
    }
    month.push(weekArr);
  }

  return month;
};
