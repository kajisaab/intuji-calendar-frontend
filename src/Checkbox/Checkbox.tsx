import './Checkbox.css';
import { CheckboxPropsInterface } from './Checkbox.interface';

function Checkbox(props: CheckboxPropsInterface) {
    const { name, color, checked, onChange } = props;
    return (
        <label className="container">
            <input type="checkbox" checked={checked} name={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)} />
            <span className="checkmark" style={{ backgroundColor: color }}></span>
            {name}
        </label>
    );
}

export default Checkbox;
