import React from "react";

const HomeBanner = () => {
    return (
        <div className="homeBanner">
            <div className="videoContainer">
                <video autoPlay muted playsInline loop>
                    <source src={"/uploads/videos/purple.webm"} type="video/mp4"></source>
                </video>
            </div>
        </div>
    )
}

export default HomeBanner
