import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    compareInHours1(start_date: Date, end_date: Date): number {
        const end_date_utc = this.compareToUTC(end_date);
        const start_date_utc = this.compareToUTC(start_date);

        return dayjs(end_date_utc).diff(start_date_utc, "hours");
    }
    dateNow(): Date {
        return dayjs().toDate();
    }
    compareToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }
    compareInDays(start_date: Date, end_date: Date): number {
        const end_date_utc = this.compareToUTC(end_date);
        const start_date_utc = this.compareToUTC(start_date);

        return dayjs(end_date_utc).diff(start_date_utc, "days");
    }
    compareInHours(end_date: Date): number {
        const expectedReturnDateFormat = dayjs(end_date).utc().local().format();
        const dateNow = dayjs().utc().local().format();
        const compare = dayjs(expectedReturnDateFormat).diff(dateNow, "hour");

        return compare;
    }

    addDays(days: number): Date {
        return dayjs().add(days, "days").toDate();
    }
}

export { DayjsDateProvider };
