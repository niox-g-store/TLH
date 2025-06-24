// components/Common/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../../../pages/scrollToTop";

const ScrollToTop = ({ height = 0 }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop(height); // Call your utility here on route change
  }, [pathname, height]);

  return null;
};

export default ScrollToTop;
