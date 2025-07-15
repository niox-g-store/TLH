import React from "react";
import "./style.css";
import { getCurrentUserDetail } from "../../../../../Backend/auth";
import { getRegistrationStatus, formatDateRange, formatReadableDate } from "./functions";
import { useNavigate } from "react-router-dom";
import ResolveImage from "../ResolveImage";
import { API_URL } from "../../../constants";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { RxLapTimer } from "react-icons/rx";

const Card = ({ event, type = "event" }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUserDetail() ?? null;
  const userID = currentUser ? currentUser.id : null;

  if (type === "gallery") {
    return (
      <div className="card-wrapper" userid={userID}>
        <div className="card-body">
          <img loading="lazy" src={ResolveImage(API_URL + event.bannerUrl)} alt={event.name} width={100} height={100} />
          <h3 className="card-title">{event.name}</h3>
          <p className='event-date p-black'>
            <span className='event-view-icon-' style={{ paddingLeft: '0' }}><LuCalendarDays size={20} color='#9172EC'/></span>
            {formatReadableDate(event && event.date).day}
          </p>
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
    <Link to={`/event/${event.slug}`}>
    <div className="card-wrapper" userid={userID}>
      <div className="card-body">
        <img
          src={ResolveImage(`${API_URL}${event.imageUrls[0]}` || '')}
          alt="Event"
          width={100}
          height={100}
          loading="lazy"
        />
        <div className="p-tre">
        <h3 style={{ margin: '.5em .5em' }} className="card-title">{event.name}</h3>
        <p className='event-location p-black'>
          <span className='event-view-icon-'><IoLocationOutline size={20} color='#9172EC'/></span>
          {event && event.location}
        </p>

        <p className='event-date p-black mb-0'>
          <span className='event-view-icon-'><LuCalendarDays size={20} color='#9172EC'/></span>
          {formatReadableDate(event && event.startDate).day}
        </p>
        <p className='event-date p-black'>
          <span className='event-view-icon-'><RxLapTimer size={20} color='#9172EC'/></span>
          {formatReadableDate(event && event.startDate).time}
        </p>
      </div>
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
          ? "Sold out"
          : getRegistrationStatus(event.startDate, event.endDate) === "soon"
          ? "Coming Soon"
          : "Get ticket"}
      </button>
    </div>
    </Link>
  );
};

export default Card;
