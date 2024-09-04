import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';


export const Register = () => {
  const navigate = useNavigate();
  const { user, login, logout, loading, register } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: '',
    password1: '',
    password2: '',
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

    if (formData.password1 !== formData.password2) {
      setError("Passwords are not matching!")
    } else {
      try {
        await register(formData.username, formData.password1);
        navigate('/login')
      } catch (err) {
        console.log(err.message)
        setError(err.message)
      }
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
          variant="outlined"
          name='password1'
          value={formData.password1}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
                <TextField
          label="Repeat Password"
          type="password"
          variant="outlined"
          name='password2'
          value={formData.password2}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
        <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>
          Zarejestruj się
        </Button>
      </Box>


      <Typography variant="body2" sx={{ mt: 3,textAlign:'center' }}>
        Masz już konto?{' '}
        <Link href="/login" sx={{ color: '#1DB954', textDecoration: 'none' }}>
          Zaloguj się
        </Link>
      </Typography>
    </Box>
  );
};
