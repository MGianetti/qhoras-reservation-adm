import { createContext } from 'react';

const savedLayout = localStorage.getItem('calendarLayout') || 'month';

export const CalendarContext = createContext({
    stateCalendar: { layout: savedLayout },
    setStateCalendar: () => {}
});
