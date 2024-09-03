import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
export const Login = () => {
  const navigate = useNavigate();
  const { user, login, logout, loading } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here, you would typically call your login function with formData
    // console.log(formData);
    try {
      await login(formData.username, formData.password);
      navigate('/')
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    }
  };

  return (
    <Box
      sx={{
        top:0,
        left:0,
position:'absolute',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 3,
        boxSizing: 'border-box',
      }}
    >
    
    <Typography variant='h4' sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
  <OutdoorGrillIcon sx={{ fontSize: '1.5em', mr: 1 }} />
  GrillowniaApp
</Typography>
      {/* Formularz logowania */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
  
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          name='username'
          value={formData.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
        <TextField
          label="Password"
          type="password"
          name='password'
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
        <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>
          Zaloguj się
        </Button>
      </Box>

      {/* Przekierowanie "Nie mam konta" */}
      <Typography variant="body2" sx={{ mt: 3,textAlign:'center' }}>
        Nie masz konta?{' '}
        <Link href="/register" sx={{ color: '#1DB954', textDecoration: 'none' }}>
          Zarejestruj się
        </Link>
      </Typography>
    </Box>
  );
};
