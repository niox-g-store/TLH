import React from "react";

const HomeBanner = () => {
    return (
        <div className="homeBanner">
            <div className="videoContainer">
                <video autoPlay muted playsInline loop>
                    <source src={"/homepage/purple.webm"} type="video/mp4"></source>
                </video>
                <span>
                    Our vision, Our innovation, Event Solutions
                </span>
                <span>
                    Welcome to TLH platform
                </span>
            </div>
        </div>
    )
}

export default HomeBanner
