import clsx from 'clsx';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { ptBR } from 'date-fns/locale';
import { IoMdTime } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { useContext, useEffect, useState } from 'react';
import { CalendarContext } from '../context/calendar-context';
import {
    Button,
    Dialog,
    InputLabel,
    Typography,
    DialogTitle,
    FormControl,
    Select,
    MenuItem,
    DialogContent,
    DialogActions,
    Switch,
    Grid,
    Autocomplete,
    Box,
    DialogContentText,
    TextField,
    useMediaQuery,
    useTheme,
    IconButton
} from '@mui/material';

import TimeSelect from '../time-select';
import Datepicker from '../date-picker';
import servicesService from '../../../../domains/services/servicesService';
import clientService from '../../../../domains/client/clientService';
import appointmentService from '../../../../domains/appointment/appointmentService';

import { StyledDialog, timeOptions, validationSchema, classes, getServiceDuration, StyledTooltip, getInitialAndEndTime } from './calendarDialog.constants';
import { useDebounce } from '../../../utils/useDebounce';

function CalendarEventDialog() {
    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { eventID = 0, openDialog, eventBeginDate, eventBeginTime, service, client, status, isPaidWithLoyaltyPoints, isPaid } = stateCalendar;

    const [endTime, setEndTime] = useState('--:--');
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [clientInput, setClientInput] = useState('');

    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleCloseDialog = () => {
        setStateCalendar({ ...stateCalendar, openDialog: false, openViewDialog: false });
    };

    const { id: businessId } = useSelector((state) => state?.auth.user) || { id: undefined };
    const { data: servicesList } = useSelector((state) => state?.services) || { data: [] };
    const { data: clientsList } = useSelector((state) => state?.clients) || { data: [] };
    const { data: appointments } = useSelector((state) => state?.appointments) || { data: [] };
    const { data: calendarBlocks } = useSelector((state) => state?.calendarBlocks) || { data: [] };
    const scheduleState = useSelector((state) => state?.user.schedule)  || [];

    const [filteredClientsList, setFilteredClientsList] = useState(clientsList);

    const initialOptionTime = timeOptions(getInitialAndEndTime(scheduleState, format(new Date(eventBeginDate), 'eeee')));

    const formik = useFormik({
        initialValues: {
            serviceTF: service || '',
            clientTF: client ? { value: client, label: clientsList.find((c) => c.id == client)?.name || '' } : { value: '', label: '' },
            statusTF: status || 'SCHEDULED',
            isPaidWithLoyaltyPointsTF: isPaidWithLoyaltyPoints || false,
            isPaidTF: isPaid || false,
            beginDate: eventBeginDate,
            beginTime: eventBeginTime
        },
        enableReinitialize: true,
        validationSchema: validationSchema(appointments, servicesList, eventID, scheduleState, calendarBlocks),
        onSubmit: (values) => handleSubmit(values)
    });

    useEffect(() => {
        if (businessId) {
            servicesService.read({businessId, limit: 1000, status: true});
            clientService.read({businessId});
        }
    }, [businessId]);

    const debouncedClientInput = useDebounce(clientInput, 500);

    useEffect(() => {
        if (businessId) {
            const getClients = async () => {
                const clients = await clientService.read({businessId, search: debouncedClientInput});
                setFilteredClientsList(clients.data);
            };
            getClients();
        }
    }, [businessId, debouncedClientInput]);

    useEffect(() => {
        if (formik.values.beginDate && formik.values.beginTime && initialOptionTime.length > 0) {
            let beginTimeValue = formik.values.beginTime?.value;
            if (beginTimeValue?.length === 4) {
                beginTimeValue = '0' + beginTimeValue;
            }
            const initialTimeOption = initialOptionTime.find((time) => time.value == beginTimeValue);
            formik.setFieldValue('beginTime', initialTimeOption || initialOptionTime[0]);
        }
    }, [formik.values.beginDate]);

    useEffect(() => {
        if (formik.values.beginTime && formik.values.serviceTF && formik.values.beginDate) {
            const serviceDuration = getServiceDuration(formik.values.serviceTF, servicesList);
            const initialTime = format(formatDateTime(formik.values.beginDate, formik.values.beginTime.value), 'yyyy/MM/dd HH:mm:ss', { locale: ptBR });

            const endTime = dayjs(initialTime).add(serviceDuration, 'minute');
            const formattedEndTime = dayjs(endTime).format('HH:mm');
            setEndTime(formattedEndTime);
        }else {
            setEndTime('--:--');
        }
    }, [formik.values.beginTime, formik.values.serviceTF, servicesList]);

    const handleClose = () => {
        handleCloseDialog();
        setOpenDeleteConfirm(false);
    };

    const handleSubmit = (values) => {
        const markerData = {
            clientId: values.clientTF.value,
            serviceId: values.serviceTF,
            dateAndTime: format(formatDateTime(values.beginDate, values.beginTime.value), 'yyyy/MM/dd HH:mm:ss', { locale: ptBR }),
            isPaidWithLoyaltyPoints: values.isPaidWithLoyaltyPointsTF,
            isPaid: values.isPaidTF,
            appointmentStatus: values.statusTF
        };

        if (eventID) {
            appointmentService.update(eventID, markerData);
        } else {
            appointmentService.create(businessId, markerData);
        }

        handleClose();
    };

    const formatDateTime = (newDate, newTime) => {
        if (newDate === null) return;
        const dateTxt = format(newDate, 'yyyy/MM/dd');
        return new Date(dateTxt + ' ' + newTime);
    };

    const handleDelete = () => {
        appointmentService.remove(eventID);
        handleCloseDialog();
        setOpenDeleteConfirm(false);
    };

    const handleOpenDeleteConfirm = () => {
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    return (
        <>
            <StyledDialog maxWidth="sm" fullWidth={true} open={openDialog} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        {eventID ? 'Editar Agendamento' : 'Novo Agendamento'}
                        {eventID ? <MdDeleteOutline style={{ cursor: 'pointer', color: 'red', fontSize: 25 }} onClick={handleOpenDeleteConfirm} /> : null}
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', m: 'auto', pt: 2, gap: 3 }}>
                        <FormControl>
                            <InputLabel htmlFor="serviceTF" size="small">
                                Serviço
                            </InputLabel>
                            <Select
                                id="serviceTF"
                                name="serviceTF"
                                label="Serviço"
                                size="small"
                                value={formik.values.serviceTF}
                                onChange={formik.handleChange}
                                error={formik.touched.serviceTF && Boolean(formik.errors.serviceTF)}
                            >
                                {servicesList.map((service) => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.serviceTF && formik.errors.serviceTF ? (
                                <Typography variant="caption" color="error">
                                    {formik.errors.serviceTF}
                                </Typography>
                            ) : null}
                        </FormControl>

                        <FormControl>
                            <Autocomplete
                                size="small"
                                id="clientTF"
                                name="clientTF"
                                disableClearable
                                sx={{ width: '100%' }}
                                value={formik.values.clientTF}
                                onChange={(e, value) => formik.setFieldValue('clientTF', value)}
                                onInputChange={(e, value) => setClientInput(value)} // Atualiza o estado do input
                                options={filteredClientsList.map((client) => {
                                    const name = client.name === 'Novo Cliente' ? `${client.name} - ${client.phone}` : client.name;
                                    return { value: client.id, label: name };
                                })}
                                getOptionLabel={(option) => option?.label}
                                renderInput={(params) => <TextField {...params} label="Cliente" />}
                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                            />

                            {formik.touched.clientTF && formik.errors.clientTF ? (
                                <Typography variant="caption" color="error">
                                    {formik.errors.clientTF}
                                </Typography>
                            ) : null}
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="statusTF" size="small">
                                Status
                            </InputLabel>
                            <Select
                                id="statusTF"
                                name="statusTF"
                                label="Status"
                                size="small"
                                value={formik.values.statusTF}
                                onChange={formik.handleChange}
                                error={formik.touched.statusTF && Boolean(formik.errors.statusTF)}
                            >
                                <MenuItem value="SCHEDULED">Agendado</MenuItem>
                                <MenuItem value="COMPLETED">Concluído</MenuItem>
                                <MenuItem value="CANCELLED">Cancelado</MenuItem>
                                <MenuItem value="RESCHEDULED">Reagendado</MenuItem>
                                <MenuItem value="NO_SHOW">Não compareceu</MenuItem>
                            </Select>
                            {formik.touched.statusTF && formik.errors.statusTF ? (
                                <Typography variant="caption" color="error">
                                    {formik.errors.statusTF}
                                </Typography>
                            ) : null}
                        </FormControl>

                        <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={8} style={{ paddingBlock: 15 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <Typography>Data do agendamento</Typography>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Datepicker
                                                styleCls={classes.datepicker}
                                                dateFormat={'dd/MM/yyyy'}
                                                originalValue={new Date(formik.values.beginDate)}
                                                onChange={(e) => {
                                                    formik.setFieldValue('beginDate', e);
                                                    setStateCalendar({ ...stateCalendar, eventBeginDate: e });
                                                }}
                                            />
                                            <Typography className={classes.dayOfWeek}>
                                                {formik.values.beginDate !== null && format(new Date(formik.values.beginDate), 'eeee', { locale: ptBR })}
                                            </Typography>
                                        </div>
                                        {formik.touched.beginDate && formik.errors.beginDate ? (
                                            <Typography variant="caption" color="error">
                                                {formik.errors.beginDate}
                                            </Typography>
                                        ) : null}
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: isSmUp ? 'flex-end' : 'flex-start', paddingBlock: 15 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <Typography>Horário</Typography>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <TimeSelect
                                                placeholder={''}
                                                options={timeOptions(getInitialAndEndTime(scheduleState, format(new Date(formik.values.beginDate), 'eeee')))}
                                                originalValue={{
                                                    value: formik.values.beginTime.value,
                                                    label: formik.values.beginTime.label
                                                }}
                                                onChange={(e) => formik.setFieldValue('beginTime', e)}
                                            />
                                            -<Typography sx={{ color: '#7c7c7c', border: '1px solid #bebebe', padding: '8px 10px', borderRadius: 1 }}>{endTime}</Typography>
                                            <IoMdTime />
                                        </div>
                                    </div>
                                </Grid>
                                {formik.touched.beginTime && formik.errors.beginTime ? (
                                    <Typography variant="caption" color="error" sx={{ marginLeft: 2 }}>
                                        {formik.errors.beginTime}
                                    </Typography>
                                ) : null}
                            </Grid>
                        </FormControl>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                                <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                                    <Typography>Pago com pontos de fidelidade</Typography>
                                    <StyledTooltip
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#824d9e',
                                            borderRadius: '50%',
                                            padding: 2,
                                            marginInline: '4px 8px'
                                        }}
                                        placement="bottom-start"
                                        title={`Ao selecionar essa opção e o status "Concluído" o cliente terá seus pontos fidelidades zerados.`}
                                    >
                                        <IconButton>
                                            <FaRegCircleQuestion fontSize={16} style={{ color: '#ffffff', cursor: 'pointer' }} />
                                        </IconButton>
                                    </StyledTooltip>
                                    <Switch
                                        checked={formik.values.isPaidWithLoyaltyPointsTF}
                                        onChange={(e) => formik.setFieldValue('isPaidWithLoyaltyPointsTF', e.target.checked)}
                                        color="primary"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl
                                    className={clsx(classes.formControl, classes.formControlFlex)}
                                    style={{ display: 'flex', justifyContent: isSmUp ? 'flex-end' : 'flex-start', paddingTop: 0 }}
                                >
                                    <Typography>Pago</Typography>
                                    <Switch checked={formik.values.isPaidTF} onChange={(e) => formik.setFieldValue('isPaidTF', e.target.checked)} color="primary" />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                {eventID ? 'Editar Agendamento' : 'Agendar'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </StyledDialog>

            <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Confirmar exclusão'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Confirmar exclusão
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CalendarEventDialog;
