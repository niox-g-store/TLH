exports.getEventStatus = (startDate, endDate) => {
  const now = new Date();

  if (now < startDate) {
    return "upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "ongoing";
  } else {
    return "ended";
  }
}

exports.updateEventStatus = (event) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  event.status = getEventStatus(startDate, endDate);
  return event;
}

