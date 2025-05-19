import {
  format,
  differenceInMinutes,
  getYear,
  getMonth,
  getDate,
  addMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export default function createEditEvent(props) {
  const {
    eventEl,
    defaultEventDuration,
    stateCalendar,
    setStateCalendar,
    calendarEvent = null,
    selectedRoom
  } = props;

  let datasetDate;
  let eventBeginDate;
  let eventEndDate;
  let minutes;
  let beginTime;
  let endTime;

  let title = "";
  let description = "";
  let room = null;
  let client = null;
  let clientName = null;
  let status = "SCHEDULED";
  let isPaid = false;

  if (calendarEvent !== null) {
    eventBeginDate = new Date(calendarEvent.begin);
    eventEndDate = new Date(calendarEvent.end);
    minutes = differenceInMinutes(eventEndDate, eventBeginDate);
    beginTime = format(eventBeginDate, "H:mm", { locale: ptBR });
    endTime = format(eventEndDate, "H:mm", { locale: ptBR });
    title = calendarEvent.title;
    description = calendarEvent.description;

    room = calendarEvent?.room?.id;
    client = calendarEvent?.client?.id;
    clientName = calendarEvent?.client?.name;
    status = calendarEvent?.status;
    description = calendarEvent?.description;
    isPaid = calendarEvent?.isPaid;
  } else {
    if (eventEl.target.dataset.date === undefined) return false;

    datasetDate = new Date(eventEl.target.dataset.date);

    let position = eventEl.clientY - eventEl.target.getBoundingClientRect().top;
    if (Object.keys(eventEl.target.dataset).length === 0) {
      position =
        eventEl.clientY -
        (eventEl.clientY - +eventEl.target.style.marginTop.replace("px", ""));
      datasetDate = new Date(eventEl.target.parentElement.dataset);
    }

    const hour = Math.trunc(position / 60);
    const isHalfHour = Math.trunc(position / 15) % 2 === 0 ? false : true;
    room = selectedRoom;

    const minute = isHalfHour ? 15 : 0;

    eventBeginDate = new Date(
      getYear(datasetDate),
      getMonth(datasetDate),
      getDate(datasetDate),
      hour > 23 ? 23 : hour,
      hour > 23 ? 15 : minute,
    );
    eventEndDate = addMinutes(eventBeginDate, 60);

    minutes = differenceInMinutes(eventEndDate, eventBeginDate);

    beginTime = format(eventBeginDate, "H:mm", { locale: ptBR });
    endTime = format(eventEndDate, "H:mm", { locale: ptBR });
  }

  setStateCalendar({
    ...stateCalendar,
    openDialog: true,
    eventBeginDate: eventBeginDate,
    eventBeginTime: { value: beginTime, label: beginTime },
    eventEndDate: eventEndDate,
    eventEndTime: { value: endTime, label: endTime },
    minutes: minutes,
    eventDialogMaxWidth: "sm",
    eventID: (calendarEvent && calendarEvent.id) || 0,
    title,
    description,
    room,
    client,
    clientName,
    status,
    isPaid,
    calendarEvent,
  });
}
