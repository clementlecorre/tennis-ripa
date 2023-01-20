const constants = require('./const');

function GetDates(startDate, endDate) {
  const dates = [];
  let currentDate = startDate;
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}
function GetFromDate() {
  const date = new Date();
  date.setDate(date.getDate() + constants.StartRangeDays);
  return date;
}
function GetEndDate() {
  const date = new Date();
  date.setDate(date.getDate() + constants.EndRangeDays);
  return date;
}

function GetFromDateNow() {
  const date = new Date();
  return date;
}

function GetEndDateNow() {
  const date = new Date();
  date.setDate(date.getDate() + 6 );
  return date;
}

module.exports = {
  GetDates,
  GetEndDate,
  GetFromDate,
  GetFromDateNow,
  GetEndDateNow,
};
