"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextBusinessDay = exports.getTimeFormTimeStamp = void 0;
const date_fns_1 = require("date-fns");
function getTimeFormTimeStamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
exports.getTimeFormTimeStamp = getTimeFormTimeStamp;
function getNextBusinessDay(currentDate) {
    let nextDay = (0, date_fns_1.addDays)(currentDate, 1);
    while ((0, date_fns_1.isWeekend)(nextDay)) {
        nextDay = (0, date_fns_1.addDays)(nextDay, 1);
    }
    return nextDay;
}
exports.getNextBusinessDay = getNextBusinessDay;
//# sourceMappingURL=date.js.map