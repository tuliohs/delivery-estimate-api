import { addDays, isWeekend } from 'date-fns';

export function getTimeFormTimeStamp(timestamp: string | number | Date) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export function getNextBusinessDay(currentDate: Date): Date {
    let nextDay: Date = addDays(currentDate, 1);

    while (isWeekend(nextDay)) {
        nextDay = addDays(nextDay, 1);
    }

    return nextDay;
}
