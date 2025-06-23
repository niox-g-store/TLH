import React from "react";
import ftrlogo from "../../assets/logo.png";
import Share from "../../assets/Share.png";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-row-wrapper">
            <div className="col-ftr-logo">
              <a href="#">
                <img className="width-100" src={ftrlogo} alt="logo" />
              </a>
            </div>
            <div className="col-ftr-links">
              <div className="col-links-p">
                <h4 className="p-white">Quick Links</h4>
                <ul>
                  <li>
                    <a className="p-white" href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">FAQs</a>
                  </li>
                </ul>
              </div>
              <div className="col-links-c">
                <h4 className="p-white">Socials</h4>
                <ul>
                  <li>
                    <a className="p-white" href="#">Whatsapp</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">Tiktok</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">Instagram</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">Blog</a>
                  </li>
                </ul>
              </div>
              <div className="col-links-s">
                <h4 className="p-white">Support</h4>
                <ul>
                  <li>
                    <a className="p-white" href="#">Contact Us</a>
                  </li>
                  <li>
                    <a className="p-white" href="#">Join the chat room</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-ftr-newsletter">
              <h4 className="p-white">Subscribe to our newsletter</h4>
              <p className="p-white p-content p-all-features">
                Want to stay up to date with us?
              </p>
              <input type="email" placeholder="Email" />
              <p className="p-white sub-text">
                By subscribing to our newsletter you agree to our privacy policy
                and will get commercial communication.
              </p>
            </div>
          </div>
          <div className="ftr-copyright">
            <div className="ftr-copyright-links">
              <p className="ftr-copyright-symbol">&copy; {new Date().getFullYear()} The Link Hangouts</p>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
