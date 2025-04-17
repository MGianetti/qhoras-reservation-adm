import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { validationSchema } from "./exportDialog.constants";
import appointmentService from "../../../../../domains/appointment/appointmentService";

function ExportReservationDialog({ open, setOpenExportDialog }) {

  const businessId = useSelector((state) => state.auth.user?.businessId);

  const handleSubmit = async (values) => {
    const startFormatted = dayjs(values.initialDate).format('YYYY-MM-DD');
    const endFormatted   = dayjs(values.endDate).format('YYYY-MM-DD');
  
    const arrayBuffer = await appointmentService.exportReservations(
      businessId,
      startFormatted,
      endFormatted
    );
  
    const blob = new Blob(
      [arrayBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
  
    const url = window.URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href      = url;
    a.download  = `reservas_${startFormatted}_${endFormatted}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  

  const onClose = () => {
    formik.resetForm();
    setOpenExportDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      initialDate: null,
      endDate: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  dayjs.locale("pt-br");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Exportar Reservas (Intervalo)</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }} component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Data inicial"
                  format="DD/MM/YYYY"
                  value={formik.values.initialDate}
                  onChange={(newValue) =>
                    formik.setFieldValue("initialDate", newValue)
                  }
                  slotProps={{ textField: { size: "small" } }}
                  onError={() => {}}
                />
                {formik.touched.initialDate && formik.errors.initialDate && (
                  <Typography variant="caption" color="error">
                    {formik.errors.initialDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Data final"
                  format="DD/MM/YYYY"
                  value={formik.values.endDate}
                  onChange={(newValue) =>
                    formik.setFieldValue("endDate", newValue)
                  }
                  slotProps={{ textField: { size: "small" } }}
                  disabled={!formik.values.initialDate}
                  minDate={formik.values.initialDate}
                  onError={() => {}}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <Typography variant="caption" color="error">
                    {formik.errors.endDate}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button onClick={onClose} sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid || !formik.values.initialDate || !formik.values.endDate}
              >
                Exportar
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

export default ExportReservationDialog;
