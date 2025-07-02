import "./styles.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const Dropdown = (props) => {
    const { parent, children, type } = props;
    const [open, setOpen] = useState(false);
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
      <button
        className="n-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {parent}
        <MdKeyboardArrowDown
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: ".3s" }}
        />
      </button>
      <div className="n-dropdown" style={{ display: open ? "block" : "none", opacity: open ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
}

export default Dropdown;
