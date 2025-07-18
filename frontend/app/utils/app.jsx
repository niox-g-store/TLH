import { ROLES, EMAIL_PROVIDER } from '../constants';

export const isProviderAllowed = (provider) =>
  provider === EMAIL_PROVIDER.Email;
export const isDisabledOrganizerAccount = (user) =>
  user.role === ROLES.Organizer &&
  user.organizer &&
  user.organizer.isActive === false;
