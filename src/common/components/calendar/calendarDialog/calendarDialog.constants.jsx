import dayjs from 'dayjs';
import * as Yup from 'yup';
import { format } from 'date-fns';
import styledComponents from 'styled-components';
import { Dialog } from '@mui/material';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
dayjs.extend(duration);
dayjs.extend(isBetween);

const getDayOfWeek = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY'
};

const portugueseToEnglish = {
    'segunda-feira': 'MONDAY',
    'terça-feira': 'TUESDAY',
    'quarta-feira': 'WEDNESDAY',
    'quinta-feira': 'THURSDAY',
    'sexta-feira': 'FRIDAY',
    sábado: 'SATURDAY',
    domingo: 'SUNDAY'
};

export const getInitialAndEndTime = (userData, weekDay) => {
    if (!userData.length) return { initialTime: '07:00', endTime: '18:00' };

    const englishWeekDay = portugueseToEnglish[weekDay.toLowerCase()] || weekDay.toUpperCase();
    const daySelected = userData.find((day) => day.day === englishWeekDay);

    if (!daySelected) return { initialTime: '07:00', endTime: '18:00' };

    return { initialTime: daySelected.startTime, endTime: daySelected.endTime };
};

export const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

export const validationSchema = (appointments, roomsList, eventID, calendarBlocks, weekDay) =>
    Yup.object({
        roomTF: Yup.string().required('Escolha uma sala.'),
        descriptionTF: Yup.string().required('Descrição é obrigatória.'),
        clientTF: Yup.object().test('is-empty', 'Escolha um cliente.', function (value) {
            return value?.value;
        }),
        statusTF: Yup.string().required('Escolha um status.'),
        beginDate: Yup.string().required('Escolha uma data.'),
        beginTime: Yup.object()
            .required('Escolha um horário.')
            .test('conflict', 'O horário selecionado conflita com outro agendamento.', function (value) {
                const { beginDate, endTime, roomTF } = this.parent;
                const initialTime = value?.value;
                if (!beginDate || !initialTime || !endTime?.value || !roomTF) {
                    return true;
                }
                const formattedDate = dayjs(beginDate).format('YYYY-MM-DD');
                const startDateTime = dayjs(`${formattedDate} ${initialTime}`, 'YYYY-MM-DD HH:mm');
                const endDateTime = dayjs(`${formattedDate} ${endTime.value}`, 'YYYY-MM-DD HH:mm');

                const appointmentsFiltered = appointments.filter((appointment) => appointment.id !== eventID && appointment.roomId === roomTF);
                for (let appointment of appointmentsFiltered) {
                    const appointmentStart = dayjs(appointment.begin, 'YYYY-MM-DD HH:mm:ss').add(1, 'minute');
                    const appointmentEnd = dayjs(appointment.end, 'YYYY-MM-DD HH:mm:ss').subtract(1, 'minute');
                    if (
                        (startDateTime.isBefore(appointmentEnd) && startDateTime.isAfter(appointmentStart)) ||
                        (endDateTime.isBefore(appointmentEnd) && endDateTime.isAfter(appointmentStart)) ||
                        (appointmentStart.isBefore(endDateTime) && appointmentEnd.isAfter(startDateTime))
                    ) {
                        return this.createError({
                            message: 'O horário selecionado conflita com outro agendamento na mesma sala.'
                        });
                    }
                }

                const room = roomsList.find((r) => r.id === roomTF);
                if (room && room.agendaConfigurations && room.agendaConfigurations.length) {
                    const portugueseToEnglish = {
                        'segunda-feira': 'MONDAY',
                        'terça-feira': 'TUESDAY',
                        'quarta-feira': 'WEDNESDAY',
                        'quinta-feira': 'THURSDAY',
                        'sexta-feira': 'FRIDAY',
                        sábado: 'SATURDAY',
                        domingo: 'SUNDAY'
                    };
                    const englishWeekDay = portugueseToEnglish[weekDay.toLowerCase()] || weekDay.toUpperCase();
                    const agendaForDay = room.agendaConfigurations.find((ac) => ac.day === englishWeekDay && ac.isActive);
                    if (!agendaForDay) {
                        return this.createError({
                            message: 'Não há configuração de horário para a sala no dia selecionado.'
                        });
                    }
                    const agendaStart = dayjs(`${formattedDate} ${agendaForDay.startTime}`, 'YYYY-MM-DD HH:mm');
                    const agendaEnd = dayjs(`${formattedDate} ${agendaForDay.endTime}`, 'YYYY-MM-DD HH:mm');
                    if (startDateTime.isBefore(agendaStart) || endDateTime.isAfter(agendaEnd)) {
                        return this.createError({
                            message: 'O horário selecionado está fora do horário de funcionamento da sala para o dia.'
                        });
                    }
                }

                const calendarBlocksFiltered = calendarBlocks.filter((block) => block.deletedAt === null);
                for (let block of calendarBlocksFiltered) {
                    const blockStart = dayjs(block.initialTime).add(1, 'minute');
                    const blockEnd = dayjs(block.endTime).subtract(1, 'minute');
                    if ((startDateTime.isBefore(blockEnd) && endDateTime.isAfter(blockStart)) || startDateTime.isSame(blockStart) || endDateTime.isSame(blockEnd)) {
                        return this.createError({
                            message: 'O horário selecionado conflita com um bloqueio.'
                        });
                    }
                }
                return true;
            }),
        endTime: Yup.object()
            .required('Horário final é obrigatório')
            .test('horario-final', 'O horário final não pode ser menor que o horário inicial', function (value) {
                const { beginTime } = this.parent;
                return timeToMinutes(value.value) >= timeToMinutes(beginTime.value);
            })
    });

const interval = 30;
export const timeOptions = (initialAndEndTime) => {
    const { initialTime, endTime } = initialAndEndTime || {};
    const [startHour, startMinute] = initialTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            if (hour === startHour && minute < startMinute) continue;
            if (hour === endHour && minute > endMinute) break;

            const timeItem = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options.push({ value: timeItem, label: timeItem });
        }
    }
    return options;
};

const PREFIX = 'CalendarEventDialog';
export const classes = {
    formControlFlex: `${PREFIX}-formControlFlex`,
    datepicker: `${PREFIX}-datepicker`
};

export const StyledDialog = styledComponents(Dialog)(() => ({
    [`& .${classes.formControlFlex}`]: {
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    [`& .${classes.datepicker}`]: {
        width: 130
    }
}));

export const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(53, 53, 53, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 12
    }
}));

export const formatDateTime = (newDate, newTime) => {
    if (newDate === null) return;
    const dateTxt = format(newDate, 'yyyy/MM/dd');
    return new Date(dateTxt + ' ' + newTime);
};
