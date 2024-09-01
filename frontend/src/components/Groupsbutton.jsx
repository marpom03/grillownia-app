import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, Typography, Box } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export default function Groupsbutton() {
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
          left: 80,
        }}
        onClick={handleClickOpen}
      >
        <ListIcon />
      </Fab>
      
  
  
    </>
  );
}
