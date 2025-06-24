import React from "react";
import Pagination from "../Pagination";
import Card from "../Card";

const GalleryWrapper = ({ galleries }) => {
  return (
    <div className="gallery-wrapper">
      <Pagination
        items={galleries}
        itemsPerPage={8}
        scrollToTopHeight={0}
        renderItem={(gallery, index) => <Card event={gallery} key={index} />}
      />
    </div>
  );
};

export default GalleryWrapper;
