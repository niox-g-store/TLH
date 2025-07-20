export const saveSelectedProductsToStorage = (selectedProducts) => {
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
};

export const getSelectedProductsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('selectedProducts')) || [];
  } catch {
    return [];
  }
};
