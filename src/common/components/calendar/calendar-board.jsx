import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useDrop } from "react-dnd";
import { Grid } from "@mui/material";
import { ptBR } from "date-fns/locale";
import { useSelector } from "react-redux";
import timezone from "dayjs/plugin/timezone";
import { createStyles, makeStyles } from "@mui/styles";
import { format, differenceInMinutes } from "date-fns";
import { useState, useEffect, useContext, useMemo } from "react";

import EventMark from "./event-marker";
import LineDivisor from "./line-divisor";
import createEditEvent from "./create-edit-event";
import { CalendarContext } from "./context/calendar-context";
import appointmentService from "../../../domains/appointment/appointmentService";
import { useLocation } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles(() =>
  createStyles({
    board: {
      minWidth: "100%",
      height: "100%",
      flex: "none",
      verticalAlign: "top",
      overflow: "hidden",
      position: "relative",
    },
    columnDivisor: {
      height: "100%",
      paddingLeft: 8,
      borderRight: "1px solid #dadce0",
    },
    dayContainer: {
      borderRight: "1px solid #dadce0",
      position: "relative",
      flex: "1 1 auto",
      height: "100%",
    },
    eventsContainer: {
      backgroundColor: "transparent",
      position: "relative",
      height: "100%",
      width: "100%",
    },
    currentTimeDot: {
      background: "rgb(226, 57, 43)",
      borderRadius: "50%",
      content: "''",
      position: "absolute",
      height: 12,
      width: 12,
      zIndex: 2,
      marginTop: -1000,
      marginLeft: -6.5,
    },
    currentTimeLine: {
      position: "absolute",
      zIndex: 2,
      borderColor: "rgb(226, 57, 43)",
      borderTop: "2px solid",
      left: 0,
      right: -1,
    },
    fixedEvent: {
      position: "absolute",
      backgroundColor: "#e0e0e0",
      border: "1px solid #bdbdbd",
      borderRadius: "4px",
      padding: "4px",
      zIndex: 1,
      left: 0,
      right: 0,
    },
    dayClosed: {
      top: "0%",
      height: "100%",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      left: 0,
      right: 0,
      marginInline: "2px 1px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      "@media (max-width: 600px)": {
        writingMode: "vertical-rl",
      },
    },
    initialDayClosed: {
      top: 0,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      marginInline: "1px",
      overflow: "hidden",
      "@media (max-width: 600px)": {
        writingMode: "vertical-rl",
      },
    },
    finalDayClosed: {
      bottom: 0,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      marginTop: "4px",
      overflow: "hidden",
      "@media (max-width: 600px)": {
        writingMode: "vertical-rl",
      },
    },
  }),
);

function CalendarBoard(props) {
  const classes = useStyles();

  const { selectedWeekIndex, selectedWeek, selectedRoom } = props;

  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const {
    selectedDate,
    layout,
    defaultEventDuration,
    draggingEventId,
    calendarEvent,
  } = stateCalendar;

  const [currentTimePosition, setCurrentTimePosition] = useState();

  const location = useLocation();

  useEffect(() => {
    setInterval(() => {
      const now = new Date();
      const initTime = new Date(
        format(now, "yyyy/MM/dd 0:0:0", { locale: ptBR }),
      );
      const position = differenceInMinutes(now, initTime);
      setCurrentTimePosition(position);
    }, 1000);
  }, []);

  const viewLayout = Array.from(
    Array(layout === "week" ? 7 : layout === "day" ? 1 : 0).keys(),
  );

  const appointments = useSelector((state) => state?.appointments?.data) || [];
  const calendarBlocks =
    useSelector((state) => state?.calendarBlocks?.data) || [];
  const rooms = useSelector((state) => state?.rooms?.data) || [];

  const scheduleState = rooms.find(
    (room) => room.id === selectedRoom,
  )?.agendaConfigurations;

  const getEventData = (day) => {
    const monthEvents =
      (appointments &&
        [...appointments].sort((a, b) => {
          return new Date(a.begin).getTime() - new Date(b.begin).getTime();
        })) ||
      [];

    const dayEvents = monthEvents.filter(
      (event) =>
        event.begin &&
        format(new Date(event.begin), "yyyyMMdd", { locale: ptBR }) ===
          format(day, "yyyyMMdd", { locale: ptBR }),
    );
    const dayHoursEvents = dayEvents
      .map((event) => new Date(event.begin).getHours())
      .sort((numberA, numberB) => numberA - numberB);

    const eventsByHour = dayHoursEvents.reduce((acc, hour) => {
      const len = dayHoursEvents.filter(
        (eventHour) => eventHour === hour,
      ).length;
      !acc.some((accItem) => accItem.hour === hour) && acc.push({ hour, len });
      return acc;
    }, []);

    const markers = eventsByHour.map((evHour) => {
      return dayEvents
        .filter((event) => new Date(event.begin).getHours() === evHour.hour)
        .map((event, index) => (
          <EventMark
            key={`event-${event.id}`}
            calendarEvent={event}
            sq={index}
            len={evHour.len}
          />
        ));
    });

    return markers;
  };

  const getBlockData = (day) => {
    const dayBlocks = (calendarBlocks || []).filter(
      (block) =>
        format(new Date(block.initialTime), "yyyyMMdd", { locale: ptBR }) ===
        format(day, "yyyyMMdd", { locale: ptBR }),
    );

    const sortedBlocks = dayBlocks.sort(
      (a, b) => new Date(a.initialTime) - new Date(b.initialTime),
    );
    const blockHoursEvents = sortedBlocks
      .map((block) => new Date(block.initialTime).getHours())
      .sort((numberA, numberB) => numberA - numberB);

    const eventsByHour = blockHoursEvents.reduce((acc, hour) => {
      const len = blockHoursEvents.filter(
        (eventHour) => eventHour === hour,
      ).length;
      !acc.some((accItem) => accItem.hour === hour) && acc.push({ hour, len });
      return acc;
    }, []);

    const blockMarkers = eventsByHour.map((evHour) => {
      return sortedBlocks
        .filter(
          (block) => new Date(block.initialTime).getHours() === evHour.hour,
        )
        .map((block, index) => (
          <EventMark
            key={`block-${block.id}`}
            calendarEvent={{
              id: block.id,
              begin: new Date(block.initialTime),
              end: new Date(block.endTime),
              title: "Bloqueado",
              status: "BLOCKED",
              room: null,
              client: null,
            }}
            sq={index}
            len={evHour.len}
          />
        ));
    });

    return blockMarkers;
  };

  const CurrentTimeMark = (props) => {
    const { marginTop = -1000 } = props;
    return (
      <>
        <div
          className={classes.currentTimeDot}
          style={{ marginTop: marginTop - 5 }}
        />
        <div
          className={classes.currentTimeLine}
          style={{ marginTop: marginTop }}
        />
      </>
    );
  };

  const onDrop = () => {
    if (location.pathname === "/calendario") return;
    const eventID = draggingEventId;

    const eventMarkGhost = document.querySelector("[data-ghost]");
    if (!eventMarkGhost) return false;

    const eventBeginDate = new Date(eventMarkGhost.dataset.date);
    if (!eventBeginDate) return;

    const eventDuration = dayjs(calendarEvent.end).diff(
      dayjs(calendarEvent.date),
      "minutes",
    );
    const eventDurationMillis = eventDuration * 60000;

    const adjustedInitialDate = format(
      new Date(eventBeginDate.getTime()),
      "yyyy/MM/dd HH:mm:ss",
      { locale: ptBR },
    );
    const adjustedEndDate = format(
      new Date(eventBeginDate.getTime() + eventDurationMillis),
      "yyyy/MM/dd HH:mm:ss",
      { locale: ptBR },
    );

    appointmentService.update(eventID, {
      dateAndTime: adjustedInitialDate,
      endTime: adjustedEndDate,
    });

    setStateCalendar({ ...stateCalendar, draggingEventId: -1 });
  };

  const [, drop] = useDrop({
    accept: "box",
    drop() {
      if (location.pathname !== "/calendario") {
        return undefined;
      }
    },
  });

  const translateDay = {
    "SEGUNDA-FEIRA": "MONDAY",
    "TERÇA-FEIRA": "TUESDAY",
    "QUARTA-FEIRA": "WEDNESDAY",
    "QUINTA-FEIRA": "THURSDAY",
    "SEXTA-FEIRA": "FRIDAY",
    SÁBADO: "SATURDAY",
    DOMINGO: "SUNDAY",
  };

  const isAgendaOpen = (day) => {
    const dayOfWeek = format(day, "EEEE", { locale: ptBR }).toUpperCase();
    const currentBlock = scheduleState?.find(
      (block) => block.day === translateDay[dayOfWeek],
    );

    if (!currentBlock || !currentBlock.isActive) return false;

    const [startHour, startMinutes] = currentBlock.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinutes] = currentBlock.endTime.split(":").map(Number);

    const initTime = dayjs(day).startOf("day").toDate();
    const startTime = dayjs(day)
      .set("hour", startHour)
      .set("minute", startMinutes);
    const endTime = dayjs(day).set("hour", endHour).set("minute", endMinutes);

    const position = differenceInMinutes(startTime.toDate(), initTime);
    const duration = differenceInMinutes(endTime.toDate(), startTime.toDate());

    return { position, duration };
  };

  const viewLayoutEl = useMemo(() => {
    return viewLayout.map((index) => {
      const day = layout === "week" ? selectedWeek[index] : selectedDate;

      const isToday =
        format(day, "ddMMyyyy", { locale: ptBR }) ===
        format(new Date(), "ddMMyyyy", { locale: ptBR });
      const eventsOfDay = getEventData(day);
      const blocksOfDay = getBlockData(day);

      const agendaOpenTime = isAgendaOpen(day);

      return (
        <Grid
          item
          xs
          id={`day${index + 1}`}
          data-group="day-column"
          data-date={day}
          className={classes.dayContainer}
          key={`board-day-column-${layout}-${selectedWeekIndex}-${day}-${index}`}
          onClick={(eventEl) =>
            createEditEvent({
              eventEl,
              defaultEventDuration,
              stateCalendar,
              setStateCalendar,
            })
          }
        >
          {isToday && <CurrentTimeMark marginTop={currentTimePosition} />}

          {((eventsOfDay && eventsOfDay.length > 0) ||
            (blocksOfDay && blocksOfDay.length > 0)) && (
            <div className={classes.eventsContainer} data-date={day}>
              {eventsOfDay}
              {blocksOfDay}
            </div>
          )}

          {!agendaOpenTime && (
            <div
              style={{ left: 0, right: 0, height: `100%` }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className={`${classes.fixedEvent} ${classes.dayClosed}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Agenda fechada
              </div>
            </div>
          )}
          {agendaOpenTime && (
            <>
              <div
                style={{
                  left: 0,
                  right: 0,
                  height: `${agendaOpenTime.position}px`,
                  width: "100%",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className={`${classes.fixedEvent} ${classes.initialDayClosed}`}
                  style={{
                    height: `${agendaOpenTime.position}px`,
                  }}
                >
                  Agenda fechada
                </div>
              </div>
              <div
                style={{
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: `${agendaOpenTime.position + agendaOpenTime.duration}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className={`${classes.fixedEvent} ${classes.finalDayClosed}`}
                  style={{
                    top: `${agendaOpenTime.position + agendaOpenTime.duration}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Agenda fechada
                </div>
              </div>
            </>
          )}
        </Grid>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    classes,
    defaultEventDuration,
    getEventData,
    getBlockData,
    layout,
    selectedDate,
    selectedWeek,
    selectedWeekIndex,
    viewLayout,
    appointments,
    calendarBlocks,
  ]);

  return (
    <Grid
      ref={drop}
      onDrop={onDrop}
      container
      spacing={0}
      direction="row"
      justify="center"
      alignItems="flex-start"
      className={classes.board}
    >
      <LineDivisor />
      <div className={classes.columnDivisor} />
      {viewLayoutEl}
    </Grid>
  );
}

export default CalendarBoard;
