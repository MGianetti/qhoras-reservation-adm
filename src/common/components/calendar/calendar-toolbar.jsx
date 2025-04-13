import { useContext, useMemo } from "react";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import {
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";

import {
  MdOutlineViewModule,
  MdOutlineViewWeek,
  MdOutlineToday,
  MdOutlineCalendarViewDay,
  MdOutlineFormatListBulleted,
} from "react-icons/md";
import { FaList } from "react-icons/fa6";

import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from "react-icons/io";

import { styled } from "@mui/material/styles";

import { CalendarContext } from "./context/calendar-context";
import getWeekDays from "./common/getWeekDays";
import getSelectedWeekIndex from "./common/getSelectedWeekIndex";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";

const PREFIX = "CalendarToolbar";
const drawerWidth = 260;

const StyledRoot = styled("div")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: "#fff",
  width: "100%",
  borderBottom: "1px solid #E0E0E0",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [`&.${PREFIX}-appBarShift`]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  paddingLeft: theme.spacing(1),
  fontWeight: 400,
  fontSize: theme.spacing(3),
  textTransform: "capitalize",
  [theme.breakpoints.down("md")]: {
    fontSize: 14,
  },
}));

const StyledTooltip = styled(Tooltip)(() => ({
  marginTop: 2,
}));

const useStyles = makeStyles((theme) =>
  createStyles({
    miniCalendarOpen: {
      [theme.breakpoints.up("md")]: {
        display: "none !important",
      },
    },
    miniCalendarOpenSelected: {
      [theme.breakpoints.down("md")]: {
        backgroundColor: "#e9d3f8 !important",
      },
    },
    miniCalendarToday: {
      [theme.breakpoints.down("md")]: {
        display: "none !important",
      },
    },
    navigation: {
      [theme.breakpoints.down("md")]: {
        display: "none !important",
      },
    },
    roomSelector: {
      [theme.breakpoints.down("sm")]: {
        display: "none !important",
      },
      [theme.breakpoints.up("sm")]: {
        margin: "8px 16px",
        maxWidth: "400px",
        marginLeft: "auto",
      },
    },
    roomSelectorSmall: {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        display: "block",
      },
      [theme.breakpoints.up("sm")]: {
        display: "none !important",
      },
    },
  }),
);

function CalendarToolbar(props) {
  const {
    goToToday,
    next,
    previous,
    openCalendar,
    miniCalendarOpen,
    refreshCalendar,
    isLoading,
    selectedRoom,
    rooms,
    handleRoomChange,
  } = props;

  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const { selectedDate, layout } = stateCalendar;
  const classes = useStyles();

  return useMemo(() => {
    const setLayout = ({ option }) => {
      setStateCalendar({ ...stateCalendar, layout: option });
      localStorage.setItem("calendarLayout", option);
    };

    const weeks = getWeekDays(selectedDate, 7);
    const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0);
    const selectedWeek = weeks[selectedWeekIndex];

    const firstDayOfWeekMonth = format(selectedWeek[0], "MMM", {
      locale: ptBR,
    });
    const lastDayOfWeekMonth = format(selectedWeek[6], "MMM", { locale: ptBR });
    const firstDayOfWeekYear = format(selectedWeek[0], "yyyy", {
      locale: ptBR,
    });
    const lastDayOfWeekYear = format(selectedWeek[6], "yyyy", { locale: ptBR });

    const showMonthsAndYears =
      layout === "week" &&
      firstDayOfWeekMonth !== lastDayOfWeekMonth &&
      firstDayOfWeekYear !== lastDayOfWeekYear
        ? `${firstDayOfWeekMonth} ${firstDayOfWeekYear} - ${lastDayOfWeekMonth} ${lastDayOfWeekYear}`
        : false;

    const showMonthsAndYear =
      !showMonthsAndYears &&
      layout === "week" &&
      firstDayOfWeekMonth !== lastDayOfWeekMonth
        ? `${firstDayOfWeekMonth} - ${lastDayOfWeekMonth} ${firstDayOfWeekYear}`
        : false;
    const showMonthAndYear = !showMonthsAndYear
      ? format(selectedDate, "MMMM yyyy", { locale: ptBR })
      : false;

    return (
      <StyledRoot>
        <Toolbar>
          <></>
          {layout !== "list" ? (
            <>
              <StyledTooltip
                title="Hoje"
                className={classes.miniCalendarToday}
                style={{ marginRight: 0 }}
              >
                <StyledMenuButton
                  disabled={isLoading}
                  color="inherit"
                  aria-label="Hoje"
                  onClick={goToToday}
                  edge="start"
                >
                  <MdOutlineToday />
                </StyledMenuButton>
              </StyledTooltip>

              <StyledTooltip
                title="Calendário"
                className={clsx(classes.miniCalendarOpen, {
                  [classes.miniCalendarOpenSelected]: miniCalendarOpen,
                })}
                style={{ marginRight: 0 }}
              >
                <StyledMenuButton
                  color="inherit"
                  aria-label="Calendário"
                  disabled={isLoading}
                  onClick={openCalendar}
                  edge="start"
                >
                  <MdOutlineToday />
                </StyledMenuButton>
              </StyledTooltip>

              <StyledTooltip title="Atualizar" style={{ marginRight: "16px" }}>
                <IconButton
                  disabled={isLoading}
                  color="inherit"
                  onClick={refreshCalendar}
                >
                  <IoMdRefresh />
                </IconButton>
              </StyledTooltip>

              <div className={classes.navigation}>
                <StyledTooltip title="Anterior">
                  <IconButton disabled={isLoading} onClick={previous}>
                    <IoIosArrowBack />
                  </IconButton>
                </StyledTooltip>

                <StyledTooltip title="Próximo">
                  <IconButton disabled={isLoading} onClick={next}>
                    <IoIosArrowForward />
                  </IconButton>
                </StyledTooltip>
              </div>

              <StyledTitle>
                {showMonthsAndYears || showMonthsAndYear || showMonthAndYear}
              </StyledTitle>

              {/* Seletor de Sala para telas maiores */}
              <FormControl size="small" className={classes.roomSelector}>
                <InputLabel>Sala</InputLabel>
                <Select
                  value={selectedRoom || ""}
                  label="Sala"
                  onChange={handleRoomChange}
                >
                  {Array.isArray(rooms) &&
                    rooms
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <h3 style={{ width: "100%", fontWeight: 500 }}>
              {" "}
              Lista de Eventos
            </h3>
          )}

          <StyledTooltip title="Visualização Diária">
            <IconButton
              disabled={isLoading}
              color="inherit"
              aria-label="Visualização Diária"
              onClick={() => setLayout({ option: "day" })}
              edge="start"
            >
              <MdOutlineCalendarViewDay />
            </IconButton>
          </StyledTooltip>

          <StyledTooltip title="Visualização Semanal">
            <IconButton
              disabled={isLoading}
              color="inherit"
              aria-label="Visualização Semanal"
              onClick={() => setLayout({ option: "week" })}
              edge="start"
            >
              <MdOutlineViewWeek />
            </IconButton>
          </StyledTooltip>

          <StyledTooltip title="Visualização Mensal">
            <IconButton
              disabled={isLoading}
              color="inherit"
              aria-label="Visualização Mensal"
              onClick={() => setLayout({ option: "month" })}
              edge="start"
            >
              <MdOutlineViewModule />
            </IconButton>
          </StyledTooltip>

          <StyledTooltip title="Visualização Por Lista">
            <IconButton
              disabled={isLoading}
              color="inherit"
              aria-label="Visualização Por Lista"
              onClick={() => setLayout({ option: "list" })}
              edge="start"
            >
              <FaList size={16} style={{ marginLeft: "3px" }} />
            </IconButton>
          </StyledTooltip>
        </Toolbar>

        {/* Seletor de Sala para telas pequenas */}
        <FormControl size="small" className={classes.roomSelectorSmall}>
          <InputLabel>Sala</InputLabel>
          <Select
            value={selectedRoom || ""}
            label="Sala"
            onChange={handleRoomChange}
            style={{ width: "100%" }}
          >
            {Array.isArray(rooms) &&
              rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </StyledRoot>
    );
  }, [
    selectedDate,
    layout,
    goToToday,
    next,
    previous,
    isLoading,
    openCalendar,
    miniCalendarOpen,
    refreshCalendar,
    selectedRoom,
    rooms,
    handleRoomChange,
    setStateCalendar,
    stateCalendar,
  ]);
}

export default CalendarToolbar;
