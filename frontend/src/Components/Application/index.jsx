import { React, useEffect} from "react";
import { connect } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Header from "../Layouts/Header";
// import Footer from "./Layouts/Footer";
import HomePage from "../Homepage";

const Application = () => {
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
        <div className="application">
            <Header />
            {/* notification */}
            <Routes>
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
                <Route path="/" element={<HomePage />} />
            </Routes>

        </div>
    );
}

export default Application;