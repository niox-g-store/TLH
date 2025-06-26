import React from "react";
import "./style.css";
import { getCurrentUserDetail } from "../../../../../Backend/auth";
import { getRegistrationStatus, formatDateRange, formatReadableDate } from "./fucntions";
import { useNavigate } from "react-router-dom";

const Card = ({ event, type = "event" }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUserDetail() ?? null;
  const userID = currentUser ? currentUser.id : null;

  if (type === "gallery") {
    return (
      <div className="card-wrapper" userid={userID}>
        <div className="card-body">
          <img src={event.image} alt={event.name} width={100} height={100} />
          <h3 className="card-title">{event.name}</h3>
          <p className="card-desc">{formatReadableDate(event.date)}</p>
        </div>
        <button
          className="card-button"
          onClick={() => navigate(`/gallery/${event.slug}`)}
        >
          View Gallery
        </button>
      </div>
    );
  }

  // Default: Event Card
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
