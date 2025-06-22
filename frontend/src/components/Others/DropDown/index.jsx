import { Link } from "react-router-dom";
import "./styles.css";

const Dropdown = (props) => {
    const { parent, children } = props;
  return (
    <div className="dropdown">
      <button className="dropbtn">{ parent }</button>
      <div className="dropdown-content">
        { children }
      </div>
    </div>
  );
}

export default Dropdown;
