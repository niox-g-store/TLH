import React from "react";
import "./RowOurTeam.css";

const RowOurTeam = () => {
  const team1 = "./assets/team/team_1.JPG";
  const team2 = "./assets/team/team_2.JPG";
  const team3 = "./assets/team/team_3.JPG";
  const team4 = "./assets/team/team_4.JPG";
  const team5 = "./assets/team/team_5.jpg";
  const team6 = "./assets/team/team_6.jpg";
  return (
    <>
      <section className="row-our-team">
        <div className="container">
          <div className="row-wrapper-our-team">
            <div className="row-team-heading">
              <h2 className="h4" data-aos="fade-up">
                Our Team
              </h2>
              <h2 data-aos="fade-up">
                Meet our amazing team behind the scenes
              </h2>
            </div>
            <div className="row-wrapper-our-team-list">
              <div className="col-our-team-item items-1">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team1} alt="item1" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Oluwatobiloba Jamal
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Event director</p>
                    <p className="font-size-14" data-aos="fade-up">
                      oversees the planning and execution of every event with precision and creativity. With a passion for delivering seamless experiences, he ensures each event reflects our clients’ vision and exceeds expectations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-our-team-item items-2">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team2} alt="item2" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Lawal Oluwatomiwa
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Head of sales and marketing</p>
                    <p className="font-size-14" data-aos="fade-up">
                      leads our sales and marketing with a sharp eye for strategy and a passion for creating memorable event experiences. She connects clients to impactful moments that resonate and deliver results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row-wrapper-our-team-list col-reverse">
              <div className="col-our-team-item items-1">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team3} alt="item3" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Akintola Jenrola
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Hospitality Manager</p>
                    <p className="font-size-14" data-aos="fade-up">
                      ensures every guest experience is seamless, welcoming, and memorable. With a strong eye for detail and a commitment to excellence, she oversees all hospitality operations to create a warm and professional environment at every event.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-our-team-item items-2">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team4} alt="item4" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Daniel Adewoye
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Media Director</p>
                    <p className="font-size-14" data-aos="fade-up">
                      leads all cinematic and visual storytelling for our events, capturing each moment with creativity and precision. With a passion for impactful content, he ensures every frame reflects the energy, emotion, and essence of the experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-our-team-item items-2">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team5} alt="item4" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Blessing Ngozi
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Hospitality Management Assistant</p>
                    <p className="font-size-14" data-aos="fade-up">
                      supports the hospitality team in delivering smooth, guest focused experiences at every event. From coordinating logistics to ensuring client comfort, she plays a key role in making every moment feel seamless and welcoming.                    </p>
                  </div>
                </div>
              </div>

              <div className="col-our-team-item items-2">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team6} alt="item4" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Aderemi Adedoyin
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">Event Setup Coordinator</p>
                    <p className="font-size-14" data-aos="fade-up">
                      She ensures every event space is perfectly prepared, from layout and décor to technical readiness. With a keen eye for detail and a hands on approach, she makes sure each venue is event ready, visually stunning, and aligned with the client’s vision.
                    </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RowOurTeam;
