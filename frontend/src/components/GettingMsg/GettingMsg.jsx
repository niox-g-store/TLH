import aa from "../../assets/aa.jpg";
import "./GettingMsg.css";

const GettingMsg = () => {
  return (
    <>
      <section className="getting-msg">
        <div className="container">
          <div className="getting-msg-row-wrapper">
            <div className="col-getting-msg-profile">

              <div className="founder-name">
                <h2 className="h3 align-middle" data-aos="fade-up">
                  Reputable organizations we have worked with
                </h2>
                <p data-aos="fade-up"></p>
              </div>
            </div>

            {/*<div
              className="col-getting-msg-content"
              data-aos="fade-up"
              data-aos-delay="400">
              <h2>
                Our goal is to build software that enables users who need it to
                launch their products in this pandemic and all-digital time
              </h2>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default GettingMsg;
