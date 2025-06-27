import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import actions from './actions';

import Footer from './components/Common/Footer/Footer';

import Authentication from './containers/Authentication';
import Home from './containers/HomePage';
import Notification from './containers/Notification';
import About from './containers/About';
import Login from './containers/Login';
import Signup from './containers/SignUp';
import FAQs from './containers/Faq';
import Events from './containers/Events';
import TestBack from './pages/TestBack';
import Gallery from './containers/Gallery';
import OrganizerSignUp from './containers/Organizer/SignUp';
import Dashboard from './containers/Dashboard';
import Page404 from './containers/Page404';
import Navigation from './containers/Navigation';

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
      <Notification />
      {showHeaderFooter && <Navigation />}
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
        <Route path="/dashboard/*" element={<Authentication><Dashboard /></Authentication>} />
      </Routes>

      {showHeaderFooter && <Footer />}
    </>
  );
}

const mapStateToProps = (state) => {
  console.log(state)
  return {};
};

export default connect(mapStateToProps, actions)(App);
