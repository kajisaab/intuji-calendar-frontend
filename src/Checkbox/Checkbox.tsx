import './Checkbox.css';

function Checkbox({ name, color = '#2196F3' }: { name: string; color?: string }) {
    console.log({ name });
    return (
        <label className="container">
            <input type="checkbox" checked={true} />
            <span className="checkmark" style={{ backgroundColor: color }}></span>
            {name}
        </label>
    );
}

export default Checkbox;
