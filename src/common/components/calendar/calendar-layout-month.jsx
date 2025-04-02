import { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { Grid, Typography } from '@mui/material';
import clsx from 'clsx';

import { format, differenceInMinutes, getYear, getMonth, getDate, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { CalendarContext } from './context/calendar-context';
import createEditEvent from './create-edit-event';
import { useSelector } from 'react-redux';

const PREFIX = 'CalendarLayoutMonth';

const classes = {
    paperHeader: `${PREFIX}-paperHeader`,
    title: `${PREFIX}-title`,
    paper: `${PREFIX}-paper`,
    paperWeekend: `${PREFIX}-paperWeekend`,
    centerContent: `${PREFIX}-centerContent`,
    dayNumber: `${PREFIX}-dayNumber`,
    today: `${PREFIX}-today`,
    eventsContainer: `${PREFIX}-eventsContainer`,
    monthMarker: `${PREFIX}-monthMarker`,
    markerPending: `${PREFIX}-markerPending`,
    markerScheduled: `${PREFIX}-markerScheduled`,
    markerCompleted: `${PREFIX}-markerCompleted`,
    markerCancelled: `${PREFIX}-markerCancelled`,
    markerRescheduled: `${PREFIX}-markerRescheduled`,
    markerNoShow: `${PREFIX}-markerNoShow`

};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
    [`& .${classes.paperHeader}`]: {
        borderBottom: '1px solid #dadce0',
        borderRight: '1px solid #dadce0',
        paddingBlock: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0
        // minWidth: 64.38
    },

    [`& .${classes.title}`]: {
        display: 'flex',
        justifyContent: 'center',
        textTransform: 'capitalize'
    },

    [`& .${classes.paper}`]: {
        borderBottom: '1px solid #dadce0',
        borderRight: '1px solid #dadce0',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        // minWidth: 64.38,
        height: '100%'
    },

    [`& .${classes.paperWeekend}`]: {
        backgroundColor: theme.palette.grey[100]
    },

    [`& .${classes.centerContent}`]: {
        display: 'flex',
        justifyContent: 'center'
    },

    [`& .${classes.dayNumber}`]: {
        padding: 7,
        lineHeight: 'normal',
        [theme.breakpoints.down('md')]: {
            padding: 2,
            fontSize: 11
        }
    },

    [`& .${classes.today}`]: {
        color: theme.palette.background.paper,
        backgroundColor: blue[700],
        borderRadius: '50%',
        minWidth: 33,
        minHeight: 33,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: blue[800]
        }
    },

    [`& .${classes.eventsContainer}`]: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        textAlign: 'left',
        backgroundColor: 'transparent',
        position: 'relative',
        height: 'calc(100% - 35px)',
        width: '100%',
        marginTop: theme.spacing(1),
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },

    [`& .${classes.monthMarker}`]: {
        overflow: 'hidden',
        minHeight: 23,
        color: '#fff',
        padding: '1px 3px',
        marginBottom: 2,
        borderRadius: 3,
        borderTopRightRadius: 3,
        cursor: 'pointer',
        zIndex: 1,
        textOverflow: 'ellipsis',
        fontSize: 12,
        [theme.breakpoints.down('md')]: {
            fontSize: 9
        },
        '&:hover': {
            zIndex: 1,
        }
    },

    [`& .${classes.markerPending}`]: {
        color: '#000',
        backgroundColor: '#d2c619d1',
        border: '1px solid #a79c06d1',
        '&:hover': {
            border: '1px solid #a79c06d1',
            backgroundColor: '#d2c619d1'
        }
    },

    [`& .${classes.markerScheduled}`]: {
        backgroundColor: '#1976D2d1',
        border: '1px solid #1257d8c3',
        '&:hover': {
            border: '1px solid #1257d8c3',
            backgroundColor: '#1976D2d1'
        }
    },

    [`& .${classes.markerCompleted}`]: {
        backgroundColor: '#008f18',
        border: '1px solid #006400',
        '&:hover': {
            border: '1px solid #006400',
            backgroundColor: '#006400'
        }
    },

    [`& .${classes.markerCancelled}`]: {
        backgroundColor: '#FF0000',
        border: '1px solid #8B0000',
        '&:hover': {
            border: '1px solid #8B0000',
            backgroundColor: '#8B0000'
        }
    },

    [`& .${classes.markerRescheduled}`]: {
        backgroundColor: '#FFA500',
        border: '1px solid #c28108',
        '&:hover': {
            border: '1px solid #c28108',
            backgroundColor: '#c28108'
        }
    },

    [`& .${classes.markerNoShow}`]: {
        backgroundColor: '#808080',
        border: '1px solid #696969',
        '&:hover': {
            border: '1px solid #696969',
            backgroundColor: '#696969'
        }
    }
}));

function CalendarLayoutMonth(props) {
    const viewEvent = (props) => {
        const { calendarEvent } = props;

        let eventBeginDate;

        let eventEndDate;
        let minutes;
        let beginTime;
        let endTime;

        let title = '';
        let room = null;
        let client = null;
        let status = 'SCHEDULED';
        let isPaid = false;
        let description = '';

        if (calendarEvent !== null) {
            eventBeginDate = new Date(calendarEvent.begin);
            eventEndDate = new Date(calendarEvent.end);
            minutes = differenceInMinutes(eventEndDate, eventBeginDate);
            beginTime = format(eventBeginDate, 'H:mm', { locale: ptBR });
            endTime = format(eventEndDate, 'H:mm', { locale: ptBR });
            title = calendarEvent.title;
    
            room = calendarEvent?.room?.id;
            client = calendarEvent?.client?.id;
            clientName = calendarEvent?.client?.name;
            status = calendarEvent?.status;
            description = calendarEvent?.description;
            isPaid = calendarEvent?.isPaid;
        } else {
            if (eventEl.target.dataset.date === undefined) return false;
    
            datasetDate = new Date(eventEl.target.dataset.date);
    
            let position = eventEl.clientY - eventEl.target.getBoundingClientRect().top;
            if (Object.keys(eventEl.target.dataset).length === 0) {
                position = eventEl.clientY - (eventEl.clientY - +eventEl.target.style.marginTop.replace('px', ''));
                datasetDate = new Date(eventEl.target.parentElement.dataset);
            }
    
            const hour = Math.trunc(position / 60);
            const isHalfHour = Math.trunc(position / 15) % 2 === 0 ? false : true;
    
            const minute = isHalfHour ? 15 : 0;
    
            eventBeginDate = new Date(getYear(datasetDate), getMonth(datasetDate), getDate(datasetDate), hour > 23 ? 23 : hour, hour > 23 ? 15 : minute);
            eventEndDate = addMinutes(eventBeginDate, 60);
    
            minutes = differenceInMinutes(eventEndDate, eventBeginDate);
    
            beginTime = format(eventBeginDate, 'H:mm', { locale: ptBR });
            endTime = format(eventEndDate, 'H:mm', { locale: ptBR });
        }

        setStateCalendar({
            ...stateCalendar,
            openDialog: true,
            eventBeginDate: eventBeginDate,
            eventBeginTime: { value: beginTime, label: beginTime },
            eventEndDate: eventEndDate,
            eventEndTime: { value: endTime, label: endTime },
            room,
            client,
            clientName,
            status,
            isPaid,
            description,
            eventID: (calendarEvent && calendarEvent.id) || 0
        });
    };

    const { weeks } = props;

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { defaultEventDuration } = stateCalendar;

    const appointments = useSelector((state) => state?.appointments?.data) || [];

    const maxHeight = (weeks) => {
        const size = weeks.length;

        if (size === 5) {
            return {
                height: 'calc((100% / 5) - 13.2px)'
            };
        }

        return {
            height: 'calc((100% / 6) - 17.5px)',
            minHeight: '150px'
        };
    };

    const getEventData = (day) => {
        const monthEvents =
            (appointments &&
                [...appointments].sort((a, b) => {
                    return new Date(a.begin).getTime() - new Date(b.begin).getTime();
                })) ||
            [];

        const dayEvents = monthEvents.filter((event) => format(new Date(event.begin), 'yyyyMMdd', { locale: ptBR }) === format(day, 'yyyyMMdd', { locale: ptBR }));

        const dayHoursEvents = dayEvents.map((event) => new Date(event.begin).getHours()).sort((numberA, numberB) => numberA - numberB);

        const eventsByHour = dayHoursEvents.reduce((acc, hour) => {
            const len = dayHoursEvents.filter((eventHour) => eventHour === hour).length;
            !acc.some((accItem) => accItem.hour === hour) && acc.push({ hour, len });
            return acc;
        }, []);

        const markers = eventsByHour.map((evHour) => {
            return dayEvents
                .filter((event) => new Date(event.begin).getHours() === evHour.hour)
                .map((event) => (
                    <div
                        key={`event-${event.id}`}
                        className={clsx(classes.monthMarker, {
                            [classes.markerPending]: event.status === 'PENDING',
                            [classes.markerScheduled]: event.status === 'SCHEDULED',
                            [classes.markerCompleted]: event.status === 'COMPLETED',
                            [classes.markerCancelled]: event.status === 'CANCELLED',
                            [classes.markerRescheduled]: event.status === 'RESCHEDULED',
                            [classes.markerNoShow]: event.status === 'NO_SHOW'
                        })}
                        onClick={(eventEl) =>{
                            viewEvent({
                                eventEl,
                                calendarEvent: event,
                                defaultEventDuration,
                                stateCalendar,
                                setStateCalendar
                            })
                        }
                        }
                    >
                        {`${event.client?.name} - ${event.room?.name}`}
                    </div>
                ));
        });
        return markers;
    };

    return (
        <Root style={{ height: 'calc(-162px + 100vh)', overflow: 'auto' }}>
            <Grid container spacing={0} direction="row" justify="center" alignItems="center" wrap="nowrap">
                {weeks[0].map((weekDay, index) => {
                    return (
                        <Grid item xs key={`calendar-column-header-label-${index}`}>
                            <div
                                className={clsx(classes.paperHeader, {
                                    [classes.paperWeekend]: index === 0 || index === 6
                                })}
                            >
                                <Typography className={classes.title}>{format(weekDay, 'EEE', { locale: ptBR }).substring(0, 3)}</Typography>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
            {weeks.map((week, weekIndex) => (
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                    wrap="nowrap"
                    key={`calendar-main-line-${weekIndex}`}
                    style={maxHeight(weeks)}
                >
                    {week.map((day, dayIndex) => {
                        const isToday = format(day, 'ddMMyyyy', { locale: ptBR }) === format(new Date(), 'ddMMyyyy', { locale: ptBR });
                        const eventsOfDay = getEventData(day);

                        return (
                            <Grid item xs key={`calendar-main-line-${weekIndex}-column-${dayIndex}`} style={{ width: 'calc(100% / 7)' }}>
                                <div
                                    className={clsx(classes.paper, {
                                        [classes.paperWeekend]: dayIndex === 0 || dayIndex === 6
                                    })}
                                >
                                    <Typography className={clsx(classes.title)}>
                                        <span className={clsx(classes.dayNumber, { [classes.today]: isToday })}>
                                            {day.getDate()} {day.getDate() === 1 ? format(new Date(day), ' MMM', { locale: ptBR }) : null}
                                        </span>
                                    </Typography>

                                    <div
                                        className={classes.eventsContainer}
                                        data-date={day}
                                        onClick={(eventEl) =>
                                            createEditEvent({
                                                eventEl,
                                                defaultEventDuration,
                                                stateCalendar,
                                                setStateCalendar
                                            })
                                        }
                                    >
                                        {eventsOfDay}
                                    </div>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
            ))}
        </Root>
    );
}

export default CalendarLayoutMonth;
