import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Addbutton from './Addbutton';
import Groupsbutton from './Groupsbutton';
import axiosInstance from '../services/axios';

const style = `
  .huechange {
    filter: hue-rotate(150deg); /* Ustawienie koloru markera, dostosuj kąt zgodnie z potrzebami */
  }
`;

const addGlobalStyle = (css) => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
};

const googleSatUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [markerRef, setMarkerRef] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axiosInstance.get('/location/visible')
      .then(response => {
        setMarkers(response.data.locations);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    addGlobalStyle(style);

    if (markerRef) {
      markerRef._icon.classList.add("huechange");
    }
  }, [markerRef]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // Tylko aktualizuj, jeśli lat i lng są różne od undefined
        if (lat !== undefined && lng !== undefined) {
          setMarkerPosition({ lat, lng });
        }
      }
    });

    return null;
  };

  return (
    <>
      <MapContainer
        center={[50.0685, 19.90599]}
        zoom={18}
        style={{ top: '0', left: '0', width: '100%', height: '100%', position: 'absolute' }}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer
          url={googleSatUrl}
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps/">Google Maps</a>'
        />

        <MapClickHandler />

        {markers.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            ref={(marker) => setMarkerRef(marker)}
          />
        ))}

        <Marker
          position={markerPosition}
          ref={(marker) => setMarkerRef(marker)}
        />
      </MapContainer>

      <Groupsbutton />
      <Addbutton lat={markerPosition.lat} lng={markerPosition.lng} />
    </>
  );
};

export default MapComponent;
