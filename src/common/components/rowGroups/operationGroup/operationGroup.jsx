import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MultiInputTimeRangeField } from "@mui/x-date-pickers-pro";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Button,
} from "@mui/material";

import userService from "../../../../domains/user/userService";

const OperationGroup = ({ formik }) => {
  const days = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

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
                    checked={formik.values.checkedDays[day] || false}
                    onChange={(e) => {
                      formik.setFieldValue(
                        `checkedDays.${day}`,
                        e.target.checked,
                      );
                    }}
                    name={`checkedDays.${day}`}
                  />
                }
                label={day}
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
                  disabled={!formik.values.checkedDays[day]}
                  value={formik.values.timeRanges[day] || [null, null]}
                  onChange={(newValue) => {
                    formik.setFieldValue(`timeRanges.${day}`, newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        ))}
      </FormGroup>
    </div>
  );
};

export default OperationGroup;
