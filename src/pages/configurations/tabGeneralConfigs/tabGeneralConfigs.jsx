import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Button, Grid } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

import userService from '../../../domains/user/userService';
import OperationGroup from '../../../common/components/rowGroups/operationGroup/operationGroup';
import BlockTimeGroup from '../../../common/components/rowGroups/blockTimeGroup/blockTimeGroup';
import LoadingOverlay from '../../../common/components/LoadingOverlay/LoadingOverlay';
import SuggestionGroup from '../../../common/components/rowGroups/suggestionGroup/suggestionGroup';

import styles from './tabGeneralConfigs.module.scss';

function TabGeneralConfigs() {
    const theme = useTheme();

    const {schedule: scheduleState, suggestionTime: suggestionTimeState, isLoading} = useSelector((state) => state?.user) || [];

    const { id: businessId } = useSelector((state) => state?.auth.user) || { businessId: undefined };

    const diasDaSemana = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

    const initialCheckedDays = days.reduce((acc, day, index) => {
        if (!scheduleState) return acc;
        const userDataDay = scheduleState?.find((d) => d.day === diasDaSemana[index]);
        acc[day] = userDataDay ? userDataDay.isActive : false;
        return acc;
    }, {});

    const initialTimeRanges = days.reduce((acc, day, index) => {
        const userDataDay = scheduleState?.find((d) => d.day === diasDaSemana[index]);
        acc[day] = userDataDay
            ? [dayjs(`2022-04-17T${userDataDay.startTime}`), dayjs(`2022-04-17T${userDataDay.endTime}`)]
            : [dayjs('2022-04-17T08:00'), dayjs('2022-04-17T17:00')];
        return acc;
    }, {});

    const handleSubmit = (values) => {
        const scheduleData = Object.entries(values.checkedDays).map(([dia, isActive], index) => {
            const [startTime, endTime] = values.timeRanges[dia].map((time) => time.format('HH:mm'));
            return {
                day: diasDaSemana[index],
                isActive,
                startTime,
                endTime
            };
        });
        userService.updateUserConfig(businessId, { scheduleData, suggestionTime: values.suggestionTime });
    };

    const formik = useFormik({
        initialValues: {
            checkedDays: initialCheckedDays,
            timeRanges: initialTimeRanges,
            suggestionTime: suggestionTimeState || 60
        },
        enableReinitialize: true,
        onSubmit: (values) => handleSubmit(values)
    });

    return (
        <Grid container>
            <LoadingOverlay isLoading={isLoading} />
            <Grid item xs={12} sx={{ boxShadow: theme.shadows[0] }} className={styles.cardGroup}>
                <form onSubmit={formik.handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5em' }}>
                        <OperationGroup formik={formik} />
                        <SuggestionGroup formik={formik} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Salvar
                        </Button>
                    </div>
                </form>
            </Grid>

            {/* <Grid item xs={12} sx={{ boxShadow: theme.shadows[0] }} className={styles.cardGroup}>
                <BlockTimeGroup />
            </Grid> */}
        </Grid>
    );
}

export default TabGeneralConfigs;
