import { useState, useRef, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TextField, IconButton, InputAdornment } from "@mui/material";
import { MdOutlineToday } from "react-icons/md";

import DatepickerCalendar from "./date-picker-calendar";

const PREFIX = "Datepicker";

const classes = {
  collapseCalendar: `${PREFIX}-collapseCalendar`,
  textField: `${PREFIX}-textField`,
  todayButton: `${PREFIX}-todayButton`,
  todayIcon: `${PREFIX}-todayIcon`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(() => ({
  [`& .${classes.collapseCalendar}`]: {
    position: "absolute",
  },

  [`& .${classes.textField}`]: {
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },

  [`& .${classes.todayButton}`]: {
    marginRight: 2,
  },

  [`& .${classes.todayIcon}`]: {
    fontSize: "1.5rem",
    padding: 2,
  },
}));

function Datepicker(props) {
  const {
    styleCls = null,
    withIcon = true,
    label = "",
    dateFormat = "dd/MM/yyyy",
    originalValue = new Date(),
    onChange = () => {},
  } = props;

  const applyDateFormat = useCallback(
    (date) => {
      return format(date, dateFormat, { locale: ptBR });
    },
    [dateFormat],
  );

  const datepickerRef = useRef();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });

  const [dateTextValue, setDateTextValue] = useState(
    applyDateFormat(originalValue),
  );
  const [dateValue, setDateValue] = useState();

  const handleClickAway = () => {
    setOpenCalendar(false);
  };

  const handleOpenCalendar = () => {
    const datepickerRefCurrent = datepickerRef.current;

    const { x, y } =
      datepickerRefCurrent && datepickerRefCurrent.getBoundingClientRect();

    setCalendarPosition({
      top: y + 40,
      left: document.body.offsetWidth - x < 300 ? x - 100 : x,
    });

    setOpenCalendar(!openCalendar);
  };

  const inputProps = {
    endAdornment: withIcon ? (
      <InputAdornment position="end">
        <IconButton
          size="medium"
          edge="end"
          aria-label="Toggle calendar visibility"
          onClick={handleOpenCalendar}
        >
          <MdOutlineToday className={classes.todayIcon} />
        </IconButton>
      </InputAdornment>
    ) : null,
  };

  const handleChangeDateCalendar = (value) => {
    setDateTextValue(format(value, dateFormat, { locale: ptBR }));
    setOpenCalendar(false);
    setDateValue(value);
    onChange(value);
  };

  const handleChangeTextField = (event) => {
    setDateTextValue(event.target.value);
  };

  const dateValidation = (value) => {
    let dateReceived = value.replace(/-/g, "/").replace(/\./g, "/");
    const dateA = dateReceived.split("/");

    const validDateFormat = new RegExp(
      /^((\d{1,2})[-|.|/](\d{1,2})[-|.|/](\d{2,4}))|((\d{2,4})[-|.|/](\d{1,2})[-|.|/](\d{1,2}))$/,
    );
    const validDateFormatYf = new RegExp(
      /^(\d{2,4})[-|.|/](\d{1,2})[-|.|/](\d{1,2})$/,
    );

    const isDateOK = validDateFormat.test(dateReceived);

    if (!isDateOK) {
      return new Date(originalValue);
    }

    const hasYearFirst = validDateFormatYf.test(dateReceived);

    const year = (hasYearFirst && dateA[0]) || dateA[2];
    const month = dateA[1] > 12 ? (!hasYearFirst ? dateA[0] : 99) : dateA[1];
    const day = hasYearFirst ? dateA[2] : dateA[0];

    dateReceived = new Date(year, month - 1, day);

    return dateReceived;
  };

  const handleBlurTextField = (event) => {
    const dateValue = event.target.value;

    if (dateValue.length <= 0) {
      return false;
    }

    const validatedDate = dateValidation(dateValue);
    const correctDate = isValid(validatedDate) ? validatedDate : originalValue;
    setDateTextValue(applyDateFormat(correctDate));
    setDateValue(correctDate);

    onChange(correctDate);
  };

  useEffect(() => {
    setDateValue(originalValue);
    setDateTextValue(applyDateFormat(originalValue));

    if (
      format(originalValue, "yyyy/MM/dd", { locale: ptBR }) === "1970/01/01"
    ) {
      setOpenCalendar(false);
    }
  }, [originalValue, applyDateFormat]);

  return (
    <Root>
      <TextField
        inputRef={datepickerRef}
        className={clsx(classes.textField, styleCls)}
        variant="standard"
        fullWidth
        type={"text"}
        label={label}
        value={dateTextValue}
        onChange={handleChangeTextField}
        onBlur={handleBlurTextField}
        InputProps={inputProps}
      />
      {openCalendar && (
        <DatepickerCalendar
          datepickerValue={dateValue}
          calendarPosition={calendarPosition}
          openCalendar={openCalendar}
          handleClickAway={handleClickAway}
          handleChangeDateCalendar={handleChangeDateCalendar}
        />
      )}
    </Root>
  );
}

export default Datepicker;
