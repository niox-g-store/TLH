import { ADD_SCANNED_TICKET, CLEAR_SCANNED_TICKETS } from './constants';

export const addScannedTicket = (ticket) => ({
  type: ADD_SCANNED_TICKET,
  payload: ticket
});

export const clearScannedTickets = () => ({
  type: CLEAR_SCANNED_TICKETS
});
