import clsx from "clsx";
import dayjs from "dayjs";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ptBR } from "date-fns/locale";
import { IoMdTime } from "react-icons/io";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
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
  } = stateCalendar;

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
  const scheduleState = useSelector((state) => state?.user.schedule) || [];

  const [filteredClientsList, setFilteredClientsList] = useState(clientsList);

  const safeBeginDate =
    eventBeginDate && !isNaN(new Date(eventBeginDate).getTime())
      ? eventBeginDate
      : null;

  // Monta as opções de horário
  const initialOptionTime = timeOptions(
    getInitialAndEndTime(
      scheduleState,
      safeBeginDate
        ? format(new Date(safeBeginDate), "eeee", { locale: ptBR })
        : "monday" // fallback
    )
  );

  const formik = useFormik({
    initialValues: {
      roomTF: room || "",
      clientTF: client
        ? { value: client, label: clientName }
        : { value: "", label: "" },
      statusTF: status || "SCHEDULED",
      descriptionTF: description || "",
      isPaidTF: isPaid || false,
      // se for null/undefined, inicia com null ou Date()
      beginDate: safeBeginDate,
      beginTime: eventBeginTime,
      endTime: eventEndTime,

      // Campos de recorrência
      recurrenceType: "NONE",
      dayOfWeek: null,
      ordinalOfWeek: 2,
      dayOfMonth: null,
      monthOfYear: null,
      timesToRepeat: 1,
      recurrenceEndDate: null,
    },
    enableReinitialize: true,

    validationSchema: baseValidationSchema(
      appointments,
      roomsList,
      eventID,
      calendarBlocks,
      // Se beginDate for null, previne erro:
      safeBeginDate
        ? format(new Date(safeBeginDate), "eeee", { locale: ptBR })
        : ""
    ),
    onSubmit: (values) => handleSubmit(values),
  });

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

  const handleSubmit = (values) => {
    // 1. Monta o objeto básico
    const markerData = {
      clientId: values.clientTF.value,
      businessId: business?.id,
      roomId: values.roomTF,
      description: values.descriptionTF,
      dateAndTime: formatDateTime(values.beginDate, values.beginTime.value),
      endTime: formatDateTime(values.beginDate, values.endTime.value),
      isPaid: values.isPaidTF,
      appointmentStatus: values.statusTF,
    };

    // 2. Se for recorrência, adicionamos os campos extras
    if (values.recurrenceType && values.recurrenceType !== "NONE") {
      markerData.recurrenceType = values.recurrenceType;
      markerData.dayOfWeek = values.dayOfWeek;
      markerData.ordinalOfWeek = values.ordinalOfWeek;
      markerData.dayOfMonth = values.dayOfMonth;
      markerData.monthOfYear = values.monthOfYear;
      markerData.timesToRepeat = Number(values.timesToRepeat);
      markerData.startDate = markerData.dateAndTime; // se quiser igual a dataInício
      markerData.endDate = values.recurrenceEndDate
        ? formatDateTime(values.recurrenceEndDate, "23:59:59")
        : null;
    }

    // 3. Se estamos editando um evento existente
    if (eventID) {
      if (stateCalendar.recurrenceRuleId) {
        // É recorrente, então abre modal perguntando se "single" ou "series"
        setScopeDialogOpen(true);
        setMarkerDataForUpdate(markerData);
      } else {
        // Edição simples
        appointmentService.update(eventID, markerData).then(() => {
          refreshCalendar(false);
          handleClose();
        });
      }
    } else {
      // Criação de novo evento (single ou recorrente)
      appointmentService.create(business?.id, markerData).then(() => {
        refreshCalendar(false);
        handleClose();
      });
    }
  };

  const formatDateTime = (newDate, newTime) => {
    if (!newDate) return null;
    // Se newDate for invalid, retorne null
    if (isNaN(new Date(newDate).getTime())) return null;

    const dateTxt = format(new Date(newDate), "yyyy/MM/dd");
    return new Date(dateTxt + " " + newTime);
  };

  const handleDelete = async (scope = "single") => {
    if (!eventID) return;
    await appointmentService.remove(eventID, scope);
    handleCloseDialog();
    setOpenDeleteConfirm(false);
  };

  const handleOpenDeleteConfirm = () => {
    const isRecurrent = Boolean(stateCalendar.recurrenceRuleId);
    setStateCalendar((prev) => ({
      ...prev,
      isRecurrent,
    }));
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const doUpdate = (scope) => {
    appointmentService.update(eventID, markerDataForUpdate, scope).then(() => {
      refreshCalendar(false);
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
                <Grid item xs={12} sm={8} style={{ paddingBlock: 15 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <Typography>Data do agendamento</Typography>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Datepicker
                        styleCls={classes.datepicker}
                        dateFormat="dd/MM/yyyy"
                        // Se beginDate for inválido, passa null
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
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{
                    display: "flex",
                    justifyContent: isSmUp ? "flex-end" : "flex-start",
                    paddingBlock: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
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

            {/* Seletor de tipo de recorrência */}
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
                <MenuItem value="MONTHLY_BY_DATE">Mensal (dia exato)</MenuItem>
                <MenuItem value="MONTHLY_BY_ORDINAL">
                  Mensal (ex: 2ª Terça)
                </MenuItem>
                <MenuItem value="YEARLY_BY_DATE">Anual (data exata)</MenuItem>
                <MenuItem value="YEARLY_BY_ORDINAL">
                  Anual (ex: 2ª Terça de Abril)
                </MenuItem>
              </Select>
            </FormControl>

            {/* Se for diferente de "NONE", exibimos os campos adicionais */}
            {formik.values.recurrenceType !== "NONE" && (
              <Box sx={{ mt: 2, mb: 2 }}>
                {/* Campos comuns a toda recorrência, ex: data final, timesToRepeat */}
                <Typography variant="subtitle1" gutterBottom>
                  Configurações de Recorrência
                </Typography>

                {/* Data final da recorrência */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Data final da recorrência
                  </Typography>
                  <Datepicker
                    dateFormat="dd/MM/yyyy"
                    originalValue={
                      formik.values.recurrenceEndDate ?? new Date()
                    }
                    onChange={(newDate) =>
                      formik.setFieldValue("recurrenceEndDate", newDate)
                    }
                  />
                </FormControl>

                {/* Quantidade de repetições */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Repetir quantas vezes?"
                    type="number"
                    value={formik.values.timesToRepeat}
                    onChange={(e) =>
                      formik.setFieldValue("timesToRepeat", e.target.value)
                    }
                  />
                </FormControl>

                {/* Condicionais de campos específicos */}
                {formik.values.recurrenceType === "WEEKLY" && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="dayOfWeek">Dia da semana</InputLabel>
                    <Select
                      id="dayOfWeek"
                      name="dayOfWeek"
                      label="Dia da semana"
                      value={formik.values.dayOfWeek}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="MONDAY">Segunda</MenuItem>
                      <MenuItem value="TUESDAY">Terça</MenuItem>
                      <MenuItem value="WEDNESDAY">Quarta</MenuItem>
                      <MenuItem value="THURSDAY">Quinta</MenuItem>
                      <MenuItem value="FRIDAY">Sexta</MenuItem>
                      <MenuItem value="SATURDAY">Sábado</MenuItem>
                      <MenuItem value="SUNDAY">Domingo</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {formik.values.recurrenceType === "WEEKDAYS" && (
                  <Typography variant="body2" color="textSecondary">
                    Será agendado automaticamente de segunda a sexta-feira
                  </Typography>
                )}

                {formik.values.recurrenceType === "MONTHLY_BY_DATE" && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                      label="Dia do mês"
                      type="number"
                      value={formik.values.dayOfMonth || ""}
                      onChange={(e) =>
                        formik.setFieldValue("dayOfMonth", e.target.value)
                      }
                    />
                    <Typography variant="caption">
                      Ex: 8 para "todo dia 8 do mês"
                    </Typography>
                  </FormControl>
                )}

                {formik.values.recurrenceType === "MONTHLY_BY_ORDINAL" && (
                  <>
                    {/* ordinalOfWeek e dayOfWeek */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        label="Ordem da semana"
                        type="number"
                        value={formik.values.ordinalOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("ordinalOfWeek", e.target.value)
                        }
                      />
                      <Typography variant="caption">
                        Ex: 2 para "2ª (segunda) semana"
                      </Typography>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Dia da semana</InputLabel>
                      <Select
                        value={formik.values.dayOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("dayOfWeek", e.target.value)
                        }
                      >
                        <MenuItem value="MONDAY">Segunda</MenuItem>
                        <MenuItem value="TUESDAY">Terça</MenuItem>
                        <MenuItem value="WEDNESDAY">Quarta</MenuItem>
                        <MenuItem value="THURSDAY">Quinta</MenuItem>
                        <MenuItem value="FRIDAY">Sexta</MenuItem>
                        <MenuItem value="SATURDAY">Sábado</MenuItem>
                        <MenuItem value="SUNDAY">Domingo</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}

                {formik.values.recurrenceType === "YEARLY_BY_DATE" && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        label="Dia do mês"
                        type="number"
                        value={formik.values.dayOfMonth || ""}
                        onChange={(e) =>
                          formik.setFieldValue("dayOfMonth", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        label="Mês do ano"
                        type="number"
                        value={formik.values.monthOfYear || ""}
                        onChange={(e) =>
                          formik.setFieldValue("monthOfYear", e.target.value)
                        }
                      />
                      <Typography variant="caption">
                        Ex: 4 para Abril
                      </Typography>
                    </FormControl>
                  </>
                )}

                {formik.values.recurrenceType === "YEARLY_BY_ORDINAL" && (
                  <>
                    {/* ordinalOfWeek, dayOfWeek, monthOfYear */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        label="Ordem da semana"
                        type="number"
                        value={formik.values.ordinalOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("ordinalOfWeek", e.target.value)
                        }
                      />
                      <Typography variant="caption">
                        Ex: 2 para "2ª (segunda) semana"
                      </Typography>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Dia da semana</InputLabel>
                      <Select
                        value={formik.values.dayOfWeek}
                        onChange={(e) =>
                          formik.setFieldValue("dayOfWeek", e.target.value)
                        }
                      >
                        <MenuItem value="MONDAY">Segunda</MenuItem>
                        <MenuItem value="TUESDAY">Terça</MenuItem>
                        <MenuItem value="WEDNESDAY">Quarta</MenuItem>
                        <MenuItem value="THURSDAY">Quinta</MenuItem>
                        <MenuItem value="FRIDAY">Sexta</MenuItem>
                        <MenuItem value="SATURDAY">Sábado</MenuItem>
                        <MenuItem value="SUNDAY">Domingo</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        label="Mês do ano"
                        type="number"
                        value={formik.values.monthOfYear || ""}
                        onChange={(e) =>
                          formik.setFieldValue("monthOfYear", e.target.value)
                        }
                      />
                      <Typography variant="caption">
                        Ex: 4 para Abril
                      </Typography>
                    </FormControl>
                  </>
                )}
              </Box>
            )}

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

      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {stateCalendar.isRecurrent
              ? "Este agendamento faz parte de uma série recorrente. Deseja excluir apenas este ou toda a série?"
              : "Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {stateCalendar.isRecurrent ? (
            <>
              <Button onClick={() => handleDelete("single")} color="primary">
                Somente este
              </Button>
              <Button
                onClick={() => handleDelete("series")}
                color="primary"
                autoFocus
              >
                Toda a série
              </Button>
            </>
          ) : (
            // Quando NÃO é recorrente, mostramos um botão para confirmar a exclusão:
            <Button
              onClick={() => handleDelete("single")}
              color="primary"
              autoFocus
            >
              Confirmar exclusão
            </Button>
          )}

          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={scopeDialogOpen} onClose={() => setScopeDialogOpen(false)}>
        <DialogTitle>Editar recorrência</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você deseja editar somente este evento ou toda a série recorrente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => doUpdate("single")}>Somente este</Button>
          <Button onClick={() => doUpdate("series")} autoFocus>
            Toda a série
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CalendarEventDialog;
