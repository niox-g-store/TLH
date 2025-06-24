import React from "react";
import GalleryWrapper from "../../components/GalleryWrapper";
import { galleries } from "./data";

class Gallery extends React.PureComponent {

    render () {
        return (
            <section className="gallery-page">
                <h2 className="gallery-heading">Gallery</h2>
                    <GalleryWrapper galleries={galleries} />
            </section>
        );
    }
};

export default Gallery;
