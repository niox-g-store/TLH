import React from 'react';

const HomeBanner = (props) => {
  const { media = "/uploads/videos/purple.mp4" } = props;
  console.log(media)

  /*const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
  };*/

  /*const getMimeType = (url) => {
    if (url.endsWith('.mp4')) return 'video/mp4';
    if (url.endsWith('.webm')) return 'video/webm';
    if (url.endsWith('.mov')) return 'video/quicktime';
    return 'video/mp4';
  };*/

  return (
    <div className="homeBanner">
      <div className="videoContainer">
        {media ? (
          <video autoPlay muted playsInline loop>
            <source src={media} type={'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={media} alt="Banner" className="bannerImage" />
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
