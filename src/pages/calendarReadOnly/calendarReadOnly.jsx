import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { addWeeks, subWeeks } from "date-fns";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useTheme } from "@mui/material";
import { useEffect, useState, useCallback } from "react";

import roomsService from "../../domains/room/roomService";
import notification from "../../common/utils/notification";
import CalendarMain from "../../common/components/calendar/calendar-main";
import CalendarToolbar from "../../common/components/calendar/calendar-toolbar";
import LoadingOverlay from "../../common/components/LoadingOverlay/LoadingOverlay";
import LoggedOutLayout from "../../common/layouts/loggedOutLayout/loggedOutLayout";
import { CalendarContext } from "../../common/components/calendar/context/calendar-context";

import { refreshCalendarSuccess } from "../../domains/appointment/appointment.constants";
import { useLocation } from "react-router-dom";
import calendarReadOnlyService from "../../domains/calendarReadOnly/calendarReadOnlyService";

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

const initialSelectedDate = new Date();
const initialLayout = "week";
const initialOpenDialog = false;
const initialOpenViewDialog = false;

const CalendarReadOnly = () => {
  const theme = useTheme();
  const isLoading = useSelector((state) => state.appointments.isLoading);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const businessId = searchParams.get("business");

  const [stateCalendar, setStateCalendar] = useState({
    actions: "",
    allowFullScreen: false,
    calendarEvent: {},
    content: "",
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

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = useCallback(
    async (room = selectedRoom) => {
      try {
        if (!businessId) return;
        const data = await calendarReadOnlyService.readRoom({
          businessId: businessId,
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
    [businessId, selectedRoom],
  );

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (selectedRoom) {
      refreshCalendar();
      setStateCalendar({ ...stateCalendar, selectedRoom: selectedRoom });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const goToToday = () => {
    setRunAnimation(false);
    setStateCalendar({ ...stateCalendar, selectedDate: new Date() });
  };

  const next = () => {
    setRunAnimation(false);
    let newDate = addWeeks(stateCalendar.selectedDate, 1);

    setStateCalendar({ ...stateCalendar, selectedDate: newDate });
  };

  const previous = () => {
    setRunAnimation(false);
    let newDate = subWeeks(stateCalendar.selectedDate, 1);
    setStateCalendar({ ...stateCalendar, selectedDate: newDate });
  };

  const openCalendar = () => {
    setStateCalendar({
      ...stateCalendar,
      miniCalendarOpen: !stateCalendar.miniCalendarOpen,
    });
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
    <LoggedOutLayout>
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
              handleDrawerOpen={() => setDrawerOpen(true)}
              handleDrawerClose={() => setDrawerOpen(false)}
              handleLayoutChange={() =>
                setStateCalendar({ ...stateCalendar, layout: value })
              }
              refreshCalendar={refreshCalendar}
              isLoading={isLoading}
              selectedRoom={selectedRoom}
              rooms={rooms}
              handleRoomChange={handleRoomChange}
            />

            <div
              style={{ display: "flex", width: "100%", position: "relative" }}
            >
              <LoadingOverlay isLoading={isLoading} />
              <CalendarMain
                isLoading={isLoading}
                open={drawerOpen}
                runAnimation={runAnimation}
                setGetScheduleData={setGetScheduleData}
                fetchRooms={fetchRooms}
                selectedRoom={selectedRoom}
              />
            </div>
          </div>
        </ThemeProvider>
      </StyledCalendarContextProvider>
    </LoggedOutLayout>
  );
};

export default CalendarReadOnly;
