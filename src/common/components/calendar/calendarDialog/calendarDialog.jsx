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
} from "@mui/material";

import TimeSelect from "../time-select";
import Datepicker from "../date-picker";
import roomService from "../../../../domains/room/roomService";
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

function CalendarEventDialog({ refreshCalendar }) {
  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
  const {
    eventID = 0,
    openDialog,
    eventBeginDate,
    eventBeginTime,
    eventEndTime,
    room,
    client,
    status,
    isPaid,
    description,
  } = stateCalendar;

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [clientInput, setClientInput] = useState("");

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleCloseDialog = () => {
    setStateCalendar({
      ...stateCalendar,
      openDialog: false,
      openViewDialog: false,
    });
  };

  const { business } = useSelector((state) => state?.auth.user) || { id: undefined };
  const { data: roomsList } = useSelector((state) => state?.rooms) || { data: [] };
  const { data: clientsList } = useSelector((state) => state?.clients) || { data: [] };
  const { data: appointments } = useSelector((state) => state?.appointments) || { data: [] };
  const { data: calendarBlocks } = useSelector((state) => state?.calendarBlocks) || { data: [] };
  const scheduleState = useSelector((state) => state?.user.schedule) || [];

  const [filteredClientsList, setFilteredClientsList] = useState(clientsList);

  const initialOptionTime = timeOptions(
    getInitialAndEndTime(
      scheduleState,
      format(new Date(eventBeginDate), "eeee", { locale: ptBR })
    )
  );

  console.log('eventBeginDate', eventBeginTime);
  console.log('endTime', eventEndTime);

  const formik = useFormik({
    initialValues: {
      roomTF: room || "",
      clientTF: client
        ? {
            value: client,
            label: clientsList.find((c) => c.id == client)?.name || "",
          }
        : { value: "", label: "" },
      statusTF: status || "SCHEDULED",
      descriptionTF: description || "",
      isPaidTF: isPaid || false,
      beginDate: eventBeginDate,
      beginTime: eventBeginTime,
      endTime: eventEndTime, // novo campo para o horário final
    },
    enableReinitialize: true,
    // Mescla a validação base com a validação customizada para endTime
    validationSchema: baseValidationSchema(
      appointments,
      roomsList,
      eventID,
      calendarBlocks,
      format(new Date(eventBeginDate), "eeee", { locale: ptBR })
    ),
    onSubmit: (values) => handleSubmit(values),
  });

  useEffect(() => {
    if (business?.id) {
      clientService.read({ businessId: business?.id });
    }
  }, [business]);

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
          (time) => timeToMinutes(time.value) > timeToMinutes(correctedBeginTime.value)
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
    const markerData = {
      clientId: values.clientTF.value,
      businessId: business?.id,
      roomId: values.roomTF,
      description: values.descriptionTF,
      dateAndTime: format(
        formatDateTime(values.beginDate, values.beginTime.value),
        "yyyy/MM/dd HH:mm:ss",
        { locale: ptBR }
      ),
      endTime: format(
        formatDateTime(values.beginDate, values.endTime.value),
        "yyyy/MM/dd HH:mm:ss",
        { locale: ptBR }
      ),
      isPaid: values.isPaidTF,
      appointmentStatus: values.statusTF,
    };

    if (eventID) {
      appointmentService.update(eventID, markerData);
      refreshCalendar(false);
    } else {
      appointmentService.create(business?.id, markerData);
    }

    handleClose();
  };

  const formatDateTime = (newDate, newTime) => {
    if (newDate === null) return;
    const dateTxt = format(newDate, "yyyy/MM/dd");
    return new Date(dateTxt + " " + newTime);
  };

  const handleDelete = () => {
    appointmentService.remove(eventID);
    handleCloseDialog();
    setOpenDeleteConfirm(false);
  };

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  return (
    <>
      <StyledDialog maxWidth="sm" fullWidth open={openDialog} onClose={handleClose}>
        <DialogTitle id="responsive-dialog-title">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
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
            sx={{ display: "flex", flexDirection: "column", m: "auto", pt: 2, gap: 3 }}
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
                {roomsList.map((room) => (
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
                    onChange={(e, value) => formik.setFieldValue("clientTF", value)}
                    onInputChange={(e, value) => setClientInput(value)}
                    options={filteredClientsList.map((client) => {
                      const name = client.name === "Novo Membro" ? `${client.name} - ${client.phone}` : client.name;
                      return { value: client.id, label: name };
                    })}
                    getOptionLabel={(option) => option?.label}
                    renderInput={(params) => <TextField {...params} label="Membro" />}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
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
                    error={formik.touched.statusTF && Boolean(formik.errors.statusTF)}
                  >
                    <MenuItem value="SCHEDULED">Agendado</MenuItem>
                    <MenuItem value="COMPLETED">Concluído</MenuItem>
                    <MenuItem value="CANCELLED">Cancelado</MenuItem>
                    <MenuItem value="RESCHEDULED">Reagendado</MenuItem>
                    <MenuItem value="NO_SHOW">Não compareceu</MenuItem>
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
                error={formik.touched.descriptionTF && Boolean(formik.errors.descriptionTF)}
              />
              {formik.touched.descriptionTF && formik.errors.descriptionTF && (
                <Typography variant="caption" color="error">
                  {formik.errors.descriptionTF}
                </Typography>
              )}
            </FormControl>

            {/* Data do agendamento e exibição do horário */}
            <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8} style={{ paddingBlock: 15 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Typography>Data do agendamento</Typography>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Datepicker
                        styleCls={classes.datepicker}
                        dateFormat={"dd/MM/yyyy"}
                        originalValue={new Date(formik.values.beginDate)}
                        onChange={(e) => {
                          formik.setFieldValue("beginDate", e);
                          setStateCalendar({ ...stateCalendar, eventBeginDate: e });
                        }}
                      />
                      <Typography className={classes.dayOfWeek}>
                        {formik.values.beginDate !== null &&
                          format(new Date(formik.values.beginDate), "eeee", { locale: ptBR })}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Typography>Horário</Typography>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <TimeSelect
                        placeholder={""}
                        options={timeOptions(
                          getInitialAndEndTime(
                            scheduleState,
                            format(new Date(formik.values.beginDate), "eeee", { locale: ptBR })
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
                        format(new Date(formik.values.beginDate), "eeee", { locale: ptBR })
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
                  style={{ display: "flex", justifyContent: "flex-start", paddingTop: 0 }}
                >
                  <Typography>Pago</Typography>
                  <Switch
                    checked={formik.values.isPaidTF}
                    onChange={(e) => formik.setFieldValue("isPaidTF", e.target.checked)}
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
        <DialogTitle id="alert-dialog-title">{"Confirmar exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
          <Button onClick={handleDelete} autoFocus>
            Confirmar exclusão
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CalendarEventDialog;
