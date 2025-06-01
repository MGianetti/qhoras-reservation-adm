export const deleteEvent = (props) => {
    const { stateCalendar, calendarEvent, setStateCalendar } = props;

    const localStorageMarkers = window.localStorage.getItem('markers');

    const markers = (localStorageMarkers && JSON.parse(localStorageMarkers)) || [];
    window.localStorage.setItem('markers', JSON.stringify(markers.filter((markEvent) => markEvent.id !== calendarEvent.id)));

    setStateCalendar({
        ...stateCalendar,
        openDialog: false,
        openViewDialog: false
    });
};
