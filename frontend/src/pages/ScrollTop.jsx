export const ScrollTop = (props) => {
  const { height = 0, behavior = 'smooth' } = props;
  window.scrollTo({
    top: height,
    behavior, // 'smooth' or 'auto'
  });
};
