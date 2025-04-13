import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
} from "@mui/material";

const AdditionalSettingsGroup = () => {
  const handleCheckboxChange = (event) => {
    console.log(event.target.checked);
  };

  return (
    <>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        Fidelidade
      </FormLabel>
      <FormGroup>
        <Grid item xs="auto" minWidth={180}>
          <FormControlLabel
            control={
              <Checkbox onChange={handleCheckboxChange} name="loyaltyPoints" />
            }
            label="Ativar fidelidade do cliente?"
          />
        </Grid>
      </FormGroup>
    </>
  );
};

export default AdditionalSettingsGroup;
