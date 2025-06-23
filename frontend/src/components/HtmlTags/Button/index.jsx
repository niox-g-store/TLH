import React from "react";
import "./style.css";

const Button = (props) => {
    const { text, type="btn-primary", size } = props;
    return (
        <div className="button-container">
            <button className={type}>{text}</button>
        </div>
    )
}

export default Button;
