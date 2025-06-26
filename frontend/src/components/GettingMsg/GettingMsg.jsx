import aa from "../../../public/assets/aa.jpg";
import "./GettingMsg.css";
import BrandSection from "../BrandSection/BrandSection";

const blogo1 = "./assets/partner/partner_1.png";
const blogo2 = "./assets/partner/partner_2.png";
const blogo3 = "./assets/partner/partner_3.png";
const blogo4 = "./assets/partner/partner_4.png";
const blogo5 = "./assets/partner/partner_1.png";
const blogo6 = "./assets/partner/partner_2.png";
const blogo7 = "./assets/partner/partner_3.png";
const blogo8 = "./assets/partner/partner_4.png";

const logoData = [
  {
    name: "logo 1",
    img: blogo1,
  },
  {
    name: "logo 2",
    img: blogo2,
  },
  {
    name: "logo 3",
    img: blogo3,
  },
  {
    name: "logo 4",
    img: blogo4,
  },
  {
    name: "logo 5",
    img: blogo5,
  },
  {
    name: "logo 6",
    img: blogo6,
  },
  {
    name: "logo 7",
    img: blogo7,
  },
  {
    name: "logo 8",
    img: blogo8,
  },
];

const GettingMsg = () => {
  return (
    <>
      <section className="getting-msg">
        <div className="container">
          <div className="getting-msg-row-wrapper">
            <div className="col-getting-msg-profile">

              <div className="founder-name">
                <h2 className="align-middle display-flex display-middle" data-aos="fade-up">
                  Reputable organizations we have worked with
                </h2>
                <BrandSection images={logoData} slidesToShow={2}/>

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
