import Calendar from '../../Calendar';
import Checkbox from '../../Checkbox';
import logo from '../../assets/Image.svg';
import './CalendarPage.css';
import { filterKeys, filterKeysInterface } from './utils';

function CalendarPage() {
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
                        {filterKeys.map((dat: filterKeysInterface) => (
                            <Checkbox name={dat.name} color={dat.color} />
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
