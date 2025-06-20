import React from "react";
import { Link } from "react-router-dom";

const HyperLink = (props) => {
    const {
        text,
        to,
        className,
        type,
        children,
        icon
    } = props;

    if (type === 'product') {
        return (
            <Link
              className={className}
              to={to}
              style={{
                textDecoration: 'none',
                color: 'inherit'
            }}
            >
                {children}
            </Link>
        )
    } else {
        return (
            <Link
                to={to}
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    alignItems: "center"
                }}
            >
                { icon ?? icon }
                <span className={className}>{text}</span>
            </Link>
        )
    }
}

export default HyperLink;