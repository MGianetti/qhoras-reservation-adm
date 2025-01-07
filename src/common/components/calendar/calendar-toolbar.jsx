import { useContext, useMemo } from 'react';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { Toolbar, Tooltip, Typography, IconButton } from '@mui/material';

import { MdOutlineViewModule, MdOutlineViewWeek, MdOutlineToday, MdOutlineCalendarViewDay } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';

import { styled } from '@mui/material/styles';

import { CalendarContext } from './context/calendar-context';
import getWeekDays from './common/getWeekDays';
import getSelectedWeekIndex from './common/getSelectedWeekIndex';
import { createStyles, makeStyles } from '@mui/styles';
import clsx from 'clsx';

const PREFIX = 'CalendarToolbar';

const drawerWidth = 260;

const StyledRoot = styled('div')(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderBottom: '1px solid #E0E0E0',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    [`&.${PREFIX}-appBarShift`]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    }
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2)
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    fontWeight: 400,
    fontSize: theme.spacing(3),
    textTransform: 'capitalize',
    [theme.breakpoints.down('md')]: {
        fontSize: 14
    }
}));

const StyledTooltip = styled(Tooltip)(() => ({
    marginTop: 2
}));

const useStyles = makeStyles((theme) =>
    createStyles({
        miniCalendarOpen: {
            [theme.breakpoints.up('md')]: {
                display: 'none !important'
            }
        },
        miniCalendarOpenSelected: {
            [theme.breakpoints.down('md')]: {
                backgroundColor: '#e9d3f8 !important'
            }
        },
        miniCalendarToday: {
            [theme.breakpoints.down('md')]: {
                display: 'none !important'
            }
        },
        navigation: {
            [theme.breakpoints.down('md')]: {
                display: 'none !important'
            }
        }
    })
);

function CalendarToolbar(props) {
    const { goToToday, next, previous, openCalendar, miniCalendarOpen, refreshCalendar, isLoading } = props;

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { selectedDate, layout } = stateCalendar;
    const classes = useStyles();

    return useMemo(() => {
        const setLayout = (props) => {
            const { option } = props;
            setStateCalendar({ ...stateCalendar, layout: option });
        };

        const weeks = getWeekDays(selectedDate, 7);
        const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0);
        const selectedWeek = weeks[selectedWeekIndex];

        const firstDayOfWeekMonth = format(selectedWeek[0], 'MMM', { locale: ptBR });

        const lastDayOfWeekMonth = format(selectedWeek[6], 'MMM', { locale: ptBR });
        const firstDayOfWeekYear = format(selectedWeek[0], 'yyyy', { locale: ptBR });
        const lastDayOfWeekYear = format(selectedWeek[6], 'yyyy', { locale: ptBR });

        const showMonthsAndYears =
            layout === 'week' && firstDayOfWeekMonth !== lastDayOfWeekMonth && firstDayOfWeekYear !== lastDayOfWeekYear
                ? `${firstDayOfWeekMonth} ${firstDayOfWeekYear} - ${lastDayOfWeekMonth} ${lastDayOfWeekYear}`
                : false;

        const showMonthsAndYear =
            !showMonthsAndYears && layout === 'week' && firstDayOfWeekMonth !== lastDayOfWeekMonth ? `${firstDayOfWeekMonth} - ${lastDayOfWeekMonth} ${firstDayOfWeekYear}` : false;
        const showMonthAndYear = !showMonthsAndYear ? format(selectedDate, 'MMMM yyyy', { locale: ptBR }) : false;

        return (
            <StyledRoot>
                <Toolbar>
                    <StyledTooltip title="Hoje" className={classes.miniCalendarToday} style={{ marginRight: 0 }}>
                        <StyledMenuButton disabled={isLoading} color="inherit" aria-label="Hoje" onClick={goToToday} edge="start">
                            <MdOutlineToday />
                        </StyledMenuButton>
                    </StyledTooltip>

                    <StyledTooltip
                        title="Calendário"
                        className={clsx(classes.miniCalendarOpen, {
                            [classes.miniCalendarOpenSelected]: miniCalendarOpen
                        })}
                        style={{ marginRight: 0 }}
                    >
                        <StyledMenuButton color="inherit" aria-label="Calendário" disabled={isLoading} onClick={openCalendar} edge="start">
                            <MdOutlineToday />
                        </StyledMenuButton>
                    </StyledTooltip>

                    <StyledTooltip title="Atualizar" style={{ marginRight: '16px' }}>
                        <IconButton disabled={isLoading} color="inherit" onClick={refreshCalendar}>
                            <IoMdRefresh />
                        </IconButton>
                    </StyledTooltip>

                    <div className={classes.navigation}>
                        <StyledTooltip title="Anterior">
                            <IconButton disabled={isLoading} onClick={previous}>
                                <IoIosArrowBack />
                            </IconButton>
                        </StyledTooltip>

                        <StyledTooltip title="Próximo">
                            <IconButton disabled={isLoading} onClick={next}>
                                <IoIosArrowForward />
                            </IconButton>
                        </StyledTooltip>
                    </div>

                    <StyledTitle>{showMonthsAndYears || showMonthsAndYear || showMonthAndYear}</StyledTitle>

                    <StyledTooltip title="Visualização Diária">
                        <IconButton disabled={isLoading} color="inherit" aria-label="Visualização Diária" onClick={(e) => setLayout({ e, option: 'day' })} edge="start">
                            <MdOutlineCalendarViewDay />
                        </IconButton>
                    </StyledTooltip>

                    <StyledTooltip title="Visualização Semanal">
                        <IconButton disabled={isLoading} color="inherit" aria-label="Visualização Semanal" onClick={(e) => setLayout({ e, option: 'week' })} edge="start">
                            <MdOutlineViewWeek />
                        </IconButton>
                    </StyledTooltip>

                    <StyledTooltip title="Visualização Mensal">
                        <IconButton disabled={isLoading} color="inherit" aria-label="Visualização Mensal" onClick={(e) => setLayout({ e, option: 'month' })} edge="start">
                            <MdOutlineViewModule />
                        </IconButton>
                    </StyledTooltip>
                </Toolbar>
            </StyledRoot>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, layout, goToToday, next, previous]);
}

export default CalendarToolbar;
