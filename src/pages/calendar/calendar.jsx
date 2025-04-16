import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { CssBaseline, useTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  subWeeks,
  subDays,
} from "date-fns";

import roomsService from "../../domains/room/roomService";
import notification from "../../common/utils/notification";
import LoggedLayout from "../../common/layouts/loggedLayout/loggedLayout";
import CalendarMain from "../../common/components/calendar/calendar-main";
import CalendarDrawer from "../../common/components/calendar/calendar-drawer";
import CalendarToolbar from "../../common/components/calendar/calendar-toolbar";
import LoadingOverlay from "../../common/components/LoadingOverlay/LoadingOverlay";
import BlockDialog from "../../common/components/calendar/calendarDialog/blockDialog";
import { CalendarContext } from "../../common/components/calendar/context/calendar-context";
import CalendarEventDialog from "../../common/components/calendar/calendarDialog/calendarDialog";
import ExportReservationDialog from "../../common/components/calendar/calendarDialog/exportDialog/exportDialog";

import { refreshCalendarSuccess } from "../../domains/appointment/appointment.constants";

const PREFIX = "Calendar";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledCalendarContextProvider = styled(CalendarContext.Provider)(() => ({
  [`& .${classes.root}`]: {
    display: "flex",
    height: "100%",
    width: "100%",
    boxShadow:
      "0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)",
  },
}));

const defaultEventDuration = 60; // em minutos
const initialSelectedDate = new Date();
const initialLayout = "day";
const initialOpenDialog = false;
const initialOpenViewDialog = false;

const Calendar = () => {
  const theme = useTheme();
  const isLoading = useSelector((state) => state.appointments.isLoading);
  const auth = useSelector((state) => state.auth);

  const [stateCalendar, setStateCalendar] = useState({
    actions: "",
    allowFullScreen: false,
    calendarEvent: {},
    content: "",
    defaultEventDuration,
    draggingEventId: -1,
    eventBeginDate: null,
    eventBeginTime: { value: null, label: null },
    eventDialogMaxWidth: "md",
    eventEndDate: null,
    eventEndTime: { value: null, label: null },
    fullscreen: false,
    ghostProperties: { width: 0, height: 0, date: new Date() },
    layout: initialLayout,
    modal: false,
    openDialog: initialOpenDialog,
    openViewDialog: initialOpenViewDialog,
    selectedDate: initialSelectedDate,
    startDragging: false,
    title: "",
    withCloseIcon: true,
    miniCalendarOpen: false,
  });

  const [runAnimation, setRunAnimation] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [getScheduleData, setGetScheduleData] = useState(null);
  const [openExportDialog, setOpenExportDialog] = useState(false);

  // Estados para as salas
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Função para buscar as salas
  const fetchRooms = useCallback(
    async (room = selectedRoom) => {
      try {
        if (!auth?.user?.businessId) return;
        const data = await roomsService.read({
          businessId: auth.user.businessId,
          page: 1,
          limit: 1000,
        });
        setRooms(data);
        if (data.length > 0 && !room) {
          setSelectedRoom(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    },
    [auth?.user?.businessId, selectedRoom],
  );

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Atualiza o calendário sempre que a sala selecionada mudar
  useEffect(() => {
    if (selectedRoom) {
      refreshCalendar();
      setStateCalendar({ ...stateCalendar, selectedRoom: selectedRoom });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const goToToday = () => {
    setRunAnimation(false);
    setStateCalendar({ ...stateCalendar, selectedDate: new Date() });
  };

  const next = () => {
    setRunAnimation(false);
    let newDate;
    switch (stateCalendar.layout) {
      case "week":
        newDate = addWeeks(stateCalendar.selectedDate, 1);
        break;
      case "day":
        newDate = addDays(stateCalendar.selectedDate, 1);
        break;
      default:
        newDate = addMonths(stateCalendar.selectedDate, 1);
        break;
    }
    setStateCalendar({ ...stateCalendar, selectedDate: newDate });
  };

  const previous = () => {
    setRunAnimation(false);
    let newDate;
    switch (stateCalendar.layout) {
      case "week":
        newDate = subWeeks(stateCalendar.selectedDate, 1);
        break;
      case "day":
        newDate = subDays(stateCalendar.selectedDate, 1);
        break;
      default:
        newDate = subMonths(stateCalendar.selectedDate, 1);
        break;
    }
    setStateCalendar({ ...stateCalendar, selectedDate: newDate });
  };

  const openCalendar = () => {
    setStateCalendar({
      ...stateCalendar,
      miniCalendarOpen: !stateCalendar.miniCalendarOpen,
    });
  };

  const handleLayoutChange = ({ value }) => {
    setStateCalendar({ ...stateCalendar, layout: value });
  };

  const handleRoomChange = (event) => {
    const selectedRoomId = event.target.value;
    setSelectedRoom(selectedRoomId);
  };

  const refreshCalendar = async (needNotification = true) => {
    if (getScheduleData && selectedRoom) {
      const {
        appointments: refreshedAppointments,
        calendarBlocks: refreshedCalendarBlocks,
      } = await getScheduleData(selectedRoom);
      if (
        refreshedAppointments &&
        refreshedCalendarBlocks &&
        needNotification
      ) {
        notification(refreshCalendarSuccess);
      }
    }
  };

  return (
    <LoggedLayout>
      <StyledCalendarContextProvider
        value={{ stateCalendar, setStateCalendar }}
      >
        <ThemeProvider theme={theme}>
          <div
            className={classes.root}
            style={{
              overflow: "hidden",
              borderRadius: "4px",
              boxShadow:
                "0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)",
            }}
          >
            <CssBaseline />
            <CalendarToolbar
              openCalendar={openCalendar}
              miniCalendarOpen={stateCalendar.miniCalendarOpen}
              goToToday={goToToday}
              next={next}
              previous={previous}
              open={drawerOpen}
              handleDrawerOpen={handleDrawerOpen}
              handleDrawerClose={handleDrawerClose}
              handleLayoutChange={handleLayoutChange}
              refreshCalendar={refreshCalendar}
              isLoading={isLoading}
              // Propriedades para seleção de sala
              selectedRoom={selectedRoom}
              rooms={rooms}
              handleRoomChange={handleRoomChange}
              setOpenExportDialog={setOpenExportDialog}
            />

            <div
              style={{ display: "flex", width: "100%", position: "relative" }}
            >
              <LoadingOverlay isLoading={isLoading} />
              {stateCalendar.layout !== "list" && (
                <CalendarDrawer
                  selectedDate={stateCalendar.selectedDate}
                  next={next}
                  previous={previous}
                  open={drawerOpen}
                  layout={"month"}
                  miniCalendarOpen={stateCalendar.miniCalendarOpen}
                />
              )}
              <CalendarMain
                isLoading={isLoading}
                open={drawerOpen}
                runAnimation={runAnimation}
                setGetScheduleData={setGetScheduleData}
                fetchRooms={fetchRooms}
                selectedRoom={selectedRoom}
              />
              <CalendarEventDialog
                isLoading={isLoading}
                refreshCalendar={refreshCalendar}
                roomsList={rooms}
              />
              <ExportReservationDialog
                open={openExportDialog}
                setOpenExportDialog={setOpenExportDialog}
              />
              <BlockDialog isLoading={isLoading} />
            </div>
          </div>
        </ThemeProvider>
      </StyledCalendarContextProvider>
    </LoggedLayout>
  );
};

export default Calendar;
