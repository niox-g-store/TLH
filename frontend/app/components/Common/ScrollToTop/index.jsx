import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTop } from "../../../pages/ScrollTop";

const ScrollToTop = ({ height = 0 }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    ScrollTop(height);
  }, [pathname, height]);

  return null;
};

export default ScrollToTop;

