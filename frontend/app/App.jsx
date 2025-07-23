import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import actions from './actions';
import { ROLES } from './constants';

import Navigation from './containers/Navigation';
import Footer from './components/Common/Footer/Footer';

import Authentication from './containers/Authentication';
import Home from './containers/HomePage';
import Notification from './containers/Notification';
import About from './containers/About';
import Login from './containers/Login';
import Signup from './containers/SignUp';
import FAQs from './containers/Faq';
import Events from './containers/Events';
import Gallery from './containers/Gallery';
import GalleryView from './containers/Gallery/view';
import Shop from './containers/Shop';
import ProductView from './containers/Product/view';
import OrganizerSignUp from './containers/Organizer/SignUp';
import Dashboard from './containers/Dashboard';
import Page404 from './containers/Page404';
import EventView from './containers/Events/view';
import Terms from './containers/Terms';
import PrivacyPolicy from './containers/Policy';
import OrderSuccess from './containers/Order/success';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import Maintenance from './containers/Maintenance';

import ScrollToTop from './components/Common/ScrollToTop';
import LoadingIndicator from './components/store/LoadingIndicator';

const Appplication = (props) => {
  const { user, settings, uuser, homeMediaIsLoading } = props;
  const location = useLocation();
  const USER = user ?? user.role;
  const { maintenance } = settings;

  useEffect(() => {
    AOS.init({
      offset: 130,
      duration: 1200,
      easing: 'ease-out-cubic',
      mirror: true,
      anchorPlacement: 'bottom-center'
    });
    AOS.refresh();

    const isLight = localStorage.getItem('isLightMode') === 'true';
    document.body.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('dark-mode', !isLight);
  }, []);

  if (maintenance) {
    if (!uuser && !location.pathname.startsWith("/login")) {
      return <Maintenance />
    }
    if (!uuser && location.pathname === '/login') {
    }
  }

  const hideHeader = [
    '/login',
    '/signup',
    '/organizer-signup',
    '/dashboard',
    '/forgot-password',
    '/reset-password'
  ];
  const hideFooter = [
    '/event/',
    '/terms',
    '/privacy',
    '/dashboard',
    '/faq',
    '/gallery',
    '/order',
    '/forgot-password',
    '/login',
    '/signup',
    '/organizer-signup',
    '/reset-password',
    '/shop',
    '/product'
  ];

  const showHeader = (USER.role === ROLES.Member ||
                      !hideHeader.some(path => location.pathname.startsWith(path))
                     );
  //const showFooter = (USER.role === ROLES.Member || !hideFooter.some(path => location.pathname.startsWith(path)))
  const showFooter = (!hideFooter.some(path => location.pathname.startsWith(path)))

  if (homeMediaIsLoading) {
    return <LoadingIndicator />
  }

  return (
    <>
      <ScrollToTop />
      <Notification />
      {showHeader && <Navigation />}
      <Routes>
        <Route path='*' element={<Page404 />} />
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />

        <Route path='/order/success/:id' element={<OrderSuccess />} />

        <Route path='/events' element={<Events />} />
        <Route path='/event/:slug' element={<EventView />} />

        <Route path='/gallery' element={<Gallery />} />
        <Route path='/gallery/:slug' element={<GalleryView />} />

        <Route path='/shop' element={<Shop />} />
        <Route path='/product/:slug' element={<ProductView />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/organizer-signup' element={<OrganizerSignUp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path='/faq' element={<FAQs />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />

        <Route path='/dashboard/*' element={<Authentication><Dashboard /></Authentication>} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

class App extends React.PureComponent {
  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchHomeMedia();
  }
  render() {
    return <Appplication {...this.props} />
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    uuser: state.account.user.role === ROLES.Admin,
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    settings: state.setting.settings,
    homeMediaIsLoading: state.media.isLoading,
  };
};

export default connect(mapStateToProps, actions)(App);