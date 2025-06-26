import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import {
  doLogout,
  getCurrentUserDetail,
  isLoggedIn,
} from "../../../../../Backend/auth";

import { CgMenuRightAlt } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import Dropdown from "../../Others/DropDown";
import DropdownConfirm from "../../Others/DropDownConfirm";

const Header = () => {
  const [isActive, setActive] = useState(0);
  const [login, setlogin] = useState(0);
  const [user, setUser] = useState(undefined);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100); // Trigger at 100px scroll (adjust as needed)
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setlogin(isLoggedIn);
    setUser(getCurrentUserDetail);
  }, [login]);

  const toggle = () => {
    setActive(!isActive);
  };

  const logout = () => {
    doLogout(() => {
      setlogin(false);
      console.log("Logout");
    });
  };

  return (
    <>
      <header className={scrolled ? "scrolled" : ""} data-aos={scrolled ?? "fade-down"} data-aos-delay={scrolled ?? "50"}>
        <div className="container">
          <div className="navigation">
            <div className="logo">
              <Link to="/">
                <div className="logo-image" alt="LogoImage" />
              </Link>
            </div>
            <div className="nav">
              <ul>
                <li>
                  <Link to="/events">Discover Events</Link>
                </li>

                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/organizer-signup">Organizers</Link>
                </li>
                <li>
                  <Dropdown type={"hover"} parent={"Pages"}>
                    <Link to={"/about"}>About Us</Link>
                    <Link to={"/terms"}>Terms & Conditions</Link>
                    <Link to={"/privacy"}>Privacy Policy</Link>
                    <Link to={"/faq"}>FAQs</Link>
                  </Dropdown>
                </li>
                <li>
                  <Link target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>
                <li>
                  <Link to="mailto:contact@thelinkhangout.com">Contact Us</Link>
                </li>
              </ul>
            </div>
            {login ? (
              <div className="buttons">
                <div className="user-name">
                  <Link to="/user/dashboard">
                    <p>
                      {user.fname} {user.lname}{" "}
                    </p>
                  </Link>
                </div>
                <div className="logout-button">
                  <Link to="/" className="button " onClick={logout}>
                    Logout
                  </Link>
                </div>
              </div>
            ) : (
              <div className="buttons">
                <Link to="/login" className="button">
                  Log In
                </Link>
                <Link to="/organizer-signup" className="button--secondary">
                  Create event
                </Link>
              </div>
            )}

            <div className="menu-toggle" onClick={toggle}>
              <CgMenuRightAlt color={"white"} size={30}/>
            </div>

            <div className={`header-menu-mobile  ${isActive ? "show" : " "}`}>
              <div
                className={`menu-toggle  ${isActive ? "active" : " "}`}
                onClick={toggle}>
                <IoMdClose color={"white"} size={30}/>
              </div>
              <div className="nav">
                <ul>
                <li>
                  <Link onClick={toggle} to="/">Home</Link>
                </li>
                <li>
                  <Link onClick={toggle} to="/events">Discover Events</Link>
                </li>

                <li>
                  <Link onClick={toggle} to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link onClick={toggle} to="/organizer-signup">Organizers</Link>
                </li>

                <li>
                  <Dropdown parent={"Pages"}>
                    <Link onClick={toggle} to={"/about"}>About Us</Link>
                    <Link onClick={toggle} to={"/terms"}>Terms & Conditions</Link>
                    <Link onClick={toggle} to={"/privacy"}>Privacy Policy</Link>
                    <Link onClick={toggle} to={"/faq"}>FAQs</Link>
                  </Dropdown>
                </li>

                <li>
                  <Link onClick={toggle} target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>

                <li>
                  <Link onClick={toggle} to="mailto:contact@thelinkhangout.com">Contact Us</Link>
                </li>

                </ul>
              </div>
              <div className="buttons">
                <Link onClick={toggle} to="/login" className="button">
                  Log In
                </Link>
                <Link onClick={toggle} to="/organizer-signup" className="button--secondary">
                  Create event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
