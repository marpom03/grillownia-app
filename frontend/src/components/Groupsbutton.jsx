import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, ListItemText, Checkbox, Typography, List, ListItem } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';

export default function Groupsbutton() {
  const [open, setOpen] = useState(false);
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [seeGrill, setSeeGrill] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]); // Stan dla grup

  useEffect(() => {
    axiosInstance.get('/users')
      .then(response => {
        setPeople(response.data.users); // Aktualizacja stanu użytkowników
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    axiosInstance.get('/groups')
      .then(response => {
        setGroups(response.data); // Aktualizacja stanu grup
      })
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleToggleChange = async (groupId, currentVisibility) => {
    const newVisibility = currentVisibility === 1 ? 0 : 1;
    await axiosInstance.put('/groups', { groupId, visible_location: newVisibility });
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, visible_location: newVisibility }
          : group
      )
    );
  };

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

  const handlePeopleChange = (event) => {
    setSelectedPeople(event.target.value);
  };

  const handleAddGroup = async () => {

    await axiosInstance.post('/groups', { name: groupName, users: selectedPeople });
    setOpenNewGroupModal(false);
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

      {/* Pierwszy Modal - Lista Grup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Groups</DialogTitle>
        <DialogContent>
          {groups.length > 0 ? (
            <List>
              {groups.map((group) => (
                <ListItem key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>{group.name}</Typography>
                  <Switch
                    checked={group.visible_location === 1}
                    color="primary"
                    onChange={() => handleToggleChange(group.id, group.visible_location)}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No groups available.</Typography>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <Fab color="primary" aria-label="add" onClick={handleOpenNewGroupModal}>
            <AddIcon />
          </Fab>
        </DialogActions>
      </Dialog>

      {/* Drugi Modal - Dodaj Nową Grupę */}
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
              renderValue={(selected) => {
                const selectedNames = people
                  .filter(person => selected.includes(person.id))
                  .map(person => person.username);
                return selectedNames.join(', ');
              }}
            >
              {people.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  <Checkbox checked={selectedPeople.indexOf(person.id) > -1} />
                  <ListItemText primary={person.username} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewGroupModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddGroup} color="primary">
            Add Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
