import React from "react";
import "./style.css";

const Button = (props) => {
    const { text, type="btn-primary", size, cls, onClick } = props;
    return (
        <div className={`${cls ? cls : ''} button-container`}>
            <button className={type} onClick={onClick}>{text}</button>
        </div>
    )
}

export default Button;
