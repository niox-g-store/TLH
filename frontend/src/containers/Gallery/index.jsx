import React from "react";
import GalleryWrapper from "../../components/GalleryWrapper";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import { galleries } from "./data";

class Gallery extends React.PureComponent {

    render () {
        const firstImage = galleries[0];
        return (
            <>
            <section className="gallery-page">
                <HeroBanner
                    heading="The link hangouts gallery"
                    desc="PARTY ENTERTAINMENT SERVICE"
                    bannerImage={[]}
                    heroBannerBg={firstImage.image}
                />
                <GalleryWrapper galleries={galleries} />
            </section>
            </>
        );
    }
};

export default Gallery;
