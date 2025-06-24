export const scrollToTop = (height = 0, behavior = 'smooth') => {
  window.scrollTo({
    top: height,
    behavior, // 'smooth' or 'auto'
  });
};
