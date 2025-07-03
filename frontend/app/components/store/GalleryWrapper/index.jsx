import React from "react";
import Pagination from "../Pagination";
import Card from "../Card";

const GalleryWrapper = ({ galleries }) => {
  return (
    <div className="gallery-wrapper">
      <h2 data-aos="fade-up">Explore our gallery</h2>
      <div className="upcoming-events">
        <Pagination
          items={galleries}
          itemsPerPage={8}
          scrollToTopHeight={0}
          renderItem={(gallery, index) => <Card event={gallery} key={index} type={"gallery"} />}
        />
      </div>
    </div>
  );
};

export default GalleryWrapper;
