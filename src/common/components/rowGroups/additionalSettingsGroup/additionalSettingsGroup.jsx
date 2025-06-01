import { Trans } from '@lingui/react/macro';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid } from '@mui/material';

const AdditionalSettingsGroup = () => {
    const handleCheckboxChange = (event) => {
        console.log(event.target.checked);
    };

    return (
        <>
            <FormLabel component="legend" sx={{ mb: 2 }}>
                <Trans>Fidelidade</Trans>
            </FormLabel>
            <FormGroup>
                <Grid item xs="auto" minWidth={180}>
                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} name="loyaltyPoints" />} label={Trans`Ativar fidelidade do cliente?`} />
                </Grid>
            </FormGroup>
        </>
    );
};

export default AdditionalSettingsGroup;
