import React from "react";
import GalleryWrapper from "../../components/store/GalleryWrapper";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import { galleries } from "./data";

class Gallery extends React.PureComponent {

    render () {
        const firstImage = galleries[0];
        return (
            <>
            <section className="gallery-page bg-white">
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
