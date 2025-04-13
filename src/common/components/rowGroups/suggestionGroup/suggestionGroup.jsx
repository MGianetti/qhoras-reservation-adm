import { styled } from "@mui/material/styles";
import { FaRegCircleQuestion } from "react-icons/fa6";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import {
  IconButton,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Button,
} from "@mui/material";
import { useFormik } from "formik";

import userService from "../../../../domains/user/userService";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(53, 53, 53, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

const SuggestionGroup = ({ formik }) => {
  return (
    <div>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          Sugestão de horário do Whatsapp
          <StyledTooltip
            placement="bottom-start"
            title="De quanto em quanto tempo o sistema sugerirá horários para o cliente no Whatsapp."
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#824d9e",
              borderRadius: "50%",
              padding: 2,
            }}
          >
            <IconButton>
              <FaRegCircleQuestion
                fontSize={16}
                style={{ color: "#ffffff", cursor: "pointer" }}
              />
            </IconButton>
          </StyledTooltip>
        </div>
      </FormLabel>
      <FormGroup>
        <Grid item xs="auto">
          <FormControl fullWidth>
            <InputLabel htmlFor="suggestionTime" size="small">
              Tempo de sugestão
            </InputLabel>
            <Select
              id="suggestionTime"
              name="suggestionTime"
              label="Tempo de sugestão"
              size="small"
              value={formik.values.suggestionTime}
              onChange={formik.handleChange}
              error={
                formik.touched.suggestionTime &&
                Boolean(formik.errors.suggestionTime)
              }
            >
              <MenuItem value={30}>30 em 30 minutos</MenuItem>
              <MenuItem value={60}>1 em 1 hora</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </FormGroup>
    </div>
  );
};

export default SuggestionGroup;
