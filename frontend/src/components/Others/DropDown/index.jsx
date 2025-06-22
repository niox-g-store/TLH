import { Link } from "react-router-dom";
import "./styles.css";
import { MdKeyboardArrowDown } from "react-icons/md";

const Dropdown = (props) => {
    const { parent, children, type } = props;
    if (type === 'hover') {
        return (
            <div className="dropdown">
                <button className="dropbtn">{ parent }</button>
                <div className="dropdown-content">
                    { children }
                </div>
            </div>
        );
    }

    return (
        <div className="n-dropdown-container">
            <button className="n-button">{parent}<MdKeyboardArrowDown /></button>
            <div className="n-dropdown">
                {children}
            </div>
        </div>
    )
}

export default Dropdown;
