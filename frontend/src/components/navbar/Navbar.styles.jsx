import theme from '../../theme';

export const appBarStyles = {
  width: '100%',
  position: 'fixed', 
  backgroundColor: theme.palette.primary.main,
  zIndex: theme.zIndex.appBar,
  height:'9vh'
};




export const toolbarStyles = {
  disableGutters: true,
  paddingLeft: { xs: 0, md: 2 },
  paddingRight: { xs: 0, md: 2 },
};

export const logoContainerStyles = {
  display: { xs: 'flex', md: 'none' },
  flexDirection: 'row',
  alignItems: 'center',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

export const logoTextStyles = {
  fontSize: '1.5rem',
  marginLeft: 1,
  color: 'inherit',
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.2rem',
};

export const desktopLogoContainerStyles = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
};

export const desktopLogoStyles = {
  fontSize: '3rem',
};

export const titleStyles = {
  mr: 12,
  display: { xs: 'none', md: 'flex' },
  fontFamily: 'monospace',
  letterSpacing: '.2rem',
  color: 'inherit',
  textDecoration: 'none',
};


