export const sortEvents = (events) => {
  return events.sort((a, b) => {
    const startDateA = new Date(a.eventStartDate);
    const startDateB = new Date(b.eventStartDate);
    const currentDate = new Date();

    if (startDateA <= currentDate && startDateB > currentDate) {
      return -1; // Event A is happening now, should come before Event B
    } else if (startDateA > currentDate && startDateB <= currentDate) {
      return 1; // Event B is happening now, should come before Event A
    } else {
      // Events are either both in the future or both past/present
      return startDateA - startDateB;
    }
  });
};

export const getRegistrationStatus = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const currentDate = new Date();

    if (endDate < currentDate) {
      return "closed";
    } else if (startDate > currentDate) {
      return "soon";
    } else {
      return "now";
    }
};

export const formatDateRange = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleString("default", { month: "short" });
    const year = startDate.getFullYear().toString().substr(-2); // Get last two digits of the year
    return `${startDay} - ${endDay} ${month} ${year}`;
  };
