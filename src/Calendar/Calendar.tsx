/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar(props: any) {
    const { eventList } = props;
    const [date] = useState(new Date());
    const [currYear, setCurrYear] = useState(date.getFullYear());
    const [currMonth, setCurrMonth] = useState(date.getMonth());
    const [days, setDays] = useState<JSX.Element[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleCalendarCellClickEvent = (day: number, month: string, event: React.MouseEvent) => {
        setSelectedDate(`${month} ${day}, ${currYear}`);

        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            top: rect.top + window.scrollY, // Position the modal at the bottom of the li element
            left: rect.left + window.scrollX
        });
    };

    console.log({ eventList });
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

        // this is for the previous month date.
        for (let i = firstDayofMonth; i > 0; i--) {
            const previsouMonth = eventList.filter((dat: any) => {
                const month = new Date(dat.created).getMonth();
                return month === currMonth - 1;
            });

            console.log({ previsouMonth });
            liTag.push(
                <li className="inactive" key={`prev-${i}`} onClick={(e) => handleCalendarCellClickEvent(lastDateofLastMonth - i + 1, months[currMonth - 1], e)}>
                    <span className="text">{lastDateofLastMonth - i + 1}</span>
                </li>
            );
        }

        // this is for the current month date.
        for (let i = 1; i <= lastDateofMonth; i++) {
            const CurrentMonthData = eventList.filter((dat: any) => {
                const month = new Date(dat.created).getMonth();
                return month === currMonth;
            });

            console.log({ CurrentMonthData });
            const isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? 'active' : '';
            liTag.push(
                <li className={isToday} key={`curr-${i}`} onClick={(e) => handleCalendarCellClickEvent(i, months[currMonth], e)}>
                    <span className="text">{i}</span>
                </li>
            );
        }

        // this is for the next month date.
        for (let i = lastDayofMonth; i < 6; i++) {
            const NextMonthDate = eventList.filter((dat: any) => {
                const month = new Date(dat.created).getMonth();
                return month === currMonth + 1;
            });

            console.log({ NextMonthDate });
            liTag.push(
                <li className="inactive" key={`next-${i}`} onClick={(e) => handleCalendarCellClickEvent(i - lastDayofMonth + 1, months[currMonth + 1], e)}>
                    <span className="text">{i - lastDayofMonth + 1}</span>
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
            <header>
                <p className="current-date">{`${months[currMonth]} ${currYear}`}</p>
                <div className="icons">
                    <span id="prev" className="material-symbols-rounded" onClick={() => handlePrevNext('prev')}>
                        chevron_left
                    </span>
                    <span id="next" className="material-symbols-rounded" onClick={() => handlePrevNext('next')}>
                        chevron_right
                    </span>
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
            {selectedDate && modalPosition && (
                <div className="modal-dropdown" style={{ top: modalPosition.top - 5, left: modalPosition.left }}>
                    <p>{selectedDate}</p>
                </div>
            )}
        </div>
    );
}

export default Calendar;
