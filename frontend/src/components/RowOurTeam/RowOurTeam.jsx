import React from "react";
import "./RowOurTeam.css";

const RowOurTeam = () => {
  const team1 = "./assets/team/team_1.JPG";
  const team2 = "./assets/team/team_2.JPG";
  const team3 = "./assets/team/team_3.JPG";
  const team4 = "./assets/team/team_2.JPG";
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
              {/*<div className="col-our-team-item items-2">
                <div className="item-img" data-aos="zoom-in-up">
                  <img src={team4} alt="item4" width="320" height="322" />
                </div>
                <div className="item-content">
                  <div className="item-inner">
                    <h2 className="font-size-30" data-aos="fade-up">
                      Berry Syam
                    </h2>
                    <p className="font-size-20" data-aos="fade-up">VP of Engineering</p>
                    <p className="font-size-14" data-aos="fade-up">
                      Getting the best out of the dev squad and building solid
                      products together is what puts a smile on my face
                    </p>
                  </div>
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RowOurTeam;
