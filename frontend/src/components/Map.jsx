import React, { useState, useEffect, useCallback } from 'react';
import {
  MapContainer, TileLayer, Marker, useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../services/axios';
import {
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Switch, FormControlLabel, Typography, Box
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Groupsbutton from './Groupsbutton';

const style = `
  .huechange {
    filter: hue-rotate(150deg); /* Adjust color as needed */
  }
`;

const addGlobalStyle = (css) => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
};

const googleSatUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';

const Map = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [markerRef, setMarkerRef] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axiosInstance.get('/location/visible');
        const now = dayjs();
        const filteredMarkers = response.data.locations.filter(location => dayjs(location.to_date).isAfter(now));
        setMarkers(filteredMarkers);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchMarkers();
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
        if (lat !== undefined && lng !== undefined) {
          setMarkerPosition({ lat, lng });
        }
      }
    });

    return null;
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleCreateEvent = async () => {
    try {
      await axiosInstance.post('/location', {
        title: eventName,
        from: startDate,
        to: endDate,
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        public: isPublic,
        description
      });
      handleDialogClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleToggleChange = (event) => setIsPublic(event.target.checked);

  const handleMarkerClick = (title, description) => {
    alert(`Nazwa: ${title}`+` Opis: ${description}`)

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

        {markers.map(location => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            ref={(marker) => setMarkerRef(marker)}
            eventHandlers={{
              click: () => handleMarkerClick(location.title, location.description)
            }}
          />
        ))}

        <Marker
          position={markerPosition}
          ref={(marker) => setMarkerRef(marker)}
        />
      </MapContainer>

      <Fab
        color="primary"
        aria-label="add-location"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
        }}
        onClick={handleDialogOpen}
      >
        <AddLocationAltIcon />
      </Fab>
      
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          style: { padding: '24px' },
        }}
      >
        <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: '#333' }}>
          Nowe Wydarzenie
        </Typography>

        <DialogContent style={{ padding: '16px 0' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa Wydarzenia"
            type="text"
            fullWidth
            variant="outlined"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{ marginBottom: '24px', fontFamily: 'Roboto' }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap="16px" marginBottom="24px">
              <DateTimePicker
                label="Data Początkowa"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth style={{ fontFamily: 'Roboto' }} />}
                InputLabelProps={{ style: { fontFamily: 'Roboto' } }}
              />
              <DateTimePicker
                label="Data Końcowa"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth style={{ fontFamily: 'Roboto' }} />}
                InputLabelProps={{ style: { fontFamily: 'Roboto' } }}
              />
            </Box>
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Opis"
            type="text"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: '24px', fontFamily: 'Roboto' }}
            InputLabelProps={{ style: { fontFamily: 'Roboto' } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={handleToggleChange}
                name="publicToggle"
              />
            }
            label="Czy wydarzenie publiczne?"
            style={{ marginTop: 16, fontFamily: 'Roboto' }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={handleDialogClose} color="primary" style={{ fontFamily: 'Roboto' }}>
            Anuluj
          </Button>
          <Button onClick={handleCreateEvent} color="primary" variant="contained" style={{ fontFamily: 'Roboto' }}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
      <Groupsbutton />
    </>
  );
};

export default Map;
