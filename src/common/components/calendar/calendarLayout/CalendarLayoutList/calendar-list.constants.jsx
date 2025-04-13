import { styled } from "@mui/material/styles";
import { FaRegCircleQuestion } from "react-icons/fa6";

import { IconButton } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { format } from "date-fns";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(53, 53, 53, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

export const columnsCalendarList = [
  {
    id: "member",
    label: "Membro",
    minWidth: 170,
    align: "left",
  },
  {
    id: "room",
    label: "Sala",
    minWidth: 170,
    align: "center",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "center",
  },
  {
    id: "date",
    label: "Data do agendamento",
    minWidth: 170,
    align: "center",
  },
  {
    id: "createdAt",
    label: "Data de criação",
    minWidth: 170,
    align: "center",
  },
];

const statusList = {
  PENDING: "Pendente",
  SCHEDULED: "Agendado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

function createData(name, room, status, begin, end, createdAt) {
  const beginDate = format(begin, "dd/MM/yyyy");
  const beginTime = format(begin, "HH:mm");
  const endTime = format(end, "HH:mm");

  const createdAtFormatted = format(createdAt, "dd/MM/yyyy");
  const statusFormatted = statusList[status];
  const date = `Dia ${beginDate} - ${beginTime} às ${endTime}`;

  return {
    member: name,
    room,
    status: statusFormatted,
    date,
    createdAt: createdAtFormatted,
  };
}

export const rowsCalendarList = (calendarList = []) => {
  return calendarList.map((calendar) =>
    createData(
      calendar?.client?.name,
      calendar?.room?.name,
      calendar?.status,
      calendar?.begin,
      calendar?.end,
      calendar?.createdAt
    )
  );
};
