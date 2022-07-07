interface IDateProvider {
    compareInHours(end_date: Date): number;
    compareInHours1(start_date: Date, end_date: Date): number;
    dateNow(): Date;
    compareToUTC(date: Date): string;
    compareInDays(start_date: Date, end_date: Date): number;
}

export { IDateProvider };
