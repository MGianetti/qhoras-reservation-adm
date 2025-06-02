import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Button, Grid } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';

import userService from '../../../domains/user/userService';
import OperationGroup from '../../../common/components/rowGroups/operationGroup/operationGroup';
import SuggestionGroup from '../../../common/components/rowGroups/suggestionGroup/suggestionGroup';
import LoadingOverlay from '../../../common/components/LoadingOverlay/LoadingOverlay';

import styles from './tabGeneralConfigs.module.scss';
import { i18n } from '@lingui/core';
import { defineMessage } from '@lingui/core/macro';

const diasDaSemana = [
    { value: 'MONDAY', label: defineMessage({ id: 'config.monday', message: 'Segunda-feira' }) },
    { value: 'TUESDAY', label: defineMessage({ id: 'config.tuesday', message: 'Terça-feira' }) },
    { value: 'WEDNESDAY', label: defineMessage({ id: 'config.wednesday', message: 'Quarta-feira' }) },
    { value: 'THURSDAY', label: defineMessage({ id: 'config.thursday', message: 'Quinta-feira' }) },
    { value: 'FRIDAY', label: defineMessage({ id: 'config.friday', message: 'Sexta-feira' }) },
    { value: 'SATURDAY', label: defineMessage({ id: 'config.saturday', message: 'Sábado' }) },
    { value: 'SUNDAY', label: defineMessage({ id: 'config.sunday', message: 'Domingo' }) }
];

function TabGeneralConfigs() {
    const theme = useTheme();

    const { schedule: scheduleState, suggestionTime: suggestionTimeState, isLoading } = useSelector((state) => state?.user) || {};

    const { id: businessId } = useSelector((state) => state?.auth.user) || {
        businessId: undefined
    };

    // Build initial "checkedDays" object keyed by diasDaSemana[i].value
    const initialCheckedDays = diasDaSemana.reduce((acc, { value }, index) => {
        if (!scheduleState) return acc;
        const userDataDay = scheduleState.find((d) => d.day === value);
        acc[value] = userDataDay ? userDataDay.isActive : false;
        return acc;
    }, {});

    // Build initial "timeRanges" object keyed by diasDaSemana[i].value
    const initialTimeRanges = diasDaSemana.reduce((acc, { value }, index) => {
        const userDataDay = scheduleState?.find((d) => d.day === value);
        acc[value] = userDataDay
            ? [dayjs(`2022-04-17T${userDataDay.startTime}`), dayjs(`2022-04-17T${userDataDay.endTime}`)]
            : [dayjs('2022-04-17T08:00'), dayjs('2022-04-17T17:00')];
        return acc;
    }, {});

    const handleSubmit = (values) => {
        const scheduleData = Object.entries(values.checkedDays).map(([dayValue, isActive]) => {
            const [startTime, endTime] = values.timeRanges[dayValue].map((time) => time.format('HH:mm'));
            return {
                day: dayValue,
                isActive,
                startTime,
                endTime
            };
        });

        userService.updateUserConfig(businessId, {
            scheduleData,
            suggestionTime: values.suggestionTime
        });
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
                        <OperationGroup
                            formik={formik}
                            days={diasDaSemana.map(({ value, label }) => ({
                                value,
                                label: i18n._(label)
                            }))}
                        />
                        <SuggestionGroup formik={formik} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            {i18n._(defineMessage({ id: 'config.save', message: 'Salvar' }))}
                        </Button>
                    </div>
                </form>
            </Grid>
        </Grid>
    );
}

export default TabGeneralConfigs;
