import Calendar from '../../components/calendar/calendar';
import ReservedTimes from '../../components/reserved-times/reserved-times';
import { Grid } from '@mui/material';

export default function Schedule() {
    return (
        <Grid container spacing={1} sx={{ py: 4 }}>
            <Grid item xs={6} md={8}>
                <Calendar />
            </Grid>
            <Grid item xs={6} md={4}>
                <ReservedTimes />
            </Grid>
        </Grid>
    );
}
