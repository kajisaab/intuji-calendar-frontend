/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import './Calendar.css';

const colorPalette: any = {
    '0': 'blue',
    '1': 'green',
    '2': 'purple',
    '3': 'red',
    '4': 'yellow',
    '5': 'orange',
    '6': 'turquoise',
    '7': 'gray',
    '8': 'bold blue',
    '9': 'bold green'
};

function Calendar(props: any) {
    const { eventList, setDrawerState } = props;
    const [date] = useState(new Date());
    const [currYear, setCurrYear] = useState(date.getFullYear());
    const [currMonth, setCurrMonth] = useState(date.getMonth());
    const [days, setDays] = useState<JSX.Element[]>([]);
    const [selectedDate, setSelectedDate] = useState<any | null>({});
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleCalendarCellClickEvent = (day: number, month: string, event: React.MouseEvent, eventBanner: any[]) => {
        setSelectedDate({
            title: `${month} ${day}, ${currYear}`,
            list: eventBanner
        });

        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            top: rect.top + window.scrollY, // Position the modal at the bottom of the li element
            left: rect.left + window.scrollX
        });
    };

    const handleStripClick = (e: React.MouseEvent, event: any) => {
        e.stopPropagation();
        setDrawerState({
            open: true,
            data: event
        });
    };

    useEffect(() => {
        renderCalendar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currYear, currMonth, eventList]);

    const renderCalendar = () => {
        const firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
            lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

        const liTag = [];

        const isDateInCurrentMonth = (dateStr?: string) => {
            if (!dateStr) return false;
            const [year, month] = dateStr.split('-').map(Number);
            return year === currYear && month - 1 === currMonth;
        };

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const isDateInRange = (date: Date, startDateTime?: string, endDateTime?: string) => {
            if (!startDateTime || !endDateTime) return false;
            const formattedDate = formatDate(date);
            const formattedStartDate = formatDate(new Date(startDateTime));
            const formattedEndDate = formatDate(new Date(endDateTime));
            return formattedDate >= formattedStartDate && formattedDate <= formattedEndDate;
        };

        // this is for the previous month date.
        for (let i = firstDayofMonth; i > 0; i--) {
            const PrevMonthData = eventList.filter((dat: any) => {
                const eventDate = dat.start.date; // Assuming event start date format "YYYY-MM-DD"
                return isDateInCurrentMonth(eventDate) && new Date(eventDate).getDate() === i;
            });

            // Map the events to a stripe banner
            const eventBanner = PrevMonthData.map((event: any) => (
                <div
                    className="event-stripe"
                    key={event.id}
                    style={{ backgroundColor: colorPalette[event.colorId] || '#FF9F43', color: '#fff' }}
                    onClick={(e) => {
                        handleStripClick(e, event);
                    }}
                >
                    {event.summary}
                </div>
            ));
            liTag.push(
                <li className="inactive" key={`prev-${i}`} onClick={(e) => handleCalendarCellClickEvent(lastDateofLastMonth - i + 1, months[currMonth - 1], e, PrevMonthData)}>
                    <span className="text">{lastDateofLastMonth - i + 1}</span>
                    {eventBanner.length > 0 && <div className="events-container">{eventBanner}</div>}
                </li>
            );
        }

        // this is for the current month date.
        for (let i = 1; i <= lastDateofMonth; i++) {
            const CurrentMonthData = eventList.filter((dat: any) => {
                const eventStartDate = dat.start.date || dat.start.dateTime; // Assuming event start date format "YYYY-MM-DD"
                const eventEndDate = dat.end.date || dat.end.dateTime; // Assuming event end date format "YYYY-MM-DD"
                const dateToCheck = new Date(currYear, currMonth, i);
                return isDateInRange(dateToCheck, eventStartDate, eventEndDate);
            });

            const isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? 'active' : '';

            // Map the events to a stripe banner
            const eventBanner = CurrentMonthData.map((event: any) => (
                <div
                    className="event-stripe"
                    key={event.id}
                    style={{ backgroundColor: colorPalette[event.colorId] || '#FF9F43', color: '#fff' }}
                    onClick={(e) => handleStripClick(e, event)}
                >
                    {event.summary}
                </div>
            ));
            liTag.push(
                <li className={isToday} key={`curr-${i}`} onClick={(e) => handleCalendarCellClickEvent(i, months[currMonth], e, CurrentMonthData)}>
                    <span className="text">{i}</span>
                    {eventBanner.length > 0 && <div className="events-container">{eventBanner}</div>}
                </li>
            );
        }

        // this is for the next month date.
        for (let i = lastDayofMonth; i < 6; i++) {
            let calendar_date = 0;
            let calendar_month = 0;
            let calendar_year = 0;

            const NextMonthDate = eventList.filter((dat: any) => {
                calendar_month = new Date(dat.created).getMonth();
                calendar_date = new Date(dat.created).getDate();
                calendar_year = new Date(dat.created).getFullYear();
                return calendar_month === currMonth + 1 && calendar_year === currYear && calendar_date === i;
            });

            // Map the events to a stripe banner
            const eventBanner = NextMonthDate.map((event: any) => (
                <div
                    className="event-stripe"
                    key={event.id}
                    style={{ backgroundColor: colorPalette[event.colorId] || '#FF9F43', color: '#fff' }}
                    onClick={(e) => handleStripClick(e, event)}
                >
                    {event.summary}
                </div>
            ));
            liTag.push(
                <li className="inactive" key={`next-${i}`} onClick={(e) => handleCalendarCellClickEvent(i - lastDayofMonth + 1, months[currMonth + 1], e, NextMonthDate)}>
                    <span className="text">{i - lastDayofMonth + 1}</span>
                    {eventBanner.length > 0 && <div className="events-container">{eventBanner}</div>}
                </li>
            );
        }

        setDays(liTag);
    };

    const handlePrevNext = (direction: unknown) => {
        setCurrMonth((prevMonth) => {
            let newMonth = direction === 'prev' ? prevMonth - 1 : prevMonth + 1;
            if (newMonth < 0 || newMonth > 11) {
                const newDate = new Date(currYear, newMonth, date.getDate());
                setCurrYear(newDate.getFullYear());
                newMonth = newDate.getMonth();
            }
            return newMonth;
        });
    };

    return (
        <div className="wrapper">
            <header className="header">
                <div className="header__left">
                    <div className="icons">
                        <span
                            id="prev"
                            className="material-symbols-rounded"
                            onClick={() => {
                                setSelectedDate({});
                                handlePrevNext('prev');
                            }}
                        >
                            chevron_left
                        </span>
                        <span
                            id="next"
                            className="material-symbols-rounded"
                            onClick={() => {
                                setSelectedDate({});
                                handlePrevNext('next');
                            }}
                        >
                            chevron_right
                        </span>
                    </div>
                    <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
                </div>

                <div className="header__right">
                    <div className="box__column">Month</div>
                    <div className="box__column">Week</div>
                    <div className="box__column">Day</div>
                    <div className="box__column">List</div>
                </div>
            </header>
            <div className="calendar">
                <ul className="weeks">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </ul>
                <ul className="days">{days}</ul>
            </div>
            {Object.keys(selectedDate).length > 0 && modalPosition && (
                <div className="modal-dropdown" style={{ top: modalPosition.top - 5, left: modalPosition.left }}>
                    <div className="modal__dropdown__header">
                        <p>{selectedDate.title}</p>
                        <span id="close" className="material-symbols-rounded" onClick={() => setSelectedDate({})}>
                            close
                        </span>
                    </div>
                    <div className="modal__events__container">
                        {selectedDate.list?.map((dat: any) => (
                            <div className="modal__event__stripe" style={{ backgroundColor: colorPalette[dat.colorId] || '#FF9F43', color: '#fff' }}>
                                {dat.summary}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;
