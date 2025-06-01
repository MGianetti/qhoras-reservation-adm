import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormGroup, FormLabel, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import validationSchema from './blockTimeGroup.constants';
import calendarBlocksService from '../../../../domains/calendarBlocks/calendarBlocksService';
import { Trans } from '@lingui/react/macro';

const BlockTimeGroup = () => {
    const scheduleState = useSelector((state) => state?.user.schedule) || [];

    const formik = useFormik({
        initialValues: {
            initialDate: null,
            endDate: null,
            initialTime: null,
            endTime: null
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => handleSubmit(values)
    });

    const handleSubmit = (values) => {
        const { initialDate, endDate, initialTime, endTime } = values;

        const formattedInitialDate = dayjs(initialDate).format('YYYY-MM-DD');
        const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

        const formattedInitialTime = dayjs(initialTime).format('HH:mm');
        const formattedEndTime = dayjs(endTime).format('HH:mm');

        const blockData = {
            userId: scheduleState && scheduleState[0] ? scheduleState[0].userId : null,
            initialDate: formattedInitialDate,
            endDate: formattedEndDate,
            initialTime: formattedInitialTime,
            endTime: formattedEndTime
        };

        calendarBlocksService.create(blockData);
        formik.resetForm();
    };

    const isButtonDisabled = () => {
        const { initialDate, endDate, initialTime, endTime } = formik.values;

        if (!initialDate || !endDate || !initialTime || !endTime) return true;
        if (dayjs(initialDate).isAfter(dayjs(endDate))) return true;
        if (!dayjs(endTime).isAfter(dayjs(initialTime))) return true;

        return false;
    };

    dayjs.locale('pt-br');

    const localeText = [
        { ariaLabel: Trans`domingo`, text: Trans`D` },
        { ariaLabel: Trans`segunda-feira`, text: Trans`S` },
        { ariaLabel: Trans`terça-feira`, text: Trans`T` },
        { ariaLabel: Trans`quarta-feira`, text: Trans`Q` },
        { ariaLabel: Trans`quinta-feira`, text: Trans`Q` },
        { ariaLabel: Trans`sexta-feira`, text: Trans`S` },
        { ariaLabel: Trans`sábado`, text: Trans`S` }
    ];

    const updateWeekDays = () => {
        localeText.forEach((header, idx) => {
            const headerDay = document.querySelector(`[aria-label="${header.ariaLabel}"]`);
            if (headerDay) {
                headerDay.textContent = header.text;
            }
        });
    };

    const handleOpenCalendar = () => {
        requestAnimationFrame(() => updateWeekDays());
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <form onSubmit={formik.handleSubmit}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                    <Trans>Bloquear horários</Trans>
                </FormLabel>

                <FormGroup>
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid item xs={12} md={6} lg={3} sx={{ width: '100%' }}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label={Trans`Data inicial`}
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { size: 'small' } }}
                                minDate={dayjs().startOf('day')}
                                value={formik.values.initialDate}
                                onChange={(newValue) => {
                                    formik.setFieldValue('initialDate', newValue);
                                }}
                                onOpen={handleOpenCalendar}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3} sx={{ width: '100%' }}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label={Trans`Data final`}
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { size: 'small' } }}
                                disabled={!formik.values.initialDate}
                                minDate={formik.values.initialDate}
                                maxDate={formik.values.initialDate ? dayjs(formik.values.initialDate).add(3, 'month') : null}
                                value={formik.values.endDate}
                                onChange={(newValue) => {
                                    formik.setFieldValue('endDate', newValue);
                                }}
                                onOpen={handleOpenCalendar}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <TimePicker
                                sx={{ width: '180px' }}
                                label={Trans`Horário inicial`}
                                format="HH:mm"
                                slotProps={{
                                    textField: { size: 'small' },
                                    openPickerButton: { sx: { display: 'none' } }
                                }}
                                disabled={!formik.values.endDate}
                                value={formik.values.initialTime}
                                onChange={(newValue) => {
                                    formik.setFieldValue('initialTime', newValue);
                                }}
                            />
                            -
                            <TimePicker
                                sx={{ width: '180px' }}
                                label={Trans`Horário final`}
                                format="HH:mm"
                                slotProps={{
                                    textField: { size: 'small' },
                                    openPickerButton: { sx: { display: 'none' } }
                                }}
                                disabled={!formik.values.endDate}
                                value={formik.values.endTime}
                                onChange={(newValue) => {
                                    formik.setFieldValue('endTime', newValue);
                                }}
                            />
                        </Grid>
                    </Grid>
                </FormGroup>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={isButtonDisabled()}>
                        <Trans>Bloquear</Trans>
                    </Button>
                </div>
            </form>
        </LocalizationProvider>
    );
};

export default BlockTimeGroup;
