import React from 'react';

const MapEmbed = (props) => {
  const { location } = props;
  return (
    <div style={{ width: '100%', height: '400px' }}>
    <h3 style={{ fontSize: '23px' }}>Location</h3>
      <iframe
        title={`map of ${location}`}
        src={`https://www.google.com/maps?q=${location}&output=embed`}
        width="100%"
        height="100%"
        style={{ borderRadius: '10px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapEmbed;
