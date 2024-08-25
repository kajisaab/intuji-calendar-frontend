/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './Drawer.css';
import { DrawerProps } from './Drawer.interface';
import { fetch, store } from '../utils/httpUtils';

const defaultEventDetail = {
    summary: '',
    description: '',
    location: '',
    start: new Date().toISOString(),
    end: new Date().toISOString()
};

function Drawer(props: DrawerProps) {
    const { isOpen: open, defaultData, fetchEvents, setDrawerState, update = false } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [defaultEventDetails, setDetailsEventDetails] = useState<any>({});
    const [eventDetails, setEventDetails] = useState({
        ...defaultEventDetail
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setIsOpen(open);
        if (Object.keys(defaultData).length > 0) {
            setDetailsEventDetails({ ...defaultData });
            const formatDate = (dateString: string) => {
                // Check if the dateString is valid
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    // Return an empty string or a default date if invalid
                    return '';
                }
                // Get local ISO string without timezone and milliseconds
                return date.toISOString().slice(0, 16);
            };

            setEventDetails({
                summary: defaultData?.summary,
                description: defaultData?.description ?? '',
                location: defaultData?.location ?? '',
                start: defaultData.start ? formatDate(defaultData.start.date) : '',
                end: defaultData.end ? formatDate(defaultData.end.date) : ''
            });
        }

        if (!open) {
            setEventDetails({ ...defaultEventDetail });
            setDetailsEventDetails({});
        }
    }, [open, defaultData]);

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};
        if (!eventDetails.summary) newErrors.summary = 'Summary is required';
        if (!eventDetails.location) newErrors.location = 'Location is required';
        if (!eventDetails.start) newErrors.start = 'Start Date is required';
        if (!eventDetails.end) newErrors.end = 'End Date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEventDetails({
            ...eventDetails,
            [name]: value
        });

        // Remove error for the field being typed in
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        if (validateFields()) {
            let payload = eventDetails;
            try {
                if (update) {
                    payload = {
                        ...defaultEventDetails,
                        ...eventDetails
                    };
                }
                await store(`v1/api/calendar/create-event`, payload);
                setDrawerState({ open: false, data: {} });
                fetchEvents();
            } catch (err) {
                console.log(`Error ${err}`);
            }
        }
    };

    const handleCloseModal = () => {
        setEventDetails({ ...defaultEventDetail });
        setDetailsEventDetails({});
        setDrawerState({ open: false, data: {} });
        setIsOpen(false);
    };

    const handleDelete = async () => {
        try {
            fetch(`v1/api/calendar/delete-event/${defaultEventDetails?.id}`);
            setDrawerState({ open: false, data: {} });
            fetchEvents();
        } catch (err) {
            console.log({ err });
        }
    };

    return (
        <div id="drawer" className={`drawer ${isOpen ? 'open' : ''}`}>
            <div id="closeArea" className="close-area" onClick={() => handleCloseModal()} />
            <div className="drawer__content">
                <div className="drawer__header">
                    <h2>{defaultData && Object.keys(defaultData).length > 0 ? 'Update Event' : 'Add Event'}</h2>
                    <span id="close" className="material-symbols-rounded" onClick={() => handleCloseModal()}>
                        close
                    </span>
                </div>
                <div className="form__container__wrapper">
                    <div className="form__container">
                        <div className="form__group">
                            <label htmlFor="summary">Summary</label>
                            <input type="text" id="summary" name="summary" value={eventDetails.summary} onChange={handleInputChange} />
                            {errors.summary && <span className="error">{errors.summary}</span>}
                        </div>

                        <div className="form__group">
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" name="description" value={eventDetails.description} onChange={handleInputChange} />
                        </div>

                        <div className="form__group">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" name="location" value={eventDetails.location} onChange={handleInputChange} />
                            {errors.location && <span className="error">{errors.location}</span>}
                        </div>

                        <div className="form__group">
                            <label htmlFor="start">Start Date</label>
                            <div className="input__wrapper">
                                <input type="datetime-local" id="start" name="start" value={eventDetails.start} onChange={handleInputChange} />
                                <span className="calendar__icon">&#x1F4C5;</span>
                            </div>
                            {errors.start && <span className="error">{errors.start}</span>}
                        </div>

                        <div className="form__group">
                            <label htmlFor="end">End Date</label>
                            <div className="input__wrapper">
                                <input type="datetime-local" id="end" name="end" value={eventDetails.end} onChange={handleInputChange} />
                                <span className="calendar__icon">&#x1F4C5;</span>
                            </div>
                            {errors.end && <span className="error">{errors.end}</span>}
                        </div>
                    </div>
                    <div className="form__button__container">
                        {defaultData && Object.keys(defaultData).length > 0 && <button onClick={handleDelete}>Delete</button>}
                        <button onClick={handleSubmit}>{defaultData && Object.keys(defaultData).length > 0 ? 'Update Event' : 'Add Event'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Drawer;
