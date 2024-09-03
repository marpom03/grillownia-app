import React from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
export const Register = () => {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
    navigate('/home');
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
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
  
        }}
      >
        <TextField
          label="Login"
          variant="outlined"
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
                <TextField
          label="Repeat Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2      ,   backgroundColor:'white',}}
        />
        <Button variant="contained" type="submit" sx={{ width: '100%', mt: 2 }}>
          Zarejestruj się
        </Button>
      </Box>

      {/* Przekierowanie "Nie mam konta" */}
      <Typography variant="body2" sx={{ mt: 3,textAlign:'center' }}>
        Masz już konto?{' '}
        <Link href="/login" sx={{ color: '#1DB954', textDecoration: 'none' }}>
          Zaloguj się
        </Link>
      </Typography>
    </Box>
  );
};
