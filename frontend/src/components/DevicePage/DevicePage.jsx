import React, { useState } from "react";
import "../DevicePage/DevicePage.css";
import Button from "../Common/HtmlTags/Button";
import { Link } from "react-router-dom";

const DevicePage = () => {
  const [state, setState] = useState(null);
  const toggleClick = () => {
    setState(!state);
  };
  const ModalImg = "./assets/events/event_5.jpg";

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
              {/*<img src={ConfImg} alt="conference-image" />
              {<div className="video-play-button" onClick={toggleClick}>
                <svg
                  onClick={toggleClick}
                  className="play-logo"
                  width={30}
                  height={30}
                  viewBox="-0.5 0 7 7"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth={1}
                    fill="none"
                    fillRule="evenodd">
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-347.000000, -3766.000000)"
                      fill="#fff">
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)">
                        <path
                          d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322"
                          id="play-[#1003]"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>*/}
            </div>


            <div className="col-page-content" data-aos="fade-up" data-aos-delay="800">
              <h2 className="h2-content">
                Join the vibe!!
              </h2>
              <p className="p-content p-info">We host epic games nights, pool parties, chill picnics, group trips, vacations, networking events & so much more. Come for the vibes, stay for the crew!</p>
              <Link to="/create-event"><Button type={"secondary"} text={"Join the chat room"}/></Link>
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
                  {/*<video
                    src={video1}
                    type="video/mp4"
                    width={320}
                    height={240}
                    id="video1"
                    controls="controls"></video>*/}
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
