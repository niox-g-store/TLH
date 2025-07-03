export const eventCategoryFinder = (eventCategory, value) => {
  return eventCategory.find(e => e.label === value);
}