import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Switch,
  Grid,
  FormControlLabel,
  FormLabel,
  Box,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MultiInputTimeRangeField } from "@mui/x-date-pickers-pro";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

import moneyMask from "../../../masks/moneyMask";
import roomService from "../../../../domains/room/roomService";

import {
  formatRoomPayload,
  validationSchema,
  days,
} from "./roomModal.constants";
import dayjs from "dayjs";
import { useMemo } from "react";

const RoomModal = ({ open, setOpen, valuesLine }) => {
  const { businessId } = useSelector((state) => state?.auth.user) || {
    businessId: undefined,
  };

  const initialValues = useMemo(
    () => ({
      name: valuesLine?.name || "",
      price: valuesLine ? moneyMask(valuesLine.price) : "R$ 0,00",
      status: valuesLine?.status ?? true,
      capacity: valuesLine?.capacity || 0,
      agendaConfigurations: valuesLine?.agendaConfigurations
        ? valuesLine.agendaConfigurations.map((config) => ({
            day: config.day,
            isActive: config.isActive,
            // Store as dayjs objects for later formatting
            timeRange: [
              dayjs(`1970-01-01T${config.startTime}`),
              dayjs(`1970-01-01T${config.endTime}`),
            ],
          }))
        : days.map((day) => ({
            day: day.value,
            isActive: false,
            timeRange: [dayjs("1970-01-01T08:00"), dayjs("1970-01-01T18:00")],
          })),
    }),
    [valuesLine],
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    // validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      price: parseInt(values.price.replace(/\D/g, ""), 10) || 0,
      agendaConfigurations: (values.agendaConfigurations || []).map(
        (config, index) => ({
          day: days[index].value,
          startTime: config.timeRange?.[0]
            ? config.timeRange[0].format("HH:mm")
            : "08:00",
          endTime: config.timeRange?.[1]
            ? config.timeRange[1].format("HH:mm")
            : "18:00",
          isActive: config.isActive ?? false,
        }),
      ),
    };

    try {
      if (valuesLine) {
        await roomService.update(
          valuesLine.id,
          formatRoomPayload(formattedValues),
        );
      } else {
        await roomService.create(
          businessId,
          formatRoomPayload(formattedValues),
        );
      }
      formik.resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting room data:", error);
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
      <DialogTitle>{valuesLine ? "Editar sala" : "Nova sala"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel htmlFor="name" size="small">
                  Nome
                </InputLabel>
                <OutlinedInput
                  id="name"
                  label="Nome"
                  size="small"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                  <Typography variant="caption" color="error">
                    {formik.errors.name}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="capacity" size="small">
                  Capacidade
                </InputLabel>
                <OutlinedInput
                  id="capacity"
                  label="Capacidade"
                  size="small"
                  type="number"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.capacity && Boolean(formik.errors.capacity)
                  }
                />
                {formik.touched.capacity && formik.errors.capacity && (
                  <Typography variant="caption" color="error">
                    {formik.errors.capacity}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel htmlFor="price" size="small">
                  Taxa
                </InputLabel>
                <OutlinedInput
                  id="price"
                  label="Preço"
                  size="small"
                  value={formik.values.price}
                  onChange={(e) =>
                    formik.setFieldValue("price", moneyMask(e.target.value))
                  }
                  error={formik.touched.price && Boolean(formik.errors.price)}
                />
                {formik.touched.price && formik.errors.price && (
                  <Typography variant="cdayaption" color="error">
                    {formik.errors.price}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      name="status"
                      checked={formik.values.status}
                      onChange={(e) =>
                        formik.setFieldValue("status", e.target.checked)
                      }
                    />
                  }
                  label={formik.values.status ? "Ativo" : "Inativo"}
                />
              </FormControl>
            </Grid>
          </Grid>

          <OperationGroup formik={formik} />

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {valuesLine ? "Editar sala" : "Cadastrar sala"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const OperationGroup = ({ formik }) => {
  return (
    <div>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        Funcionamento
      </FormLabel>
      <FormGroup>
        {days.map((day, index) => (
          <Grid
            container
            key={index}
            sx={{ p: 1, alignItems: "center", borderRadius: 1 }}
          >
            <Grid item xs="auto" minWidth={180}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      formik.values.agendaConfigurations[index]?.isActive ||
                      false
                    }
                    onChange={(e) =>
                      formik.setFieldValue(
                        `agendaConfigurations.${index}.isActive`,
                        e.target.checked,
                      )
                    }
                  />
                }
                label={day.name}
              />
            </Grid>

            <Grid item xs="auto" maxWidth={300}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <MultiInputTimeRangeField
                  slotProps={{
                    textField: ({ position }) => ({
                      label: position === "start" ? "Início" : "Fim",
                      size: "small",
                    }),
                  }}
                  format="HH:mm"
                  disabled={
                    !formik.values.agendaConfigurations[index]?.isActive
                  }
                  value={
                    formik.values.agendaConfigurations[index]?.timeRange || [
                      null,
                      null,
                    ]
                  }
                  onChange={(newValue) =>
                    formik.setFieldValue(
                      `agendaConfigurations.${index}.timeRange`,
                      newValue,
                    )
                  }
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        ))}
      </FormGroup>
    </div>
  );
};

export default RoomModal;
