import React, { useState, useEffect } from 'react';
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

const Map = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [markerRef, setMarkerRef] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [description, setDescription] = useState('');

  useEffect(() => {
    axiosInstance.get('/location/visible')
      .then(response => {
        const now = dayjs();
        const filteredMarkers = response.data.locations.filter(location => dayjs(location.to_date).isAfter(now));
        setMarkers(filteredMarkers);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    addGlobalStyle(style);

    if (markerRef) {
      markerRef._icon.classList.add("huechange");
    }
  }, [markerRef]);

  useEffect(() => {
    if (markerPosition.lat !== undefined && markerPosition.lng !== undefined) {
      setMarkerPosition({ lat: markerPosition.lat, lng: markerPosition.lng });
    }
  }, [markerPosition]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        if (lat !== undefined && lng !== undefined) {
          setMarkerPosition({ lat, lng });
          // Removed the handleClickOpen() call to prevent modal opening on map click
        }
      }
    });

    return null;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateEvent = async() => {
    await axiosInstance.post('/location', {
      title: eventName,
      from: startDate,
      to: endDate,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
      public: isPublic,
      description: description
    });
    setOpen(false);
  };

  const handleToggleChange = (event) => {
    setIsPublic(event.target.checked);
  };

  const handleMarkerClick = (title, description) => {
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);
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
        onClick={handleClickOpen}
      >
        <AddLocationAltIcon />
      </Fab>
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: { padding: '24px' },
        }}
      >
        <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: '#333' }}>
          Nowe Wydarzenie
        </Typography>
        <Typography variant="body1">{markerPosition.lat} -- {markerPosition.lng}</Typography>
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
          <Button onClick={handleClose} color="primary" style={{ fontFamily: 'Roboto' }}>
            Anuluj
          </Button>
          <Button onClick={handleCreateEvent} color="primary" variant="contained" style={{ fontFamily: 'Roboto' }}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Map;
