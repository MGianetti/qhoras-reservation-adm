import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ptBR } from "date-fns/locale";
import { IoMdTime } from "react-icons/io";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { useContext, useEffect, useMemo, useState } from "react";
import { CalendarContext } from "../context/calendar-context";
import {
  Button,
  Dialog,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  DialogContent,
  DialogActions,
  Switch,
  Grid,
  Autocomplete,
  Box,
  DialogContentText,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import TimeSelect from "../time-select";
import Datepicker from "../date-picker";
import clientService from "../../../../domains/client/clientService";
import appointmentService from "../../../../domains/appointment/appointmentService";

import {
  StyledDialog,
  timeOptions,
  validationSchema as baseValidationSchema,
  classes,
  StyledTooltip,
  getInitialAndEndTime,
  timeToMinutes,
} from "./calendarDialog.constants";
import { useDebounce } from "../../../utils/useDebounce";
import UpdateRecurrenceDialog from "./updateRecurrenceDialog/updateRecurrenceDialog";
import DeleteAppointmentDialog from "./deleteAppointmentDialog/deleteAppointmentDialog";

dayjs.extend(utc);
dayjs.extend(timezone);

function CalendarEventDialog({ refreshCalendar, roomsList }) {
  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const {
    eventID = 0,
    openDialog,
    eventBeginDate,
    eventBeginTime,
    eventEndTime,
    room,
    client,
    clientName,
    status,
    isPaid,
    description,
    recurrenceType,
    dayOfWeek,
    ordinalOfWeek,
    dayOfMonth,
    monthOfYear,
    recurrenceEndDate,
    timesToRepeat,
    isList,
    updateParams,
  } = stateCalendar;

  const isRecurrentEvent = Boolean(
    stateCalendar?.calendarEvent?.recurrenceRuleId
  );
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [clientInput, setClientInput] = useState("");
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false);
  const [markerDataForUpdate, setMarkerDataForUpdate] = useState(null);

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleCloseDialog = () => {
    setStateCalendar({
      ...stateCalendar,
      openDialog: false,
      openViewDialog: false,
    });
    setClientInput("");
  };

  const { business } = useSelector((state) => state?.auth.user) || {
    id: undefined,
  };
  const { data: clientsList } = useSelector((state) => state?.clients) || {
    data: [],
  };
  const { data: appointments } = useSelector(
    (state) => state?.appointments
  ) || { data: [] };
  const { data: calendarBlocks } = useSelector(
    (state) => state?.calendarBlocks
  ) || { data: [] };
  const [scheduleState, setScheduleState] = useState([]);

  const [filteredClientsList, setFilteredClientsList] = useState(clientsList);

  const safeBeginDate =
    eventBeginDate && !isNaN(new Date(eventBeginDate).getTime())
      ? eventBeginDate
      : null;

  const handleSubmit = async (v) => {
    const baseDate = formatDateTime(v.beginDate, v.beginTime.value);
    const baseEndDate = formatDateTime(v.beginDate, v.endTime.value);

    const payload = {
      clientId: v.clientTF.value,
      businessId: business.id,
      roomId: v.roomTF,
      description: v.descriptionTF,
      dateAndTime: baseDate,
      endTime: baseEndDate,
      isPaid: v.isPaidTF,
      appointmentStatus: v.statusTF,
    };

    if (v.recurrenceType !== "NONE") {
      Object.assign(payload, {
        recurrenceType: v.recurrenceType,
        startDate: baseDate,
        endDate: v.endDate ? formatDateTime(v.endDate, "23:59:59") : null,
        timesToRepeat: v.endDate ? null : Number(v.timesToRepeat) || null,
        dayOfWeek: v.dayOfWeek,
        ordinalOfWeek: v.ordinalOfWeek ? Number(v.ordinalOfWeek) : null,
        dayOfMonth: v.dayOfMonth ? Number(v.dayOfMonth) : null,
        monthOfYear: v.monthOfYear ? Number(v.monthOfYear) : null,
      });
    }

    if (eventID) {
      // alert(isRecurrentEvent);
      if (isRecurrentEvent) {
        setMarkerDataForUpdate(payload);
        setScopeDialogOpen(true);
        return;
      }
      await appointmentService.update(eventID, payload, "single", isList, updateParams);
    } else {
      await appointmentService.create(business.id, payload);
    }

    if(!isList) refreshCalendar(false);
    handleClose();
  };

  const initialValues = useMemo(
    () => ({
      roomTF: room || "",
      clientTF: client
        ? { value: client, label: clientName }
        : { value: "", label: "" },
      statusTF: status || "SCHEDULED",
      descriptionTF: description || "",
      isPaidTF: isPaid || false,
      beginDate: safeBeginDate,
      beginTime: eventBeginTime,
      endTime: eventEndTime,

      /* Recorrência */
      recurrenceType: "NONE",
      dayOfWeek: null,
      ordinalOfWeek: 2,
      dayOfMonth: null,
      monthOfYear: null,
      endDate: new Date(),
      timesToRepeat: "",
    }),
    [eventID, openDialog]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: baseValidationSchema(
      appointments,
      roomsList,
      eventID,
      calendarBlocks,
      safeBeginDate
        ? format(new Date(safeBeginDate), "eeee", { locale: ptBR })
        : ""
    ),
    onSubmit: handleSubmit,
  });

  const initialOptionTime = useMemo(() => {
    const weekday = safeBeginDate
      ? format(new Date(safeBeginDate), "eeee", { locale: ptBR })
      : "monday";

    const roomSelected = roomsList?.find(room => room.id === formik?.values?.roomTF);
    if(!roomSelected) return [];
    setScheduleState(roomSelected?.agendaConfigurations);
    return timeOptions(getInitialAndEndTime(roomSelected?.agendaConfigurations, weekday));
  }, [safeBeginDate, formik?.values?.roomTF]);

  useEffect(() => {
    if (business?.id) {
      clientService.read({ businessId: business?.id });
    }
  }, [business]);

  useEffect(() => {
    const getInitialClients = async () => {
      const clients = await clientService.read({ businessId: business?.id });
      setFilteredClientsList(clients.data);
    };
    getInitialClients();
  }, []);

  const debouncedClientInput = useDebounce(clientInput, 500);

  useEffect(() => {
    if (business?.id) {
      const getClients = async () => {
        const clients = await clientService.read({
          businessId: business?.id,
          search: debouncedClientInput,
        });
        setFilteredClientsList(clients.data);
      };
      getClients();
    }
  }, [business, debouncedClientInput]);

  useEffect(() => {
    if (
      formik.values.beginDate &&
      formik.values.beginTime &&
      formik.values.endTime &&
      initialOptionTime.length > 0
    ) {
      let beginTimeValue = formik.values.beginTime.value;
      if (beginTimeValue.length === 4) {
        beginTimeValue = "0" + beginTimeValue;
      }
      const validBeginTime = initialOptionTime.find(
        (time) => time.value === beginTimeValue
      );
      const correctedBeginTime = validBeginTime || initialOptionTime[0];

      if (formik.values.beginTime.value !== correctedBeginTime.value) {
        formik.setFieldValue("beginTime", correctedBeginTime);
      }

      let endTimeValue = formik.values.endTime.value;
      if (endTimeValue.length === 4) {
        endTimeValue = "0" + endTimeValue;
      }
      const validEndTime = initialOptionTime.find(
        (time) => time.value === endTimeValue
      );
      let correctedEndTime = validEndTime || initialOptionTime[0];

      if (
        timeToMinutes(correctedEndTime.value) <=
        timeToMinutes(correctedBeginTime.value)
      ) {
        const nextValidOption = initialOptionTime.find(
          (time) =>
            timeToMinutes(time.value) > timeToMinutes(correctedBeginTime.value)
        );
        correctedEndTime = nextValidOption || correctedEndTime;
      }

      if (formik.values.endTime.value !== correctedEndTime.value) {
        formik.setFieldValue("endTime", correctedEndTime);
      }
    }
  }, [
    formik.values.beginDate,
    formik.values.beginTime,
    formik.values.endTime,
    initialOptionTime,
  ]);

  const handleClose = () => {
    handleCloseDialog();
    setOpenDeleteConfirm(false);
  };

  const formatDateTime = (date, time) => {
    const [h, m, s = "00"] = time.split(":");
    return dayjs(date)
      .hour(Number(h))
      .minute(Number(m))
      .second(Number(s))
      .format("YYYY-MM-DD[T]HH:mm:ssZ");
  };

  const handleDelete = async (scope = "single") => {
    if (!eventID) return;
    await appointmentService.remove(eventID, scope, isRecurrentEvent);
    handleCloseDialog();
    setOpenDeleteConfirm(false);
  };

  const handleOpenDeleteConfirm = () => setOpenDeleteConfirm(true);

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const doUpdate = (scope) => {
    appointmentService.update(eventID, markerDataForUpdate, scope, isList, updateParams).then(() => {
      if(!isList) refreshCalendar(false);
      setScopeDialogOpen(false);
      handleClose();
    });
  };

  return (
    <>
      <StyledDialog
        maxWidth="sm"
        fullWidth
        open={openDialog}
        onClose={handleClose}
      >
        <DialogTitle id="responsive-dialog-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {eventID ? "Editar Agendamento" : "Novo Agendamento"}
            {eventID ? (
              <MdDeleteOutline
                style={{ cursor: "pointer", color: "red", fontSize: 25 }}
                onClick={handleOpenDeleteConfirm}
              />
            ) : null}
          </div>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              pt: 2,
              gap: 3,
            }}
          >
            {/* Campo de Sala */}
            <FormControl>
              <InputLabel htmlFor="roomTF" size="small">
                Sala
              </InputLabel>
              <Select
                id="roomTF"
                name="roomTF"
                label="Sala"
                size="small"
                value={formik.values.roomTF}
                onChange={formik.handleChange}
                error={formik.touched.roomTF && Boolean(formik.errors.roomTF)}
              >
                {roomsList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.roomTF && formik.errors.roomTF && (
                <Typography variant="caption" color="error">
                  {formik.errors.roomTF}
                </Typography>
              )}
            </FormControl>

            {/* Campo de Membro e Status */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    size="small"
                    id="clientTF"
                    name="clientTF"
                    disableClearable
                    sx={{ width: "100%" }}
                    value={formik.values.clientTF}
                    onChange={(e, value) =>
                      formik.setFieldValue("clientTF", value)
                    }
                    onInputChange={(e, value) => setClientInput(value)}
                    options={filteredClientsList.map((client) => {
                      const name =
                        client.name === "Novo Membro"
                          ? `${client.name} - ${client.phone}`
                          : client.name;
                      return { value: client.id, label: name };
                    })}
                    getOptionLabel={(option) => option?.label}
                    renderInput={(params) => (
                      <TextField {...params} label="Membro" />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option?.value === value?.value
                    }
                  />
                  {formik.touched.clientTF && formik.errors.clientTF && (
                    <Typography variant="caption" color="error">
                      {formik.errors.clientTF}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="statusTF" size="small">
                    Status
                  </InputLabel>
                  <Select
                    id="statusTF"
                    name="statusTF"
                    label="Status"
                    size="small"
                    value={formik.values.statusTF}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.statusTF && Boolean(formik.errors.statusTF)
                    }
                  >
                    <MenuItem value="PENDING">Pendente</MenuItem>
                    <MenuItem value="SCHEDULED">Agendado</MenuItem>
                    <MenuItem value="COMPLETED">Concluído</MenuItem>
                    <MenuItem value="CANCELLED">Cancelado</MenuItem>
                  </Select>
                  {formik.touched.statusTF && formik.errors.statusTF && (
                    <Typography variant="caption" color="error">
                      {formik.errors.statusTF}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Campo de Descrição */}
            <FormControl fullWidth>
              <InputLabel htmlFor="descriptionTF" size="small">
                Descrição
              </InputLabel>
              <OutlinedInput
                id="descriptionTF"
                name="descriptionTF"
                label="Descrição"
                size="small"
                multiline
                rows={3}
                value={formik.values.descriptionTF}
                onChange={formik.handleChange}
                error={
                  formik.touched.descriptionTF &&
                  Boolean(formik.errors.descriptionTF)
                }
                endAdornment={
                  <InputAdornment position="end">
                    <StyledTooltip
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#1976D2",
                        borderRadius: "50%",
                        padding: 2,
                      }}
                      placement="bottom-start"
                      title={`Quantas pessoas irão participar? Faz parte de algum ministério? Sobre o que será o evento?`}
                    >
                      <IconButton>
                        <FaRegCircleQuestion
                          fontSize={16}
                          style={{ color: "#ffffff", cursor: "pointer" }}
                        />
                      </IconButton>
                    </StyledTooltip>
                  </InputAdornment>
                }
              />
              {formik.touched.descriptionTF && formik.errors.descriptionTF && (
                <Typography variant="caption" color="error">
                  {formik.errors.descriptionTF}
                </Typography>
              )}
            </FormControl>

            {/* Data do agendamento e exibição do horário */}
            <FormControl
              className={clsx(classes.formControl, classes.formControlFlex)}
            >
              <Grid container spacing={2} alignItems="center">
                {(!eventID || !isRecurrentEvent) && (
                  <Grid item xs={12} sm={7} style={{ paddingBlock: 15 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <Typography>Data do agendamento</Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Datepicker
                          styleCls={classes.datepicker}
                          dateFormat="dd/MM/yyyy"
                          originalValue={
                            formik.values.beginDate &&
                            !isNaN(new Date(formik.values.beginDate).getTime())
                              ? new Date(formik.values.beginDate)
                              : null
                          }
                          onChange={(datePicked) => {
                            formik.setFieldValue("beginDate", datePicked);
                            setStateCalendar({
                              ...stateCalendar,
                              eventBeginDate: datePicked,
                            });
                          }}
                        />
                        <Typography className={classes.dayOfWeek}>
                          {formik.values.beginDate !== null &&
                            format(new Date(formik.values.beginDate), "eeee", {
                              locale: ptBR,
                            })}
                        </Typography>
                      </div>
                      {formik.touched.beginDate && formik.errors.beginDate && (
                        <Typography variant="caption" color="error">
                          {formik.errors.beginDate}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  sm={!eventID || !isRecurrentEvent ? 5 : 12}
                  style={{
                    display: "flex",
                    justifyContent: isSmUp ? "flex-start" : "flex-start",
                    paddingBlock: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      width: "100%",
                    }}
                  >
                    <Typography>Horário</Typography>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <TimeSelect
                        placeholder={""}
                        options={timeOptions(
                          getInitialAndEndTime(
                            scheduleState,
                            format(new Date(formik.values.beginDate), "eeee", {
                              locale: ptBR,
                            })
                          )
                        )}
                        originalValue={{
                          value: formik.values.beginTime.value,
                          label: formik.values.beginTime.label,
                        }}
                        onChange={(e) => formik.setFieldValue("beginTime", e)}
                      />
                      -
                      <TimeSelect
                        placeholder={""}
                        options={timeOptions(
                          getInitialAndEndTime(
                            scheduleState,
                            format(new Date(formik.values.beginDate), "eeee", {
                              locale: ptBR,
                            })
                          )
                        )}
                        originalValue={{
                          value: formik.values.endTime.value,
                          label: formik.values.endTime.label,
                        }}
                        onChange={(e) => formik.setFieldValue("endTime", e)}
                      />
                      <IoMdTime />
                    </div>
                    {formik.touched.beginTime && formik.errors.beginTime && (
                      <Typography variant="caption" color="error">
                        {formik.errors.beginTime}
                      </Typography>
                    )}
                  </div>
                </Grid>
              </Grid>
            </FormControl>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={clsx(classes.formControl, classes.formControlFlex)}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingTop: 0,
                  }}
                >
                  <Typography>Pago</Typography>
                  <Switch
                    checked={formik.values.isPaidTF}
                    onChange={(e) =>
                      formik.setFieldValue("isPaidTF", e.target.checked)
                    }
                    color="primary"
                  />
                </FormControl>
              </Grid>
            </Grid>

            {!eventID && (
              <FormControl fullWidth>
                <InputLabel htmlFor="recurrenceType" size="small">
                  Recorrência
                </InputLabel>
                <Select
                  id="recurrenceType"
                  name="recurrenceType"
                  label="Recorrência"
                  size="small"
                  value={formik.values.recurrenceType}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="NONE">Não se repete</MenuItem>
                  <MenuItem value="DAILY">Diariamente</MenuItem>
                  <MenuItem value="WEEKLY">Semanalmente</MenuItem>
                  <MenuItem value="WEEKDAYS">Dias de semana (Seg-Sex)</MenuItem>
                  <MenuItem value="MONTHLY_BY_DATE">
                    Mensal (dia exato)
                  </MenuItem>
                  <MenuItem value="MONTHLY_BY_ORDINAL">
                    Mensal (ex: 2ª Terça)
                  </MenuItem>
                  <MenuItem value="YEARLY_BY_DATE">Anual (data exata)</MenuItem>
                  <MenuItem value="YEARLY_BY_ORDINAL">
                    Anual (ex: 2ª Terça de Abril)
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {formik.values.recurrenceType !== "NONE" && (
              <Box sx={{ gap: "16px" }} display="flex" flexDirection="column">
                <Typography variant="subtitle1" gutterBottom>
                  Configuração da recorrência
                </Typography>

                <Datepicker
                  label="Data final da recorrência"
                  placeholderText="Selecione até quando repetir"
                  dateFormat="dd/MM/yyyy"
                  position="top"
                  originalValue={formik.values.endDate}
                  onChange={(d) => formik.setFieldValue("endDate", d)}
                />

                {formik.values.recurrenceType === "WEEKLY" && (
                  <>
                    <InputLabel htmlFor="weeklyRecurrence" size="small">
                      Dis da semana
                    </InputLabel>
                    <Select
                      id="weeklyRecurrence"
                      size="small"
                      fullWidth
                      name="dayOfWeek"
                      value={formik.values.dayOfWeek}
                      onChange={formik.handleChange}
                      placeholderText="Selecione o dia da semana"
                    >
                      <MenuItem value="MONDAY">Segunda-feira</MenuItem>
                      <MenuItem value="TUESDAY">Terça-feira</MenuItem>
                      <MenuItem value="WEDNESDAY">Quarta-feira</MenuItem>
                      <MenuItem value="THURSDAY">Quinta-feira</MenuItem>
                      <MenuItem value="FRIDAY">Sexta-feira</MenuItem>
                      <MenuItem value="SATURDAY">Sábado</MenuItem>
                      <MenuItem value="SUNDAY">Domingo</MenuItem>
                    </Select>
                  </>
                )}

                {formik.values.recurrenceType === "WEEKDAYS" && (
                  <Typography variant="body2" color="textSecondary">
                    Repetirá automaticamente de <b>segunda</b> a{" "}
                    <b>sexta-feira</b>.
                  </Typography>
                )}

                {formik.values.recurrenceType === "MONTHLY_BY_DATE" && (
                  <TextField
                    fullWidth
                    label="Dia do mês"
                    placeholder="Ex: 8"
                    type="number"
                    value={formik.values.dayOfMonth || ""}
                    onChange={(e) =>
                      formik.setFieldValue("dayOfMonth", e.target.value)
                    }
                  />
                )}

                {formik.values.recurrenceType === "MONTHLY_BY_ORDINAL" && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Semana do mês"
                        placeholder="Ex: 1 a 5"
                        type="number"
                        value={formik.values.ordinalOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("ordinalOfWeek", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Select
                        fullWidth
                        name="dayOfWeek"
                        value={formik.values.dayOfWeek}
                        onChange={formik.handleChange}
                      >
                        <MenuItem disabled value="">
                          Selecione o dia da semana
                        </MenuItem>
                        <MenuItem value="MONDAY">Segunda-feira</MenuItem>
                        <MenuItem value="TUESDAY">Terça-feira</MenuItem>
                        <MenuItem value="WEDNESDAY">Quarta-feira</MenuItem>
                        <MenuItem value="THURSDAY">Quinta-feira</MenuItem>
                        <MenuItem value="FRIDAY">Sexta-feira</MenuItem>
                        <MenuItem value="SATURDAY">Sábado</MenuItem>
                        <MenuItem value="SUNDAY">Domingo</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                )}

                {formik.values.recurrenceType === "YEARLY_BY_DATE" && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Dia do mês"
                        placeholder="Ex: 25"
                        type="number"
                        value={formik.values.dayOfMonth || ""}
                        onChange={(e) =>
                          formik.setFieldValue("dayOfMonth", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Mês do ano"
                        placeholder="Ex: 12 para Dezembro"
                        type="number"
                        value={formik.values.monthOfYear || ""}
                        onChange={(e) =>
                          formik.setFieldValue("monthOfYear", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                {formik.values.recurrenceType === "YEARLY_BY_ORDINAL" && (
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Semana do mês"
                        placeholder="1 a 5"
                        type="number"
                        value={formik.values.ordinalOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("ordinalOfWeek", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        fullWidth
                        name="dayOfWeek"
                        value={formik.values.dayOfWeek}
                        onChange={formik.handleChange}
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          Dia da semana
                        </MenuItem>
                        <MenuItem value="MONDAY">Segunda-feira</MenuItem>
                        <MenuItem value="TUESDAY">Terça-feira</MenuItem>
                        <MenuItem value="WEDNESDAY">Quarta-feira</MenuItem>
                        <MenuItem value="THURSDAY">Quinta-feira</MenuItem>
                        <MenuItem value="FRIDAY">Sexta-feira</MenuItem>
                        <MenuItem value="SATURDAY">Sábado</MenuItem>
                        <MenuItem value="SUNDAY">Domingo</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Mês"
                        placeholder="1 a 12"
                        type="number"
                        value={formik.values.monthOfYear || ""}
                        onChange={(e) =>
                          formik.setFieldValue("monthOfYear", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}

            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancelar
              </Button>
              <Button autoFocus type="submit" variant="contained">
                {eventID ? "Editar Agendamento" : "Agendar"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </StyledDialog>

      <DeleteAppointmentDialog
        openDeleteConfirm={openDeleteConfirm}
        handleCloseDeleteConfirm={handleCloseDeleteConfirm}
        handleDelete={handleDelete}
        isRecurrentEvent={isRecurrentEvent}
      />

      <UpdateRecurrenceDialog
        scopeDialogOpen={scopeDialogOpen}
        setScopeDialogOpen={setScopeDialogOpen}
        doUpdate={doUpdate}
      />
    </>
  );
}

export default CalendarEventDialog;
