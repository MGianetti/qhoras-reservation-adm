import { useContext, useMemo } from 'react';
import { useDragLayer } from 'react-dnd';

import { CalendarContext } from './context/calendar-context';
import EventMarkGhost from './event-mark-ghost';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
};

const CalendarBoardDragLayer = () => {
    const { stateCalendar } = useContext(CalendarContext);
    const { ghostProperties } = stateCalendar;
    const { width } = ghostProperties;

    //TODO: execute only once
    const dayColumn = document.querySelectorAll('[data-group="day-column"]');
    const dayColumnGrid = useMemo(() => {
        return Array.from(document.querySelectorAll('[data-group="day-column"]')).reduce((arr, dom, ix) => {
            const column = {
                column: ix + 1,
                begin: dom.getBoundingClientRect().x,
                size: dom.getBoundingClientRect().x + dom.getBoundingClientRect().width,
                date: dom.dataset.date
            };
            arr.push(column);
            return arr;
        }, []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayColumn]);

    //TODO: execute only once
    const timeLine = document.querySelectorAll('[data-group="time-line"]');
    const timeLineGrid = useMemo(() => {
        const size = 15;
        return Array.from(document.querySelectorAll('[data-group="time-line"]')).reduce((arr, dom, ix) => {
            const position = dom.getBoundingClientRect().y - 2;

            Array.from(Array(4).keys()).forEach(function (_, quarterIndex) {
                const begin = position + size * quarterIndex;
                const line = {
                    begin: begin <= 166 ? 0 : begin,
                    end: begin + size,
                    y: begin - 9,
                    size,
                    hour: ix,
                    minute: size * quarterIndex
                };
                arr.push(line);
            });
            return arr;
        }, []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLine]);

    function snapToXGrid(x) {
        let dataDate = null;

        dayColumnGrid &&
            dayColumnGrid.forEach(function (item) {
                if (x > item.begin && x < item.size) {
                    x = item.begin;
                    dataDate = item.date;
                }
            });

        return [x, dataDate];
    }

    function snapToYGrid(y) {
        let hour = 0;
        let min = 0;
        timeLineGrid &&
            timeLineGrid.forEach(function (item) {
                if (y >= item.begin && y < item.end) {
                    y = item.y;
                    hour = item.hour;
                    min = item.minute;
                }
            });
        return [y, hour, min];
    }

    let dataDate;
    let dataHour;
    let dataMin;

    const getItemStyles = (initialOffset, currentOffset, clientOffset) => {
        if (!initialOffset || !currentOffset) {
            return {
                display: 'none'
            };
        }

        let x = clientOffset.x;
        let y = currentOffset.y;

        x = x < 309.02 ? 309.015625 : x;
        y = y < 157 ? 157 : y;
        [x, dataDate] = snapToXGrid(x);
        [y, dataHour, dataMin] = snapToYGrid(y);

        const transform = `translate(${x}px, ${y}px)`;

        return {
            transform,
            WebkitTransform: transform,
            x,
            y
        };
    };

    const { itemType, isDragging, initialOffset, currentOffset, clientOffset } = useDragLayer((monitor) => {
        return {
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            isDragging: monitor.isDragging(),
            w: width
        };
    });

    const info = getItemStyles(initialOffset, currentOffset, clientOffset);

    function renderItem() {
        switch (itemType) {
            case 'box':
                return <EventMarkGhost dataDate={dataDate} dataHour={dataHour} dataMin={dataMin} x={info.x} y={info.y} />;
            default:
                return null;
        }
    }
    if (!isDragging) {
        return null;
    }

    return (
        <div style={layerStyles}>
            <div style={info}>{renderItem()}</div>
        </div>
    );
};
export default CalendarBoardDragLayer;
