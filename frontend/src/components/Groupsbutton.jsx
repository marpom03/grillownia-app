import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox, Typography } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';

export default function Groupsbutton() {
  const [open, setOpen] = useState(false);
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [seeGrill, setSeeGrill] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    axiosInstance.get('/users')
      .then(response => {

        setPeople(response.data.users); // Update state with fetched users
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    axiosInstance.get('/groups')
      .then(response => {
        console.log(response)

      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenNewGroupModal = () => {
    setOpenNewGroupModal(true);
  };

  const handleCloseNewGroupModal = () => {
    setOpenNewGroupModal(false);
  };

  const handleToggleChange = (event) => {
    setSeeGrill(event.target.checked);
  };

  const handlePeopleChange = (event) => {
    setSelectedPeople(event.target.value);
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

      {/* First Modal - List of Groups */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Groups</DialogTitle>
        <DialogContent>
          <Typography>No groups available.</Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <Fab color="primary" aria-label="add" onClick={handleOpenNewGroupModal}>
            <AddIcon />
          </Fab>
        </DialogActions>
      </Dialog>

      {/* Second Modal - Add New Group */}
      <Dialog open={openNewGroupModal} onClose={handleCloseNewGroupModal}>
        <DialogTitle>Add New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="groupName"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="people-select-label">Select People</InputLabel>
            <Select
              labelId="people-select-label"
              id="people-select"
              multiple
              value={selectedPeople}
              onChange={handlePeopleChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {people.map((person) => (
                <MenuItem key={person.id} value={person.username}>
                  <Checkbox checked={selectedPeople.indexOf(person.username) > -1} />
                  <ListItemText primary={person.username} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={seeGrill}
                onChange={handleToggleChange}
                color="primary"
              />
            }
            label="Czy grupa ma widzieć grilla?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewGroupModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseNewGroupModal} color="primary">
            Add Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
