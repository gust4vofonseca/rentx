import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    compareInHours(end_date: Date): number {
        const expectedReturnDateFormat = dayjs(end_date).utc().local().format();
        const dateNow = dayjs().utc().local().format();
        const compare = dayjs(expectedReturnDateFormat).diff(dateNow, "hour");

        return compare;
    }
}

export { DayjsDateProvider };
