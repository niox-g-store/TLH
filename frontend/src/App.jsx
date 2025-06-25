import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Common/Header/Header";
import Home from "./containers/HomePage";
import Footer from "./components/Common/Footer/Footer";
import About from "./containers/About";
import Login from "./containers/Login";
import Signup from "./containers/SignUp";
import FAQs from "./containers/Faq";
import Events from "./containers/Events";
import ContactUs from "./containers/Contact";
import TestBack from "./pages/TestBack";
import User from "./pages/User";
import Gallery from "./containers/Gallery";
import ScrollToTop from "./components/Common/ScrollToTop";
import UserDb from "./pages/UserDb";
import OrganizerSignUp from "./containers/Organizer/SIgnUp";
import Page404 from "./containers/Page404";

const App = () => {
  const location = useLocation();
  useEffect(() => {
    AOS.init({
      offset: 130,
      duration: 1200,
      easing: "ease-out-cubic",
      mirror: true,
      anchorPlacement: "bottom-center",
    });
    AOS.refresh();
  }, []);
  return (
    <>
    <ScrollToTop />
      {location.pathname !== "/login" && <Header /> &&
        location.pathname !== "/signup" && <Header /> &&
        location.pathname !== "/organizer-signup" && <Header />}

      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/organizer-signup" element={<OrganizerSignUp />} />
        <Route path="/FAQs" element={<FAQs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/testapi" element={<TestBack />} />
        <Route path="/user" element={<User />}>
          {/*<Route path="dashboard" element={<UserDb />} />*/}
        </Route>
      </Routes>

      {location.pathname !== "/login" && <Footer /> &&
        location.pathname !== "/signup" && <Footer /> &&
        location.pathname !== "/organizer-signup" && <Footer />}
    </>
  );
};

export default App;
