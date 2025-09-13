import React from 'react';

export default function MapPreview({ lat, lng, address }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  return (
    <div>
      <div className="map-snap">
        <iframe title="map" src={src} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
      </div>
      {address && <div className="text-xs dark:text-gray-300 text-gray-500 mt-1">{address}</div>}
    </div>
  );
}
