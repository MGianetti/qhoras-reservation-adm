import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { styled } from '@mui/material/styles';

import appointmentService from '../../../domains/appointment/appointmentService';
import CalendarLayoutDayWeek from './calendar-layout-day-week';
import CalendarLayoutMonth from './calendar-layout-month';
import getSelectedWeekIndex from './common/getSelectedWeekIndex';
import { CalendarContext } from './context/calendar-context';
import getWeekDays from './common/getWeekDays';
import userService from '../../../domains/user/userService';
import calendarBlocksService from '../../../domains/calendarBlocks/calendarBlocksService';

const PREFIX = 'CalendarMain';

const classes = {
    drawerHeader: `${PREFIX}-drawerHeader`,
    content: `${PREFIX}-content`,
    contentShift: `${PREFIX}-contentShift`
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.drawerHeader}`]: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-center'
    },

    [`&.${classes.content}`]: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth,
        height: '100%',
        width: '100%',
        minWidth: 1000
    },

    [`&.${classes.contentShift}`]: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    }
}));

const drawerWidth = 260;

function CalendarMain(props) {
    const { stateCalendar } = useContext(CalendarContext);
    const { selectedDate, layout } = stateCalendar;
    const businessId = useSelector((state) => state.auth.user?.businessId);
    const users = useSelector((state) => state.user.employees);
    const currentUser = useSelector((state) => state.auth.user);
    const { runAnimation, setGetScheduleData } = props;
    const [, setStartEndDates] = useState({ start: selectedDate, end: selectedDate });
    const getScheduleData = async (id) => {
        let start, end;

        if (!id) return;

        if (layout === 'day') {
            start = format(selectedDate, 'yyyy-MM-dd 00:00:00');
            end = format(selectedDate, 'yyyy-MM-dd 23:59:59');
        } else if (layout === 'week') {
            start = format(startOfWeek(selectedDate), 'yyyy-MM-dd 00:00:00');
            end = format(endOfWeek(selectedDate), 'yyyy-MM-dd 23:59:59');
        } else if (layout === 'month') {
            start = format(startOfWeek(startOfMonth(selectedDate)), 'yyyy-MM-dd 00:00:00');
            end = format(endOfWeek(endOfMonth(selectedDate)), 'yyyy-MM-dd 23:59:59');
        }

        setStartEndDates({ start, end });
        const appointments = await appointmentService.read(id, start, end);
        const calendarBlocks = await calendarBlocksService.read(id, start, end);
        return { appointments, calendarBlocks };
    };

    useEffect(() => {
        if (currentUser?.auth?.id !== undefined) {
            getScheduleData(currentUser.auth.id);
            setGetScheduleData(() => getScheduleData);
        }
    }, [selectedDate, layout, businessId, currentUser?.auth?.id]);

    const weeks = getWeekDays(selectedDate, 7);
    const selectedWeekIndex = getSelectedWeekIndex(selectedDate, weeks, 0);
    const selectedWeek = weeks[selectedWeekIndex];

    return (
        <Root style={{ width: '100%' }}>
            {layout === 'month' && <CalendarLayoutMonth weeks={weeks} runAnimation={runAnimation} />}
            {(layout === 'week' || layout === 'day') && <CalendarLayoutDayWeek selectedWeekIndex={selectedWeekIndex} selectedWeek={selectedWeek} />}
        </Root>
    );
}

export default CalendarMain;