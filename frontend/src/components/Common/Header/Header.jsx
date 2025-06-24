import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      <header className={scrolled ? "scrolled" : ""} data-aos={scrolled ?? "fade-down"} data-aos-delay={scrolled ?? "300"}>
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
                  <Link to="/organizers">Organizers</Link>
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
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
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
                <Link to="/events/create" className="button--secondary">
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
                  <Link to="/events">Discover Events</Link>
                </li>

                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/organizers">Organizers</Link>
                </li>

                <li>
                  <Dropdown parent={"Pages"}>
                    <Link to={"/about"}>About Us</Link>
                    <Link to={"/terms"}>Terms & Conditions</Link>
                    <Link to={"/privacy"}>Privacy Policy</Link>
                    <Link to={"/faq"}>FAQs</Link>
                  </Dropdown>
                </li>

                <li>
                  <Link to="/blog">Blog</Link>
                </li>

                <li>
                  <Link to="/whatsapp">Join the chat room</Link>
                </li>

                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>

                </ul>
              </div>
              <div className="buttons">
                <Link to="/login" className="button">
                  Log In
                </Link>
                <Link to="/events/create" className="button--secondary">
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
