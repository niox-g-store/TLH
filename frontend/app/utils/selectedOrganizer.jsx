export const saveSelectedOrganizerToStorage = (selectedOrganizer) => {
  localStorage.setItem('organizerId', JSON.stringify(selectedOrganizer));
};

export const getSelectedOrganizerFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('organizerId')) || null;
  } catch (error) {
    return null;
  }
};
