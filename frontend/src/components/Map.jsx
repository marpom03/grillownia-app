import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Addbutton from './Addbutton';
import Groupsbutton from './Groupsbutton';
import axiosInstance from '../services/axios';
// Dodajemy styl CSS do komponentu
const style = `
  .huechange {
    filter: hue-rotate(150deg); /* Ustawienie koloru markera, dostosuj kąt zgodnie z potrzebami */
  }
`;

// Dodajemy style do <head> dokumentu
const addGlobalStyle = (css) => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
};




const googleSatUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 }); // Domyślna pozycja

  const [markerRef, setMarkerRef] = useState(null);

  useEffect(() => {
    axiosInstance.get('/location/visible')
      .then(response => {
        console.log(response)
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  

  useEffect(() => {
    addGlobalStyle(style);

    // Dodajemy klasę do ikony markera po jego dodaniu do mapy
    if (markerRef) {
      markerRef._icon.classList.add("huechange");
    }
  }, [markerRef]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng); // Aktualizacja pozycji markera
      }
    });

    return null;
  };

  return (
    <>
      <MapContainer
        center={[50.0685, 19.90599]} // Centrum mapy
        zoom={18} // Poziom powiększenia
        style={{ top: '0', left: '0', width: '100%', height: '100%', position: 'absolute' }} // Pełna szerokość i wysokość okna
        scrollWheelZoom={false} // Wyłącza zoomowanie kółkiem myszy
        dragging={false} // Wyłącza przeciąganie mapy
        touchZoom={false} // Wyłącza zoomowanie za pomocą dotyku
        doubleClickZoom={false} // Wyłącza zoomowanie przez podwójne kliknięcie
        zoomControl={false} // Ukrywa kontrolki zoomowania
      >
        <TileLayer
          url={googleSatUrl}
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps/">Google Maps</a>'
        />

        <MapClickHandler />

        <Marker
          position={markerPosition} // Ustawienie pozycji markera
          ref={(marker) => setMarkerRef(marker)} // Przypisanie referencji do markera
        />
      </MapContainer>

      <Groupsbutton />
      
      {/* Przekazujemy aktualne współrzędne markera jako propsy do Addbutton */}
      <Addbutton lat={markerPosition.lat} lng={markerPosition.lng} />
    </>
  );
};

export default MapComponent;
