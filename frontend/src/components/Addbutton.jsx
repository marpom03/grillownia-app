import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, Typography, Box } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export default function Addbutton({ lat, lng }) {

  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleChange = (event) => {
    setIsPublic(event.target.checked);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="push-pin"
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
        <Typography variant="body1">{lat} -- {lng}</Typography>
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
            label="Czy wydarzenie publiczne ?"
            style={{ marginTop: 16, fontFamily: 'Roboto' }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={handleClose} color="primary" style={{ fontFamily: 'Roboto' }}>
            Anuluj
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained" style={{ fontFamily: 'Roboto' }}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
