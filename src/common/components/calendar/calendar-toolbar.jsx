import clsx from 'clsx';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { FaList } from 'react-icons/fa6';
import { useContext, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { createStyles, makeStyles } from '@mui/styles';
import { IoIosArrowBack, IoIosArrowForward, IoMdRefresh } from 'react-icons/io';
import { PiExportBold } from 'react-icons/pi';

import { MdOutlineViewModule, MdOutlineViewWeek, MdOutlineToday, MdOutlineCalendarViewDay } from 'react-icons/md';
import { Toolbar, Tooltip, Typography, IconButton, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';

import getWeekDays from './common/getWeekDays';
import { CalendarContext } from './context/calendar-context';
import getSelectedWeekIndex from './common/getSelectedWeekIndex';

const PREFIX = 'CalendarToolbar';
const drawerWidth = 260;

const StyledLayoutButton = styled(IconButton)(({ theme, selected }) => ({
    borderRadius: 99,
    marginInline: 2,
    backgroundColor: selected ? theme.palette.primary.light : 'transparent',
    color: selected ? theme.palette.primary.contrastText : 'inherit',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.hover
    }
}));

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
        },
        roomSelector: {
            [theme.breakpoints.down('sm')]: {
                display: 'none !important'
            },
            [theme.breakpoints.up('sm')]: {
                margin: '8px 16px',
                maxWidth: '400px',
                marginLeft: 'auto'
            }
        },
        roomSelectorSmall: {
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                display: 'block'
            },
            [theme.breakpoints.up('sm')]: {
                display: 'none !important'
            }
        }
    })
);

function CalendarToolbar(props) {
    const { goToToday, next, previous, openCalendar, miniCalendarOpen, refreshCalendar, isLoading, selectedRoom, rooms, handleRoomChange, setOpenExportDialog } = props;

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { selectedDate, layout } = stateCalendar;
    const classes = useStyles();

    const location = useLocation();

    return useMemo(() => {
        const setLayout = (props) => {
            const { option } = props;
            setStateCalendar((prev) => ({
                ...prev,
                selectedDate,
                layout: option
            }));
            localStorage.setItem('calendarLayout', option);
        };

        const weeks = getWeekDays(selectedDate, 7);
        const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0);
        const selectedWeek = weeks[selectedWeekIndex];

        const firstDayOfWeekMonth = format(selectedWeek[0], 'MMM', {
            locale: ptBR
        });
        const lastDayOfWeekMonth = format(selectedWeek[6], 'MMM', { locale: ptBR });
        const firstDayOfWeekYear = format(selectedWeek[0], 'yyyy', {
            locale: ptBR
        });
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
                <Toolbar className={classes.toolbar}>
                    {/* ===== CALENDAR | WEEK | MONTH VIEWS ===== */}
                    {layout !== 'list' ? (
                        <>
                            {/* ---------- MOBILE ONLY (xs) ---------- */}
                            <Box
                                sx={{
                                    display: { xs: 'flex', sm: 'none' },
                                    flexDirection: 'column',
                                    width: '100%',
                                    gap: 2
                                }}
                            >
                                {/* Row 1: Hoje / Calendário / Atualizar / MonthYear */}
                                <Box
                                    sx={{
                                        display: { xs: 'flex', sm: 'none' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 2,
                                        width: '100%',
                                        flexWrap: 'wrap',
                                        px: 2
                                    }}
                                >
                                    <StyledTooltip title="Hoje" className={classes.miniCalendarToday}>
                                        <StyledMenuButton disabled={isLoading} aria-label="Hoje" onClick={goToToday} edge="start">
                                            <MdOutlineToday />
                                        </StyledMenuButton>
                                    </StyledTooltip>

                                    <StyledTooltip
                                        title="Calendário"
                                        className={clsx(classes.miniCalendarOpen, {
                                            [classes.miniCalendarOpenSelected]: miniCalendarOpen
                                        })}
                                    >
                                        <StyledMenuButton disabled={isLoading} aria-label="Calendário" onClick={openCalendar} edge="start">
                                            <MdOutlineToday />
                                        </StyledMenuButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Atualizar">
                                        <IconButton disabled={isLoading} onClick={refreshCalendar}>
                                            <IoMdRefresh />
                                        </IconButton>
                                    </StyledTooltip>

                                    <StyledTitle sx={{ whiteSpace: 'nowrap' }}>{showMonthsAndYears || showMonthsAndYear || showMonthAndYear}</StyledTitle>
                                </Box>

                                {/* Row 2: Export + Day/Week/Month/List */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                        width: '100%'
                                    }}
                                >
                                    <StyledTooltip title="Exportar dados">
                                        <IconButton disabled={isLoading} aria-label="Exportar dados" onClick={() => setOpenExportDialog(true)}>
                                            <PiExportBold size={20} />
                                        </IconButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Diária">
                                        <StyledLayoutButton
                                            selected={layout === 'day'}
                                            disabled={isLoading}
                                            aria-label="Visualização Diária"
                                            onClick={() => setLayout({ option: 'day' })}
                                        >
                                            <MdOutlineCalendarViewDay />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Semanal">
                                        <StyledLayoutButton
                                            selected={layout === 'week'}
                                            disabled={isLoading}
                                            aria-label="Visualização Semanal"
                                            onClick={() => setLayout({ option: 'week' })}
                                        >
                                            <MdOutlineViewWeek />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Mensal">
                                        <StyledLayoutButton
                                            selected={layout === 'month'}
                                            disabled={isLoading}
                                            aria-label="Visualização Mensal"
                                            onClick={() => setLayout({ option: 'month' })}
                                        >
                                            <MdOutlineViewModule />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Por Lista">
                                        <StyledLayoutButton
                                            selected={layout === 'list'}
                                            disabled={isLoading}
                                            aria-label="Visualização Por Lista"
                                            onClick={() => setLayout({ option: 'list' })}
                                        >
                                            <FaList size={18} />
                                        </StyledLayoutButton>
                                    </StyledTooltip>
                                </Box>
                            </Box>

                            {/* ---------- DESKTOP ONLY (sm+) ---------- */}
                            {/* LEFT – Hoje / Calendário / Refresh / Arrows / Título */}
                            <Box
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    alignItems: 'center',
                                    gap: 1,
                                    flexShrink: 0,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <StyledTooltip title="Hoje" className={classes.miniCalendarToday}>
                                    <StyledMenuButton disabled={isLoading} aria-label="Hoje" onClick={goToToday} edge="start">
                                        <MdOutlineToday />
                                    </StyledMenuButton>
                                </StyledTooltip>

                                <StyledTooltip
                                    title="Calendário"
                                    className={clsx(classes.miniCalendarOpen, {
                                        [classes.miniCalendarOpenSelected]: miniCalendarOpen
                                    })}
                                >
                                    <StyledMenuButton disabled={isLoading} aria-label="Calendário" onClick={openCalendar} edge="start">
                                        <MdOutlineToday />
                                    </StyledMenuButton>
                                </StyledTooltip>

                                <StyledTooltip title="Atualizar">
                                    <IconButton disabled={isLoading} onClick={refreshCalendar}>
                                        <IoMdRefresh />
                                    </IconButton>
                                </StyledTooltip>

                                <Box className={classes.navigation}>
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
                                </Box>

                                <StyledTitle>{showMonthsAndYears || showMonthsAndYear || showMonthAndYear}</StyledTitle>
                            </Box>

                            {/* CENTER – Room selector (desktop ≥ sm) */}
                            <Box
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    flexGrow: 1,
                                    justifyContent: 'center',
                                    minWidth: '30%',
                                    pl: 1
                                }}
                            >
                                <FormControl size="small" className={classes.roomSelector} sx={{ width: '100%', maxWidth: 420 }}>
                                    <InputLabel>Sala</InputLabel>
                                    <Select value={selectedRoom || ''} label="Sala" onChange={handleRoomChange} fullWidth>
                                        {rooms
                                            ?.slice()
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((room) => (
                                                <MenuItem key={room.id} value={room.id}>
                                                    {room.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* RIGHT – Export + view buttons (desktop ≥ sm) */}
                            {location.pathname !== '/calendario' && (
                                <Box
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' },
                                        alignItems: 'center',
                                        gap: 1,
                                        flexShrink: 0,
                                        ml: 'auto'
                                    }}
                                >
                                    <StyledTooltip title="Exportar dados">
                                        <IconButton disabled={isLoading} aria-label="Exportar dados" onClick={() => setOpenExportDialog(true)}>
                                            <PiExportBold size={20} />
                                        </IconButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Diária">
                                        <StyledLayoutButton
                                            selected={layout === 'day'}
                                            disabled={isLoading}
                                            aria-label="Visualização Diária"
                                            onClick={() => setLayout({ option: 'day' })}
                                        >
                                            <MdOutlineCalendarViewDay />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Semanal">
                                        <StyledLayoutButton
                                            selected={layout === 'week'}
                                            disabled={isLoading}
                                            aria-label="Visualização Semanal"
                                            onClick={() => setLayout({ option: 'week' })}
                                        >
                                            <MdOutlineViewWeek />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Mensal">
                                        <StyledLayoutButton
                                            selected={layout === 'month'}
                                            disabled={isLoading}
                                            aria-label="Visualização Mensal"
                                            onClick={() => setLayout({ option: 'month' })}
                                        >
                                            <MdOutlineViewModule />
                                        </StyledLayoutButton>
                                    </StyledTooltip>

                                    <StyledTooltip title="Visualização Por Lista">
                                        <StyledLayoutButton
                                            selected={layout === 'list'}
                                            disabled={isLoading}
                                            aria-label="Visualização Por Lista"
                                            onClick={() => setLayout({ option: 'list' })}
                                        >
                                            <FaList size={18} />
                                        </StyledLayoutButton>
                                    </StyledTooltip>
                                </Box>
                            )}
                        </>
                    ) : (
                        /* ===== LIST VIEW ===== */
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <h3 style={{ margin: 0, fontWeight: 500 }}>Lista de Eventos</h3>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: { xs: 1, sm: 0 },
                                    width: { xs: '100%', sm: 'auto' },
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    flexWrap: 'wrap'
                                }}
                            >
                                <StyledTooltip title="Exportar dados">
                                    <IconButton disabled={isLoading} aria-label="Exportar dados" onClick={() => setOpenExportDialog(true)}>
                                        <PiExportBold size={20} />
                                    </IconButton>
                                </StyledTooltip>

                                <StyledTooltip title="Visualização Diária">
                                    <StyledLayoutButton selected={layout === 'day'} disabled={isLoading} aria-label="Visualização Diária" onClick={() => setLayout({ option: 'day' })}>
                                        <MdOutlineCalendarViewDay />
                                    </StyledLayoutButton>
                                </StyledTooltip>

                                <StyledTooltip title="Visualização Semanal">
                                    <StyledLayoutButton selected={layout === 'week'} disabled={isLoading} aria-label="Visualização Semanal" onClick={() => setLayout({ option: 'week' })}>
                                        <MdOutlineViewWeek />
                                    </StyledLayoutButton>
                                </StyledTooltip>

                                <StyledTooltip title="Visualização Mensal">
                                    <StyledLayoutButton selected={layout === 'month'} disabled={isLoading} aria-label="Visualização Mensal" onClick={() => setLayout({ option: 'month' })}>
                                        <MdOutlineViewModule />
                                    </StyledLayoutButton>
                                </StyledTooltip>

                                <StyledTooltip title="Visualização Por Lista">
                                    <StyledLayoutButton selected={layout === 'list'} disabled={isLoading} aria-label="Visualização Por Lista" onClick={() => setLayout({ option: 'list' })}>
                                        <FaList size={18} />
                                    </StyledLayoutButton>
                                </StyledTooltip>
                            </Box>
                        </Box>
                    )}
                </Toolbar>

                {/* ===== ROOM SELECTOR – MOBILE ===== */}
                {layout !== 'list' && (
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, m: 1, px: 2 }}>
                        <FormControl size="small" className={classes.roomSelectorSmall} fullWidth>
                            <InputLabel>Sala</InputLabel>
                            <Select value={selectedRoom || ''} label="Sala" onChange={handleRoomChange} fullWidth>
                                {rooms?.map((room) => (
                                    <MenuItem key={room.id} value={room.id}>
                                        {room.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </StyledRoot>
        );
    }, [
        selectedDate,
        layout,
        goToToday,
        next,
        previous,
        isLoading,
        openCalendar,
        miniCalendarOpen,
        refreshCalendar,
        selectedRoom,
        rooms,
        handleRoomChange,
        setStateCalendar,
        stateCalendar
    ]);
}

export default CalendarToolbar;
