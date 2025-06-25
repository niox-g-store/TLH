import React from "react";
import { Link } from "react-router-dom";

const PButton = (props) => {
  const { link } = props;
  return (
    <>
      <Link to={link} target="_blank">
        <div className="button">{props.content}</div>
      </Link>
    </>
  );
};

export default PButton;
