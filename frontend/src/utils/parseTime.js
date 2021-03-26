import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";

dayjs.extend(calendar);
dayjs.extend(utc);

const parseTime = (time) => {
    const date = dayjs(time).local();

    const formattedDate = dayjs(date).calendar(null, {
        sameDay: "MM/D/YY[,] h:mm:ss a",
        sameElse: "MM/D/YY[,] h:mm:ss a",
    });

    return formattedDate;
};

export { parseTime };

