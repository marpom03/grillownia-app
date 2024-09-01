import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { router } from './Router';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </Typography>
      </Box>
    </Container>
  );
}
