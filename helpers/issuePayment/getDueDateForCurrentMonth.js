const moment = require("moment-timezone");

module.exports = () => {
  const currentDateStr = moment.tz("Asia/Manila").format();
  const currentDate = new Date(currentDateStr);
  const currentYear = currentDate.getFullYear();
  const dateToday = new Date(moment.tz("Asia/Manila").format()).getDate();
  const currentMonth =
    dateToday < 28 // Is it before 28th day of the month?
      ? currentDate.getMonth() + 1 // if yes, set due date to currrent month.
      : currentDate.getMonth() + 2; // if no, set due date to next month.
  const currentMonthStr =
    currentMonth < 10 ? "0" + currentMonth.toString() : currentMonth.toString();
  const dueDateStr = moment
    .tz(`${currentYear}-${currentMonthStr}-28 00:00`, "Asia/Manila")
    .format();
  return new Date(dueDateStr);
};
