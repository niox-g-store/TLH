import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import actions from './actions';

import Header from './components/Common/Header/Header';
import Footer from './components/Common/Footer/Footer';

import Home from './containers/HomePage';
import About from './containers/About';
import Login from './containers/Login';
import Signup from './containers/SignUp';
import FAQs from './containers/Faq';
import Events from './containers/Events';
import ContactUs from './containers/Contact';
import TestBack from './pages/TestBack';
import User from './pages/User';
import Gallery from './containers/Gallery';
import OrganizerSignUp from './containers/Organizer/SignUp';
import Page404 from './containers/Page404';

function App(props) {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      offset: 130,
      duration: 1200,
      easing: 'ease-out-cubic',
      mirror: true,
      anchorPlacement: 'bottom-center',
    });
    AOS.refresh();
  }, []);

  const hideHeaderFooterPaths = ['/login', '/signup', '/organizer-signup'];
  const showHeaderFooter = !hideHeaderFooterPaths.includes(location.pathname);

  return (
    <>
      {showHeaderFooter && <Header />}

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
          {/* <Route path="dashboard" element={<UserDb />} /> */}
        </Route>
      </Routes>

      {showHeaderFooter && <Footer />}
    </>
  );
}

const mapStateToProps = (state) => {
  console.log(state);
  return {};
};

export default connect(mapStateToProps, actions)(App);
