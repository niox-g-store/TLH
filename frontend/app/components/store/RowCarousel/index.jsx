import React, { useRef } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const RowCarousel = (props) => {
  const { children, buttonClassName,
          buttonClassLeftName, buttonClassRightName,
          leftArrow, rightArrow, showArrows = true,
        }= props;
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (showArrows) {

  return (
    <div className="row_carousel">
      <div className={`carousel-buttons carousel-buttons-left ${buttonClassName && buttonClassName} ${buttonClassLeftName && buttonClassLeftName}`} onClick={scrollLeft}>
        {leftArrow ? <span>&larr;</span> : <span><MdKeyboardArrowLeft size={20}/></span>}
      </div>

      <div ref={scrollRef} className="carousel_content">
        {children}
      </div>

      <div className={`carousel-buttons carousel-buttons-right ${buttonClassName && buttonClassName} ${buttonClassRightName && buttonClassRightName}`} onClick={scrollRight}>
        {rightArrow ? <span>&rarr;</span> : <span><MdKeyboardArrowRight size={20}/></span>}
      </div>
    </div>
  );
 } else {
    return (
    <div className="row_carousel">

      <div ref={scrollRef} className="carousel_content">
        {children}
      </div>

    </div>
  );
 }
};

export default RowCarousel;