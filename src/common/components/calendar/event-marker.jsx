import { useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { format, differenceInMinutes } from "date-fns";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ptBR } from "date-fns/locale";

import { CalendarContext } from "./context/calendar-context";
import clsx from "clsx";

const PREFIX = "EventMark";

const classes = {
  marker: `${PREFIX}-marker`,
  markerText: `${PREFIX}-markerText`,
  beginEnd: `${PREFIX}-beginEnd`,
  extraInfo: `${PREFIX}-extraInfo`,
  content: `${PREFIX}-content`,
  formControl: `${PREFIX}-formControl`,
  formControlFlex: `${PREFIX}-formControlFlex`,
  icon: `${PREFIX}-icon`,
  optionsBar: `${PREFIX}-optionsBar`,
  markerPending: `${PREFIX}-markerPending`,
  markerScheduled: `${PREFIX}-markerScheduled`,
  markerCompleted: `${PREFIX}-markerCompleted`,
  markerCancelled: `${PREFIX}-markerCancelled`,
  markerRescheduled: `${PREFIX}-markerRescheduled`,
  markerNoShow: `${PREFIX}-markerNoShow`,
  markerBlocked: `${PREFIX}-markerBlocked`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.marker}`]: {
    overflow: "hidden",
    position: "absolute",
    color: "#FFF",
    padding: "1px 3px",
    borderRadius: 3,
    borderTopRightRadius: 3,
    cursor: "pointer",
    zIndex: 1,
    "&:hover": {
      zIndex: 1,
    },
    minHeight: 24,
  },

  [`& .${classes.markerText}`]: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    [theme.breakpoints.down("md")]: {
      fontSize: 9,
    },
  },

  [`& .${classes.beginEnd}`]: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  [`& .${classes.extraInfo}`]: {
    fontSize: 7,
  },

  [`& .${classes.content}`]: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
  },

  [`& .${classes.formControl}`]: {
    marginTop: theme.spacing(2),
  },

  [`& .${classes.formControlFlex}`]: {
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.optionsBar}`]: {
    marginTop: theme.spacing(-1),
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  [`&.${classes.markerPending}`]: {
    color: "#000",
    backgroundColor: "#d2c619d1",
    border: "1px solid #a79c06d1",
    "&:hover": {
      border: "1px solid #a79c06d1",
      backgroundColor: "#d2c619d1",
    },
  },

  [`&.${classes.markerScheduled}`]: {
    backgroundColor: "#1976D2d1",
    border: "1px solid #1257d8c3",
    "&:hover": {
      border: "1px solid #1257d8c3",
      backgroundColor: "#1976D2d1",
    },
  },

  [`&.${classes.markerCompleted}`]: {
    backgroundColor: "#008f18",
    border: "1px solid #006400",
    "&:hover": {
      border: "1px solid #006400",
      backgroundColor: "#006400",
    },
  },

  [`&.${classes.markerCancelled}`]: {
    backgroundColor: "#FF0000",
    border: "1px solid #8B0000",
    "&:hover": {
      border: "1px solid #8B0000",
      backgroundColor: "#8B0000",
    },
  },

  [`&.${classes.markerRescheduled}`]: {
    backgroundColor: "#FFA500",
    border: "1px solid #c28108",
    "&:hover": {
      border: "1px solid #c28108",
      backgroundColor: "#c28108",
    },
  },

  [`&.${classes.markerNoShow}`]: {
    backgroundColor: "#808080",
    border: "1px solid #696969",
    "&:hover": {
      border: "1px solid #696969",
      backgroundColor: "#696969",
    },
  },

  [`&.${classes.markerBlocked}`]: {
    backgroundColor: "#444",
    border: "1px solid #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      border: "1px solid #333",
      backgroundColor: "#555",
    },
  },
}));

function getStyles(left, top, isDragging, partOfStyle) {
  const transform = `translate3d(${left}px, ${top}px, 0)`;

  return {
    position: "absolute",
    transform: isDragging ? transform : "initial",
    WebkitTransform: isDragging ? transform : "initial",
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
    ...partOfStyle,
  };
}

function EventMark(props) {
  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const { defaultEventDuration } = stateCalendar;

  const { calendarEvent, len, sq } = props;

  // Quando for um bloco, não haverá cliente/serviço, então usamos dados padrão.
  const clientName = calendarEvent.client?.name || "";
  const roomName = calendarEvent.room?.name || "";
  const title =
    calendarEvent.title ||
    (calendarEvent.status === "BLOCKED" ? "Bloqueado" : "");

  const beginDate = calendarEvent.begin;
  const endDate = calendarEvent.end;

  const titleFormatted = clientName ? `Solicitante: ${clientName}` : title;
  const roomFormatted = roomName ? `Sala: ${roomName}` : "";
  const descriptionFormatted = calendarEvent.description
    ? `Descrição: ${calendarEvent.description}`
    : "";

  const currentDay = beginDate;
  const initTime = new Date(
    format(currentDay, "yyyy/MM/dd 0:0:0", { locale: ptBR }),
  );
  const position = differenceInMinutes(currentDay, initTime) + 2;
  const duration = differenceInMinutes(endDate, beginDate);

  const viewEvent = (props) => {
    const { calendarEvent } = props;

    if (calendarEvent.status === "BLOCKED") {
      return;
    }

    let eventBeginDate = new Date(calendarEvent.begin);
    let eventEndDate = new Date(calendarEvent.end);

    let beginTime = format(eventBeginDate, "H:mm", { locale: ptBR });
    let endTime = format(eventEndDate, "H:mm", { locale: ptBR });

    let room = calendarEvent?.room?.id;
    let client = calendarEvent?.client?.id;
    let clientName = calendarEvent?.client?.name;
    let status = calendarEvent?.status;
    let isPaid = calendarEvent?.isPaid;
    let description = calendarEvent?.description;

    setStateCalendar({
      ...stateCalendar,
      openDialog: true,
      eventBeginDate: eventBeginDate,
      eventBeginTime: { value: beginTime, label: beginTime },
      eventEndTime: { value: endTime, label: endTime },
      room,
      client,
      clientName,
      status,
      isPaid,
      description,
      eventID: (calendarEvent && calendarEvent.id) || 0,
    });
  };

  const isBlocked = calendarEvent.status === "BLOCKED";
  const [{ isDragging }, drag, preview] = useDrag({
    type: "box",
    canDrag: !isBlocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview]);

  const left = (100 / len) * sq + 1;

  const partOfStyle = {
    marginTop: position,
    height: duration,
    width: `calc(100% - 2px)`,
    marginLeft: 0,
  };

  const onDragStart = (eventEl, calendarEvent) => {
    // Caso seja bloco, desabilite arrastar se assim desejar
    if (calendarEvent.status === "BLOCKED") return;

    const width = eventEl.currentTarget.parentElement.parentElement.offsetWidth;
    const height = eventEl.currentTarget.clientHeight + 5;

    setStateCalendar({
      ...stateCalendar,
      startDragging: true,
      draggingEventId: calendarEvent.id,
      calendarEvent,
      ghostProperties: { width, height },
    });
  };

  return (
    <Root
      id={calendarEvent.id}
      className={clsx(classes.marker, {
        [classes.markerPending]: calendarEvent.status === "PENDING",
        [classes.markerScheduled]: calendarEvent.status === "SCHEDULED",
        [classes.markerCompleted]: calendarEvent.status === "COMPLETED",
        [classes.markerCancelled]: calendarEvent.status === "CANCELLED",
        [classes.markerRescheduled]: calendarEvent.status === "RESCHEDULED",
        [classes.markerNoShow]: calendarEvent.status === "NO_SHOW",
        [classes.markerBlocked]: calendarEvent.status === "BLOCKED",
      })}
      ref={isBlocked ? null : drag}
      onDragStart={(eventEl) => onDragStart(eventEl, calendarEvent)}
      style={getStyles(left, position / 57 - 2, isDragging, partOfStyle)}
      onClick={(eventEl) => {
        if (calendarEvent.status !== "BLOCKED") {
          viewEvent({
            eventEl,
            calendarEvent,
            defaultEventDuration,
            stateCalendar,
            setStateCalendar,
          });
        } else {
          setStateCalendar({
            ...stateCalendar,
            blockDialogOpen: true,
            eventID: calendarEvent.id,
            eventBeginDate: beginDate,
            eventEndDate: endDate,
          });
        }
      }}
    >
      <div className={`${classes.beginEnd} event-marker`}>
        <span>{titleFormatted}</span>
        <span>{roomFormatted}</span>
        <span>{descriptionFormatted}</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-2px",
          width: "100%",
          height: "5px",
        }}
      />
    </Root>
  );
}

export default EventMark;
