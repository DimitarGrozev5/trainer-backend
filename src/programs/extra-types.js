export class SessionDate {
    constructor(date) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.date = date.getDate();
    }
    static from(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        };
    }
    static toDate(date) {
        return new Date(date.year, date.month, date.date);
    }
}
