import React from "react";
import { connect } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Header from "../Layouts/Header";
// import Footer from "./Layouts/Footer";
// import HomePage from "./HomePage";

class Application extends React.PureComponent {
    render() {
        return (
            <div className="application">
                <Header />
                {/* notification */}

            </div>
        );
    }
}

export default Application;