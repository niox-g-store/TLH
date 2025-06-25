const HomeBanner = (props) => {
    const { video = "/uploads/videos/purple.mp4" } = props;
    return (
        <div className="homeBanner">
            <div className="videoContainer">
                <video autoPlay muted playsInline loop>
                    <source src={video} type="video/mp4"></source>
                </video>
            </div>
        </div>
    )
}

export default HomeBanner
