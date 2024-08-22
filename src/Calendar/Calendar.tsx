import { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar() {
    const [date] = useState(new Date());
    const [currYear, setCurrYear] = useState(date.getFullYear());
    const [currMonth, setCurrMonth] = useState(date.getMonth());
    const [days, setDays] = useState<JSX.Element[]>([]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCalendarCellClickEvent = (e: any) => {
        console.log({ e });
        alert(e);
    };

    useEffect(() => {
        renderCalendar();
    }, [currYear, currMonth]);

    const renderCalendar = () => {
        const firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
            lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

        const liTag = [];

        console.log({ currMonth });

        // this is for the previous month date.
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag.push(
                <li
                    className="inactive"
                    key={`prev-${i}`}
                    onClick={() => handleCalendarCellClickEvent(`Clicked ${lastDateofLastMonth - i + 1} from previous month ${months[currMonth - 1]}`)}
                >
                    <span className="text">{lastDateofLastMonth - i + 1}</span>
                </li>
            );
        }

        // this is for the current month date.
        for (let i = 1; i <= lastDateofMonth; i++) {
            const isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? 'active' : '';
            liTag.push(
                <li className={isToday} key={`curr-${i}`} onClick={() => handleCalendarCellClickEvent(`Clicked ${i} from current month ${months[currMonth]}`)}>
                    <span className="text">{i}</span>
                </li>
            );
        }

        // this is for the next month date.
        for (let i = lastDayofMonth; i < 6; i++) {
            liTag.push(
                <li
                    className="inactive"
                    key={`next-${i}`}
                    onClick={() => handleCalendarCellClickEvent(`Clicked ${i - lastDayofMonth + 1} from next month ${months[currMonth + 1]}`)}
                >
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
        </div>
    );
}

export default Calendar;
