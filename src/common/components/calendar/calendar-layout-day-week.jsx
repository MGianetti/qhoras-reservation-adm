import { useContext, useMemo } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/styles";

import { CalendarContext } from "./context/calendar-context";
import CalendarHeader from "./calendar-header";
import CalendarBoard from "./calendar-board";
import CalendarBoardDragLayer from "./calendar-board-drag-layer";
import { useLocation } from "react-router-dom";

function CalendarLayoutDayWeek(props) {
  const theme = useTheme();
  const { selectedWeekIndex, selectedWeek, selectedRoom } = props;

  const { stateCalendar } = useContext(CalendarContext);
  const { selectedDate, layout, defaultEventDuration } = stateCalendar;
  const location = useLocation();

  return useMemo(() => {
    return (
      <div
        style={{
          flexGrow: 1,
          height: "calc(100vh - 64px - 98px)",
          overflow: "hidden",
          paddingTop: 1,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CalendarHeader
          selectedWeekIndex={selectedWeekIndex}
          selectedWeek={selectedWeek}
        />

        <Grid
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="stretch"
          sx={{
            height: "calc(100% - 25px)",
            overflowX: "hidden",
            overflowY: "scroll",
            alignItems: "stretch",
            "&:before": {
              backgroundImage:
                "linear-gradient(to right,white,rgba(255,255,255,0))",
              content: "''",
              height: 2,
              position: "absolute",
              width: 80,
              zIndex: 1,
            },
          }}
        >
          <Box
            item
            xs={1}
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: "transparent",
              height: "auto",
              overflowY: "hidden",
              flex: "none",
              display: "flex",
              alignItems: "flex-start",
              minWidth: 40,
              maxWidth: 40,
              marginTop: "-8px",
            }}
          >
            <div
              style={{
                position: "relative",
                WebkitBoxSizing: "border-box",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 60,
                  paddingRight: 8,
                  textAlign: "right",
                  color: "#70757a",
                  fontSize: 12,
                }}
              />
              {Array.from(Array(23).keys()).map((index) => {
                return (
                  <div
                    style={{
                      position: "relative",
                      height: 60,
                      paddingRight: 8,
                      textAlign: "right",
                      color: "#70757a",
                      fontSize: 12,
                    }}
                    key={`time-${index}`}
                  >
                    <span>{index + 1}</span>
                  </div>
                );
              })}
              <div
                style={{
                  position: "relative",
                  height: 60,
                  paddingRight: 8,
                  textAlign: "right",
                  color: "#70757a",
                  fontSize: 12,
                }}
              />
            </div>
          </Box>

          <Grid
            item
            xs
            sx={{
              // overflowX: 'auto',
              // overflowY: 'scroll',
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <DndProvider backend={HTML5Backend}>
              <CalendarBoard
                selectedWeekIndex={selectedWeekIndex}
                selectedWeek={selectedWeek}
                selectedRoom={selectedRoom}
              />
              {location.pathname !== "/calendario" && (
                <CalendarBoardDragLayer />
              )}
            </DndProvider>
          </Grid>
        </Grid>
      </div>
    );
  }, [
    selectedDate,
    layout,
    defaultEventDuration,
    selectedWeek,
    selectedWeekIndex,
  ]);
}

export default CalendarLayoutDayWeek;
