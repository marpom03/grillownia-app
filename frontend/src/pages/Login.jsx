import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Button, FormControlLabel, FormGroup, TextField } from '@mui/material';

export const Login = () => {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = () => {
    if (isAuthenticated) {
      logout()
    } else {
      login();
    }
    navigate('/home');
  };

  return (
    <FormGroup onSubmit={handleLogin}>
      <FormControlLabel control={<TextField label='Login'/>}/>
      <FormControlLabel control={<TextField label='Password' type='password'/>}/>
      <Button variant='contained' type='submit'>Submit</Button>
    </FormGroup>
  );
};
