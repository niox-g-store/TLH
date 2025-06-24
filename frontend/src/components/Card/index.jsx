import React from "react";
import "./Card.css";
import { getCurrentUserDetail } from "../../../../Backend/auth";
import { getRegistrationStatus, formatDateRange } from "./fucntions";

const Card = ({ event }) => {
  const currentUser = getCurrentUserDetail() ?? null;
  const userID = currentUser ? currentUser.id : null;

  return (
    <div className="card-wrapper" userid={userID}>
      <div className="card-body">
        <img
          src={event.image}
          alt="Event"
          width={100}
          height={100}
        />
        <h3 className="card-title">{event.name}</h3>
        <p className="card-desc">{event.desc}</p>
        <p>Date: {formatDateRange(event.startDate, event.endDate)}</p>
      </div>

      <button
        className={`card-button ${getRegistrationStatus(
          event.startDate,
          event.endDate
        )}`}
        onClick={
          getRegistrationStatus(event.startDate, event.endDate) === "now"
            ? () => null
            : null
        }
      >
        {getRegistrationStatus(event.startDate, event.endDate) === "closed"
          ? "Registration Closed"
          : getRegistrationStatus(event.startDate, event.endDate) === "soon"
          ? "Coming Soon"
          : "Register Now"}
      </button>
    </div>
  );
};

export default Card;
