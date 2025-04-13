import { createPortal } from "react-dom";

import { Paper, ClickAwayListener, Collapse } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CalendarSmall from "./calendar-small";

const useStyles = makeStyles((theme) => ({
  collapseCalendar: {
    position: "absolute",
    zIndex: 1,
  },
  paper: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    maxWidth: 272,
  },
}));

function DatepickerCalendar(props) {
  const classes = useStyles();

  const {
    datepickerValue = new Date(),
    calendarPosition = { top: 0, left: 0 },
    openCalendar,
    handleClickAway,
    handleChangeDateCalendar,
  } = props;

  const popupCalendar = (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Collapse
        in={openCalendar}
        className={classes.collapseCalendar}
        style={{
          top: calendarPosition.top,
          left: calendarPosition.left,
          zIndex: 1300,
        }}
      >
        <Paper className={classes.paper}>
          <CalendarSmall
            isDatepicker={true}
            datepickerOnChange={handleChangeDateCalendar}
            datepickerValue={datepickerValue}
          />
        </Paper>
      </Collapse>
    </ClickAwayListener>
  );

  const appRoot = document.body;
  return createPortal(popupCalendar, appRoot);
}

export default DatepickerCalendar;
