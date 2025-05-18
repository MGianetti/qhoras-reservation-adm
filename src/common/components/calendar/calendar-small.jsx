import { useState, useContext, useEffect, useMemo } from 'react';
import { CalendarContext } from './context/calendar-context';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import { format, getMonth, addMonths, subMonths } from 'date-fns';
import { Grid, Tooltip, IconButton, Typography } from '@mui/material';
import { ptBR } from 'date-fns/locale';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoCalendarClearOutline } from 'react-icons/io5';

import { blue } from '@mui/material/colors';
import getWeekDays from './common/getWeekDays';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 264,
        minWidth: 240,
        background: theme.palette.background.paper
    },
    title: {
        marginLeft: theme.spacing(1),
        textTransform: 'capitalize'
    },

    dayHeader: {
        textAlign: 'center',
        fontSize: 12,
        color: blue[800],
        lineHeight: '26px',
        padding: theme.spacing(0.2),
        borderColor: theme.palette.background.paper,
        borderStyle: 'solid',
        textTransform: 'capitalize',
        background: theme.palette.background.paper,
        height: 34.3,
        width: 34.3
    },
    day: {
        textAlign: 'center',
        fontSize: 14,
        cursor: 'pointer',
        borderRadius: '50%',
        borderWidth: theme.spacing(0.4),
        lineHeight: '26px',
        padding: theme.spacing(0.2),
        background: theme.palette.background.paper,
        height: 34.3,
        width: 34.3
    },
    today: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.background.paper,
        background: theme.palette.background.paper,
        borderColor: theme.palette.background.paper,
        borderStyle: 'solid',
        backgroundColor: blue[700],
        '&:hover': {
            backgroundColor: blue[800]
        }
    },
    notToday: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.paper,
        borderColor: theme.palette.background.paper,
        borderStyle: 'solid',
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        }
    },
    selected: {
        borderStyle: 'solid',
        boxShadow: `inset 0 0 0 2px ${blue[500]}`,
        '&:hover': {
            color: '#ffffff',
            backgroundColor: blue[600]
        }
    },
    notCurrentMonth: {
        color: theme.palette.grey[500],
        background: theme.palette.background.paper
    },
    navigation: {
        marginRight: theme.spacing(0.5)
    },
    tooltip: {
        marginTop: 2
    },
    todayButton: {
        marginRight: 2
    },
    todayIcon: {
        fontSize: '1.5rem',
        padding: 2
    }
}));

function CalendarSmall(props) {
    const classes = useStyles();

    const { isDatepicker = false, datepickerOnChange = () => {}, datepickerValue } = props;

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { selectedDate } = stateCalendar;

    const [internalDate, setInternalDate] = useState(isDatepicker ? datepickerValue : selectedDate);
    const [selectedInternalDate, setSelectedInternalDate] = useState(isDatepicker ? datepickerValue : null);

    useEffect(() => {
        setInternalDate(isDatepicker ? datepickerValue : selectedDate);
        !isDatepicker && selectedDate !== selectedInternalDate && setSelectedInternalDate('');
    }, [selectedDate, selectedInternalDate, isDatepicker, datepickerValue]);

    return useMemo(() => {
        const weeks = getWeekDays(internalDate, 7);

        const findNewDate = (props) => {
            const { direction } = props;
            setInternalDate(direction === '<' ? subMonths(internalDate, 1) : addMonths(internalDate, 1));
        };

        const selectDate = (props) => {
            const { newDate } = props;

            if (!isDatepicker) {
                setStateCalendar((prev) => ({
                    ...prev,
                    selectedDate: newDate
                }));
                setSelectedInternalDate(newDate);
            } else {
                datepickerOnChange(newDate);
            }
        };

        return (
            <section className={classes.root}>
                <Grid container direction="row" justify="flex-end" alignItems="center" spacing={0} wrap="nowrap">
                    <Grid item xs={8}>
                        <Typography className={classes.title}>{format(internalDate, 'MMMM yyyy', { locale: ptBR })}</Typography>
                    </Grid>
                    <Grid item xs={4} container direction="row" justify="flex-end" alignItems="center" spacing={0} wrap="nowrap" className={classes.navigation}>
                        {isDatepicker && (
                            <Tooltip title={`${format(new Date(), 'EEEE, d MMMM', { locale: ptBR })}`} classes={{ tooltip: classes.tooltip }}>
                                <IconButton
                                    size="small"
                                    aria-label="Today"
                                    onClick={() => {
                                        setInternalDate(new Date());
                                    }}
                                    className={classes.todayButton}
                                >
                                    <IoCalendarClearOutline className={classes.todayIcon} />
                                </IconButton>
                            </Tooltip>
                        )}{' '}
                        <Tooltip title="Mês anterior" classes={{ tooltip: classes.tooltip }}>
                            <IconButton size="small" onClick={(event) => findNewDate({ event, direction: '<' })}>
                                <IoIosArrowBack />
                            </IconButton>
                        </Tooltip>{' '}
                        <Tooltip title="Mês posterior" classes={{ tooltip: classes.tooltip }}>
                            <IconButton size="small" onClick={(event) => findNewDate({ event, direction: '>' })}>
                                <IoIosArrowForward />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid container spacing={0} direction="row" justify="center" alignItems="center" wrap="nowrap">
                    {weeks[0].map((weekDay, index) => {
                        return (
                            <Grid item xs key={`small-calendar-column-header-${index}`}>
                                <Typography className={classes.dayHeader}>{format(weekDay, 'eeee', { locale: ptBR }).substr(0, 1)}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>

                {weeks.map((week, weekIndex) => (
                    <Grid container spacing={0} direction="row" justify="center" alignItems="center" wrap="nowrap" key={`small-calendar-line-${weekIndex}`}>
                        {week.map((day, dayIndex) => {
                            const isToday = format(day, 'ddMMyyyy', { locale: ptBR }) === format(new Date(), 'ddMMyyyy', { locale: ptBR });
                            const isSelected = format(day, 'ddMMyyyy', { locale: ptBR }) === format(selectedDate, 'ddMMyyyy', { locale: ptBR });
                            const isCurrentMonth = getMonth(internalDate) === getMonth(day);

                            return (
                                <Grid item xs key={`small-calendar-line-${weekIndex}-column-${dayIndex}`}>
                                    <Typography
                                        className={clsx(classes.day, {
                                            [classes.today]: isToday,
                                            [classes.notToday]: !isToday,
                                            [classes.selected]: isSelected && !isToday,
                                            [classes.notCurrentMonth]: !isCurrentMonth
                                        })}
                                        onClick={() => selectDate({ newDate: day })}
                                    >
                                        {day.getDate()}
                                    </Typography>
                                </Grid>
                            );
                        })}
                    </Grid>
                ))}
            </section>
        );
        // eslint-disable-next-line
    }, [classes, internalDate, selectedDate]);
}

export default CalendarSmall;
