import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { CssBaseline, FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';

import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import CalendarMain from '../../common/components/calendar/calendar-main';
import CalendarDrawer from '../../common/components/calendar/calendar-drawer';
import CalendarToolbar from '../../common/components/calendar/calendar-toolbar';
import { CalendarContext } from '../../common/components/calendar/context/calendar-context';
import CalendarEventDialog from '../../common/components/calendar/calendarDialog/calendarDialog';
import notification from '../../common/utils/notification';

import { refreshCalendarSuccess } from '../../domains/appointment/appointment.constants';
import LoadingOverlay from '../../common/components/LoadingOverlay/LoadingOverlay';
import BlockDialog from '../../common/components/calendar/calendarDialog/blockDialog';
import userService from '../../domains/user/userService';

const PREFIX = 'Calendar';

const classes = {
    root: `${PREFIX}-root`
};

const StyledCalendarContextProvider = styled(CalendarContext.Provider)(() => ({
    [`& .${classes.root}`]: {
        display: 'flex',
        height: '100%',
        width: '100%',
        boxShadow: '0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)'
    }
}));

const selectedDate = new Date();
const layout = 'day';
const openDialog = false;
const openViewDialog = false;
const defaultEventDuration = 60; // in minutes

const Calendar = () => {
    const theme = useTheme();

    const [stateCalendar, setStateCalendar] = useState({
        actions: '',
        allowFullScreen: false,
        calendarEvent: {},
        content: '',
        defaultEventDuration,
        draggingEventId: -1,
        eventBeginDate: null,
        eventBeginTime: { value: null, label: null },
        eventDialogMaxWidth: 'md',
        eventEndDate: null,
        eventEndTime: { value: null, label: null },
        fullscreen: false,
        ghostProperties: { width: 0, height: 0, date: new Date() },
        layout,
        modal: false,
        openDialog,
        openViewDialog,
        selectedDate,
        startDragging: false,
        title: '',
        withCloseIcon: true,
        miniCalendarOpen: false
    });

    const [runAnimation, setRunAnimation] = useState(true);
    const [open, setOpen] = useState(true);
    const [getScheduleData, setGetScheduleData] = useState(null);
    const isLoading = useSelector((state) => state.appointments.isLoading);
    const auth = useSelector((state) => state.auth);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const today = new Date();
                const data = await userService.readBusinessEmployees(auth?.user?.businessId);

                setEmployees(data);
                if (data.length > 0 && !selectedEmployee) {
                    setSelectedEmployee(data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            }
        };

        fetchEmployees();
    }, [auth?.user?.businessId, selectedEmployee]);

    useEffect(() => {
        if (!selectedEmployee?.id) return;
        // userService.read(selectedEmployee.id);

        if (selectedEmployee.role === 'ADMINISTRATOR') {
            userService.readBusinessEmployees(auth?.user?.businessId);
        }
    }, [selectedEmployee?.id]);

    const fetchEmployees = async () => {
        try {
            const today = new Date();
            const startDate = new Date(today.setHours(0, 0, 0, 0));
            const endDate = new Date(today.setHours(23, 59, 59, 999));
            const data = await userService.readBusinessEmployees(auth?.user?.businessId, { dateRange: { start: startDate.toISOString(), end: endDate.toISOString() } });
            setEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [selectedEmployee, stateCalendar.selectedDate]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const goToToday = () => {
        setRunAnimation(false);
        const newDate = new Date();
        setStateCalendar({ ...stateCalendar, selectedDate: newDate });
    };

    const openCalendar = () => {
        setStateCalendar({ ...stateCalendar, miniCalendarOpen: !stateCalendar.miniCalendarOpen });
    };

    const handleLayoutChange = (args) => {
        const { value } = args;
        setStateCalendar({ ...stateCalendar, layout: value });
    };

    const next = () => {
        setRunAnimation(false);
        let newDate;

        switch (stateCalendar.layout) {
            case 'week':
                newDate = addWeeks(stateCalendar.selectedDate, 1);
                break;

            case 'day':
                newDate = addDays(stateCalendar.selectedDate, 1);
                break;

            default:
                // month
                newDate = addMonths(stateCalendar.selectedDate, 1);
                break;
        }
        setStateCalendar({ ...stateCalendar, selectedDate: newDate });
        // applyLink(newDate)
    };

    const previous = () => {
        setRunAnimation(false);
        let newDate;

        switch (stateCalendar.layout) {
            case 'week':
                newDate = subWeeks(stateCalendar.selectedDate, 1);
                break;

            case 'day':
                newDate = subDays(stateCalendar.selectedDate, 1);
                break;

            default:
                newDate = subMonths(stateCalendar.selectedDate, 1);
                break;
        }
        setStateCalendar({ ...stateCalendar, selectedDate: newDate });
    };

    const handleEmployeeChange = (event) => {
        const selectedEmployeeId = event.target.value;
        setSelectedEmployee(selectedEmployeeId);
    };

    const refreshCalendar = async () => {
        if (getScheduleData) {
            const { appointments: refreshedAppointments, calendarBlocks: refreshedCalendarBlocks } = await getScheduleData();
            refreshedAppointments && refreshedCalendarBlocks && notification(refreshCalendarSuccess);
        }
    };

    return (
        <LoggedLayout>
            <StyledCalendarContextProvider value={{ stateCalendar, setStateCalendar }}>
                <ThemeProvider theme={theme}>
                    <div
                        className={classes.root}
                        style={{ overflow: 'hidden', borderRadius: '4px', boxShadow: '0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)' }}
                    >
                        <CssBaseline />
                        <CalendarToolbar
                            openCalendar={openCalendar}
                            miniCalendarOpen={stateCalendar.miniCalendarOpen}
                            goToToday={goToToday}
                            next={next}
                            previous={previous}
                            open={open}
                            handleDrawerOpen={handleDrawerOpen}
                            handleDrawerClose={handleDrawerClose}
                            handleLayoutChange={handleLayoutChange}
                            refreshCalendar={refreshCalendar}
                            isLoading={isLoading}
                        />
                        {Array.isArray(employees) &&
                            employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.email}
                                </MenuItem>
                            ))}
                        <div style={{ display: 'flex', width: '100%', position: 'relative' }}>
                            <LoadingOverlay isLoading={isLoading} />
                            <CalendarDrawer
                                selectedDate={selectedDate}
                                next={next}
                                previous={previous}
                                open={open}
                                layout={'month'}
                                miniCalendarOpen={stateCalendar.miniCalendarOpen}
                            />
                            <CalendarMain isLoading={isLoading} open={open} runAnimation={runAnimation} setGetScheduleData={setGetScheduleData} />
                            <CalendarEventDialog isLoading={isLoading} />
                            <BlockDialog isLoading={isLoading} />
                        </div>
                    </div>
                </ThemeProvider>
            </StyledCalendarContextProvider>
        </LoggedLayout>
    );
};

export default Calendar;
