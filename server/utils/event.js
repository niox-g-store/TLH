const getEventStatus = (startDate, endDate) => {
  const now = new Date();

  if (now < startDate) {
    return "Upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "Ongoing";
  } else {
    return "Ended";
  }
}

exports.updateEventStatus = (event) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  event.status = getEventStatus(startDate, endDate);
  return event;
}

