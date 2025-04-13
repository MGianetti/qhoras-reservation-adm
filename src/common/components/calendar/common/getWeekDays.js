import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  lastDayOfWeek,
  addDays,
  eachDayOfInterval,
} from "date-fns";

function getWeekDays(selectedDate, size) {
  function getMonthWeeks(date, { forceSixWeeks = false } = {}) {
    const monthFirstDate = startOfMonth(date);
    const monthLastDate = endOfMonth(date);

    const start = startOfWeek(monthFirstDate);
    let end = lastDayOfWeek(monthLastDate);

    if (forceSixWeeks) {
      const totalDays = eachDayOfInterval({ start, end }).length;
      if (totalDays < 42) {
        end = addDays(end, 42 - totalDays);
      }
    }

    return eachDayOfInterval({ start, end });
  }

  const days = getMonthWeeks(selectedDate, { forceSixWeeks: false });

  const weekly = (_month, _size) =>
    _month.reduce(
      (weeks, day, index, group) =>
        !(index % _size)
          ? weeks.concat([group.slice(index, index + _size)])
          : weeks,
      [],
    );

  return weekly(days, size);
}

export default getWeekDays;
