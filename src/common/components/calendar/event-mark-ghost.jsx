import { memo, useContext } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { CalendarContext } from "./context/calendar-context";

const styles = {
  display: "inline-block",
};
const backgroundColor = "#7f369e66";

const EventMarkGhost = (props) => {
  const { dataDate, dataHour, dataMin } = props;
  const { stateCalendar } = useContext(CalendarContext);
  const { ghostProperties, calendarEvent } = stateCalendar;

  const newDate = new Date(dataDate);
  newDate.setHours(dataHour);
  newDate.setMinutes(dataMin);

  const stylesBox = {
    backgroundColor: "drakgreen",
    lineHeight: "31px",
    cursor: "move",
    fontSize: 10,
    width: ghostProperties.width,
    height: ghostProperties.height,
  };

  const handleFormat = (date) => {
    return format(date, `yyyy/MM/dd hh:mm:ss`, { locale: ptBR });
  };

  const Ghost = () => {
    return (
      <div
        style={{ ...stylesBox, backgroundColor }}
        data-ghost
        data-date={newDate}
      >
        <p style={{ lineHeight: "8px" }}>{calendarEvent.title}</p>
        <p style={{ lineHeight: "8px" }}>[{handleFormat(newDate)}]</p>
      </div>
    );
  };

  return (
    <div style={styles}>
      <Ghost />
    </div>
  );
};

const MemoizedEventMarkGhost = memo(EventMarkGhost);

export default MemoizedEventMarkGhost;
