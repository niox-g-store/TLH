import React from "react";
import "./style.css";

const Button = (props) => {
    const { text, style, type="btn-primary", size, cls, onClick } = props;
    return (
        <div className={`${cls ? cls : ''} button-container`}>
            <button style={{...style}} className={type} onClick={onClick}>{text}</button>
        </div>
    )
}

export default Button;
