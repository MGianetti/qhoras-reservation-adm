import { getYear, getMonth, getDate, getTime } from "date-fns";

function getSelectedWeekIndex(selectedDate, weeks) {
  const _year = getYear(selectedDate);
  const _month = getMonth(selectedDate);
  const _day = getDate(selectedDate);

  return weeks.reduce(
    (position, week, index) =>
      week.find(
        (day) => getTime(day) === getTime(new Date(_year, _month, _day, 0, 0)),
      )
        ? (position = index)
        : position,
    0,
  );
}
export default getSelectedWeekIndex;
