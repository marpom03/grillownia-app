import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  appBarStyles,
  toolbarStyles,
  logoContainerStyles,
  logoTextStyles,
  desktopLogoContainerStyles,
  desktopLogoStyles,
  titleStyles,
} from './Navbar.styles';
import { useAuth } from '../../services/AuthContext';

function Navbar() {
  const { user, logout } = useAuth()

  const handleOpenNavMenu = (event) => {
    console.log(user)
    setAnchorElNav(event.currentTarget);
  };

  const handleLogout = async () => {

    await logout()
  };

  return (
    <AppBar sx={appBarStyles}>
      <Container maxWidth={false}>
        <Toolbar sx={toolbarStyles}>
          <Box sx={desktopLogoContainerStyles}>
            <OutdoorGrillIcon sx={desktopLogoStyles} />
            <Typography variant="h6" noWrap href="/" sx={titleStyles}>
              GrillowniaApp
            </Typography>
          </Box>

          <Box sx={logoContainerStyles} onClick={handleOpenNavMenu}>
            <OutdoorGrillIcon sx={{ fontSize: '2rem' }} />
            <Typography sx={logoTextStyles}>GrillowniaApp</Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginLeft: 'auto', 
              cursor: 'pointer',
            }} 
            onClick={handleLogout} 
          >
            <ExitToAppIcon sx={{ fontSize: '1.5rem' }} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
