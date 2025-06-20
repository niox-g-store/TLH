import React from "react";

const Button = (props) => {
    const {
        text,
        className = null,
        onClick,
        type = "primary",
        fontSize = "16px"
    } = props;

    return (
        <div className="buttons">
            <button
                className={`button-${type} ${className && className}`}
                style={{
                    fontSize: fontSize
                }}
            >
                {text}
            </button>
        </div>
    )
}

export default Button;