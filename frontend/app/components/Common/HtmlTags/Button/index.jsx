import React from "react";
import "./style.css";

const Button = (props) => {
    const { text, style, containerstyle, type = "primary", size, cls, onClick, ...restProps } = props;
    return (
        <div style={containerstyle} className={`${cls ? cls : ''} button-container`}>
            <button
                style={{ ...style, cursor: 'pointer' }}
                className={type}
                onClick={onClick}
                {...restProps}
            >
                {text}
            </button>
        </div>
    )
}

export default Button;