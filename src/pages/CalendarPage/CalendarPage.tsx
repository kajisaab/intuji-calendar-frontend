import { useState } from 'react';
import Calendar from '../../Calendar';
import Checkbox from '../../Checkbox';
import logo from '../../assets/Image.svg';
import './CalendarPage.css';
import { filterKeys, filterKeysInterface } from './utils';

function CalendarPage() {
    const [filterKeysList, setFilterKeysList] = useState<filterKeysInterface[]>([...filterKeys]);

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFilterKeysList(() => [...filterKeysList.map((dat) => (dat.name === name ? { ...dat, checked: checked } : dat))]);
    };

    return (
        <section className="calendar__page__wrapper">
            <aside className="aside__menu">
                <div className="button__filter__container">
                    <div className="button__container">
                        <button className="add__event__button" onClick={() => alert('clicked')}>
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
                <Calendar />
            </div>
        </section>
    );
}

export default CalendarPage;
