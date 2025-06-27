import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import store from "./store.jsx";
import setToken from "./utils/token.jsx";
import { SET_AUTH } from "./containers/Authentication/constants.jsx";
import App from "./App.jsx";
import ScrollToTop from "./components/Common/ScrollToTop/index.jsx";

import './styles/_index.scss';
import '../global.css'

// Authentication
const token = localStorage.getItem('token');

if (token) {
  // authenticate api authorization
  setToken(token);

  // authenticate routes
  store.dispatch({ type: SET_AUTH });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
