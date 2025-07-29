import React from "react";
import "./Footer.css";
import { MdOutlineWhatsapp, MdOutlineMailOutline } from "react-icons/md";
import { AiOutlineTikTok, AiOutlineInstagram } from "react-icons/ai";
import Button from "../HtmlTags/Button";
import Input from "../HtmlTags/Input";

const Footer = (props) => {
  const { email, newsLetterSubscribeChange, subscribeToNewsletter, subFormErrors } = props;
  const ftrlogo = "/black_logo.png";
  const handleSubmit = event => {
      event.preventDefault();
      subscribeToNewsletter();
  };

  const SubscribeButton = (
    <Button type='submit' className='primary' text='Subscribe' />
  );
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-row-wrapper">
            <div className="col-ftr-logo">
              <a href="#">
                <img className="width-100 footer-logo" src={ftrlogo} alt="logo" />
              </a>
            </div>
            <div className="col-ftr-links footer-links">
              <div className="col-links-p">
                <h4 className="p-white">Quick Links</h4>
                <ul>
                  <li>
                    <a className="p-white" target="_blank" href="/about">About us</a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="/terms">Terms & Conditions</a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="/privacy">Privacy Policy</a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="/faq">FAQs</a>
                  </li>
                </ul>
              </div>
              <div className="col-links-c">
                <h4 className="p-white">Socials</h4>
                <ul className="d-flex flex-column" style={{ gap: '.25em' }}>
                  <li>
                    <a className="p-white" target="_blank" href="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">
                    <MdOutlineWhatsapp size={20}/> Whatsapp
                    </a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="https://www.tiktok.com/@linkhangouts?_t=ZN-8xRsHnS1ygY&_r=1">
                    <AiOutlineTikTok size={20} /> Tiktok
                    </a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="https://www.instagram.com/thelinkhangouts?igsh=MThybGJsMDA3bW50ZA%3D%3D&utm_source=qr">
                    <AiOutlineInstagram size={20} /> Instagram
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-links-s">
                <h4 className="p-white">Support</h4>
                <ul className="d-flex flex-column" style={{ gap: '.25em' }}>
                  <li>
                    <a className="p-white" href="mailto:contact@thelinkhangout.com">
                      <MdOutlineMailOutline size={20} /> Email
                    </a>
                  </li>
                  <li>
                    <a className="p-white" target="_blank" href="https://wa.me/message/PIGYWR7NTGHKK1">
                    <MdOutlineWhatsapp size={20}/> Whatsapp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-ftr-newsletter">
              <h4 className="p-white">Want to stay up to date with us?</h4>
              <p className="p-white p-content p-all-features">
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleSubmit}>
                <div className='subscribe'>
                  <Input
                    type={'text'}
                    error={subFormErrors['email']}
                    name={'email'}
                    placeholder={'Please Enter Your Email'}
                    value={email}
                    onInputChange={(name, value) => {
                      newsLetterSubscribeChange(name, value);
                    }}
                    inlineElement={SubscribeButton}
                  />
                </div>
              </form>
                <p className="p-white sub-text">
                By subscribing to our newsletter you agree to our privacy policy and communication emails from us
              </p>
            </div>
          </div>
          <div className="ftr-copyright">
            <div className="ftr-copyright-links">
              <p className="p-white ftr-copyright-symbol">&copy; {new Date().getFullYear()} The Link Hangouts</p>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
