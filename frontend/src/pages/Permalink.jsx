import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


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

const Permalink = () => {
    const { long, lat } = useParams();
    const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 }); 
    const [markerRef, setMarkerRef] = useState(null);

    const longitude = parseFloat(long);
    const latitude = parseFloat(lat);

    useEffect(() => {
        addGlobalStyle(style);


        if (markerRef) {
            markerRef._icon.classList.add("huechange");
        }
    }, [markerRef]);

    return (
        <>
            <MapContainer
                center={[latitude, longitude]}  
                zoom={18} 
                style={{ top: '0', left: '0', width: '100%', height: '100%', position: 'absolute' }} 
                scrollWheelZoom={true} 
                dragging={true}
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

                <Marker
                    position={[latitude, longitude]} 
                />
            </MapContainer>
        </>
    );
};

export default Permalink;
