import React, { useState } from "react";
import "./DevicePage.css";
import Button from "../../Common/HtmlTags/Button";
import { Link } from "react-router-dom";

const DevicePage = () => {
  const [state, setState] = useState(null);
  const toggleClick = () => {
    setState(!state);
  };
  const ModalImg = "./uploads/images/w-1.jpeg";

  return (
    <>
      <section className="device-page">
        <div className="container">
          <div className="device-page-row-wrapper">

            <div
              className="col-page-image"
              id="col-page-image"
              data-aos="fade-up">
              <img src={ModalImg} className="modal-img" />
            </div>


            <div className="col-page-content d-flex flex-column align-items-center" data-aos="fade-up" data-aos-delay="300">
              <h2 className="h2-content p-black">
                Join the vibe!!
              </h2>
              <p className="p-black p-info text-justify">We host epic games nights, pool parties, chill picnics, group trips, vacations, networking events & so much more. Come for the vibes, stay for the crew!</p>
              <Link target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2"><Button type={"secondary"} text={"Join the chat room"}/></Link>
            </div>
            <div className={`video-overlay ${state ? "open" : ""}`}></div>
            <div
              className={`modal-video-wrapper ${state ? "show" : ""}`}
              id="modal-video-wrapper">
              <div className="modal-running-div">
                <div className="mymodal">
                  <span className="close" onClick={toggleClick} id="close">
                    <svg
                      fill="#000000"
                      height="10px"
                      width="10px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 490 490"
                      xmlSpace="preserve">
                      <polygon
                        points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
                   489.292,457.678 277.331,245.004 489.292,32.337 "
                      />
                    </svg>
                  </span>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DevicePage;
