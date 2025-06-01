import { useState, useEffect, useContext, useMemo } from 'react';

import clsx from 'clsx';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Box, Grid } from '@mui/material';
import { CalendarContext } from './context/calendar-context';
import { createStyles, makeStyles } from '@mui/styles';
import { grey, blue } from '@mui/material/colors';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
    createStyles({
        headerFirstColumn: {
            height: 15,
            marginTop: 85,
            paddingLeft: 8,
            borderRight: '1px solid #dadce0'
        },
        headerColumn: {
            borderRight: '1px solid #dadce0',
            position: 'relative',
            paddingInline: 12,
            flex: '1 1 auto',
            height: 15,
            width: 'calc(100% / 7)'
        },
        headerColumnWeekend: {
            backgroundColor: '#F5F5F5'
        },
        headerLabelsFirst: {
            height: 20,
            width: '100%',
            // border: '1px solid red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            color: '#70757a',
            fontWeight: 500,
            textTransform: 'uppercase'
        },
        headerLabelsSecond: {
            height: 45,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#',
            [theme.breakpoints.down('md')]: {
                fontSize: 16
            }
        },
        headerLabelsThird: {
            position: 'absolute',
            top: -7,
            left: -1,
            height: 20,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
        },
        headerLabelToday: {
            minWidth: 43,
            minHeight: 43,
            // lineHeight: '45px',
            padding: 7,
            borderColor: blue[700],
            backgroundColor: blue[700],
            color: '#ffffff',
            border: '1px solid',
            borderRadius: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            lineHeight: 'normal',
            '&:hover': {
                borderColor: blue[800],
                backgroundColor: blue[800]
            }
        },
        headerLabelNotToday: {
            width: 45,
            height: 45,
            lineHeight: '45px',
            borderColor: 'transparent',
            backgroundColor: theme.palette.background.paper,
            textAlign: 'center',
            border: '1px solid',
            borderRadius: '100%',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: grey[200]
            }
        },
        headerLabelColumn: {
            borderRight: '1px solid green'
        },
        headerLabelText: {
            borderRight: '1px solid green'
        },
        timeColumnContainer: {
            color: theme.palette.text.secondary,
            backgroundColor: 'transparent',
            height: 'auto',
            overflowY: 'hidden',
            flex: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            minWidth: 40,
            maxWidth: 40,
            marginTop: '-8px'
        },
        timeColumn: {
            position: 'relative',
            webkitBoxSizing: 'border-box',
            marginLeft: 'auto'
        },
        timeColumnElement: {
            position: 'relative',
            height: 60,
            paddingRight: 8,
            textAlign: 'right',
            color: '#70757a',
            fontSize: 12
        },
        board: {
            // minWidth: '100%',
            height: '100%',
            flex: 'none',
            verticalAlign: 'top',
            overflow: 'hidden',
            position: 'relative'
            // paddingBottom: 20
        }
    })
);

function CalendarHeader(props) {
    const classes = useStyles();

    const { selectedWeekIndex, selectedWeek } = props;

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { selectedDate, layout, defaultEventDuration } = stateCalendar;
    const [currentTimePosition, setCurrentTimePosition] = useState();

    const location = useLocation();

    useEffect(() => {
        setInterval(() => {
            const now = new Date();
            const initTime = new Date(format(now, 'yyyy/MM/dd 0:0:0', { locale: ptBR }));
            const position = differenceInMinutes(now, initTime);
            setCurrentTimePosition(position);
        }, 1000);
    }, []);

    return useMemo(() => {
        const viewLayout = Array.from(Array(layout === 'week' ? 7 : layout === 'day' ? 1 : 0).keys());

        const handleDayClick = (event) => {
            if (location.pathname === '/calendario') return;
            const gridParent = event.target.parentElement.parentElement;
            setStateCalendar({
                ...stateCalendar,
                layout: 'day',
                selectedDate: new Date(gridParent.dataset.day)
            });
            // handleOpenCloseDialog()
        };

        return (
            <Grid
                container
                spacing={0}
                direction="row"
                justify="center"
                alignItems="stretch"
                sx={{
                    height: 80,
                    '&:after': {
                        content: "''",
                        position: 'absolute',
                        top: 165,
                        left: 300,
                        borderTop: '1px solid #dadce0'
                    }
                }}
            >
                <Box item xs={1} className={clsx(classes.timeColumnContainer, classes.timeColumn)}>
                    <div className={clsx(classes.timeColumnElement)} />
                </Box>

                <Grid item xs>
                    <Grid container spacing={0} direction="row" justify="center" alignItems="flex-start" className={classes.board}>
                        {/* <div className={classes.headerFirstColumn} /> */}

                        {/* {TODO VERIFICAR ERRO DE RENDERIZAÇÃO DA DATA} */}

                        {viewLayout.map((index) => {
                            const day = layout === 'week' ? selectedWeek[index] : selectedDate;
                            const isToday = format(day, 'ddMMyyyy', { locale: ptBR }) === format(new Date(), 'ddMMyyyy', { locale: ptBR });

                            return (
                                <Grid
                                    item
                                    xs
                                    id={`headerDay${index}`}
                                    data-group="day-header"
                                    data-day={day}
                                    className={classes.headerColumn}
                                    key={`header-label-${layout}-${selectedWeekIndex}-${day}`}
                                >
                                    <div className={classes.headerLabelsFirst}>
                                        <span>{format(day, 'EEE', { locale: ptBR }).substring(0, 3)}</span>
                                    </div>
                                    <div className={classes.headerLabelsSecond}>
                                        <span
                                            onClick={handleDayClick}
                                            className={clsx({
                                                [classes.headerLabelNotToday]: !isToday,
                                                [classes.headerLabelToday]: isToday
                                            })}
                                        >
                                            {format(day, 'd', { locale: ptBR })}
                                        </span>
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes, currentTimePosition, selectedDate, layout, defaultEventDuration, selectedWeek, selectedWeekIndex]);
}

export default CalendarHeader;
