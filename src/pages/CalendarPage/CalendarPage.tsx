/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect, useState } from 'react';
import Calendar from '../../Calendar';
import Checkbox from '../../Checkbox';
import logo from '../../assets/Image.svg';
import './CalendarPage.css';
import { filterKeys, filterKeysInterface } from './utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Drawer from '../../Drawer';
import { fetch } from '../../utils/httpUtils';

function CalendarPage() {
    const [filterKeysList, setFilterKeysList] = useState<filterKeysInterface[]>([...filterKeys]);
    const [eventList, setEventList] = useState([]);
    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get('access_token');
    const googleAccessToken = searchParams.get('google_access_token');
    const refreshToken = searchParams.get('refresh_token');
    const [drawerState, setDrawerState] = useState({
        open: false,
        data: {}
    });
    const navigate = useNavigate();

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFilterKeysList(() => [...filterKeysList.map((dat) => (dat.name === name ? { ...dat, checked: checked } : dat))]);
    };

    useLayoutEffect(() => {
        if (accessToken && accessToken !== 'null') {
            localStorage.setItem('access_token', accessToken as string);
        }

        if (googleAccessToken && googleAccessToken !== '' && googleAccessToken !== 'null') {
            document.cookie = `google_access_token=${googleAccessToken}; path = /; max-age=3600000; SameSite=Lax`;
        }

        if (refreshToken && refreshToken !== '' && refreshToken !== 'null') {
            document.cookie = `refresh_token=${refreshToken}; path = /; max-age=604800000; SameSite=Lax`;
        }

        navigate(location.pathname, { replace: true });
    }, [accessToken]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('v1/api/calendar/get-event');
            console.log({ response });

            if (response.data.data.list.length > 0) {
                setEventList(response.data.data.list);
            }
        } catch (err) {
            console.log({ err });
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    return (
        <section className="calendar__page__wrapper">
            <aside className="aside__menu">
                <div className="button__filter__container">
                    <div className="button__container">
                        <button
                            className="add__event__button"
                            onClick={() =>
                                setDrawerState({
                                    open: true,
                                    data: {}
                                })
                            }
                        >
                            Add Event
                        </button>
                    </div>
                    <div className="filter__container">
                        <span className="filter__title">FILTER</span>
                        {filterKeysList.map((dat: filterKeysInterface, index: number) => (
                            <Checkbox key={index} name={dat.name} color={dat.color} checked={dat.checked} onChange={onCheckboxChange} />
                        ))}
                    </div>
                </div>
                <article className="image__section">
                    <img className="image" src={logo} alt="random" />
                </article>
            </aside>
            <div className="calendar__section">
                <Calendar eventList={eventList} setDrawerState={(data: any) => setDrawerState({ ...data })} defaultData={drawerState.data} />
            </div>
            <Drawer isOpen={drawerState.open} defaultData={drawerState.data} fetchEvents={fetchEvents} setDrawerState={setDrawerState} update={false} />
        </section>
    );
}

export default CalendarPage;
