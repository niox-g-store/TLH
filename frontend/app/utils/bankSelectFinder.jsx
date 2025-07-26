export const bankSelectFinder = (property, value) => {
  if (property && value) {
    return property.filter(prop => value === prop.label)[0];
  }
  return null;
};