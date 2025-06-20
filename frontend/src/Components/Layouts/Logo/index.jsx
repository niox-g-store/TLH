import React from "react";

const Logo = (props) => {
    const { size = 50 } = props;

    return (
        <div className="logo-container">
            <div className="logo"
                 style={{ width: `130px`, height: `${size}px` }}
                 aria-label="Logo">
            </div>
        </div>
    )
}

export default Logo;
