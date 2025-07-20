import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import Dropdown from "../../store/Others/DropDown";
import UserHeader from "../../store/UserHeader";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ROLES } from "../../../constants";

const Header = (props) => {
  const {
    authenticated,
    user,
    signOut,
    isMenuOpen,
    toggleMenu,
    links,
    isViewingEvent
  } = props;
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100); // Trigger at 100px scroll (adjust as needed)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const doLogout = () => {
    signOut();
    return <Navigate to="/login" replace />
  };
  const headersList = ['/event/', '/product/', '/shop/', '/dashboard']
  const showHeader = !headersList.some(path => location.pathname.startsWith(path))

  return (
    <>
      <header className={`${scrolled ? "scrolled d-block" : !showHeader ? 'd-block' : 'd-none'} ${isViewingEvent ? 'bg-black' : ''}`} data-aos={scrolled ?? "fade-down"} data-aos-delay={scrolled ?? "50"}>
        <div className="container">
          <div className="navigation">
            <div className="logo">
              <Link to="/">
                <div className="logo-image" alt="LogoImage" />
              </Link>
            </div>
            <UserHeader doLogout={doLogout} {...props} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
