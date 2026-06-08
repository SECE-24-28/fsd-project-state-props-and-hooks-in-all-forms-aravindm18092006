import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, Badge,
  useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { clearAuthData, getStoredUser } from '../api/authApi';
import logo from '../image/Groceria logo.png';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'Admin', path: '/admin' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
];

const Navbar = () => {
  const { getTotalItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = getStoredUser();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    clearAuthData();
    setDrawerOpen(false);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="img" src={logo} alt="Groceria" sx={{ width: 32, height: 32, objectFit: 'contain' }} />
        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>Groceria</Typography>
      </Box>
      <Divider />

      {/* User info if logged in */}
      {isLoggedIn && (
        <>
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#f0f6ff' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2' }}>👤 {user.name}</Typography>
            <Typography variant="caption" sx={{ color: '#556b8c' }}>{user.email}</Typography>
            {user.role === 'admin' && (
              <Typography variant="caption" sx={{ display: 'block', color: '#2e7d32', fontWeight: 600 }}>Admin</Typography>
            )}
          </Box>
          <Divider />
        </>
      )}

      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {!isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/signup" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={3} sx={{ background: '#ffffff', borderBottom: '1px solid rgba(14, 79, 193, 0.1)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', minHeight: { xs: 64, md: 70 }, px: { xs: 1, md: 2 } }}>

          {/* Left — Menu icon + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
            >
              <MenuIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 0.5 }}>
              <Box component="img" src={logo} alt="Groceria logo" sx={{ width: { xs: 32, md: 42 }, height: { xs: 32, md: 42 }, objectFit: 'contain' }} />
              {!isMobile && (
                <Typography variant="h6" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  Groceria
                </Typography>
              )}
            </Box>
          </Box>

          {/* Center — Nav links (desktop only) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button key={item.path} component={RouterLink} to={item.path} color="inherit"
                  sx={{ color: '#12254a', fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right — Auth buttons + icons */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {!isMobile && (
              <>
                {!isLoggedIn ? (
                  <>
                    <Button component={RouterLink} to="/login" color="inherit" sx={{ color: '#12254a', fontSize: '0.9rem' }}>
                      Login
                    </Button>
                    <Button component={RouterLink} to="/signup" variant="contained" color="primary" sx={{ fontSize: '0.9rem' }}>
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <Button component={RouterLink} to="/profile" color="inherit" sx={{ color: '#12254a', fontSize: '0.9rem', fontWeight: 600 }}>
                      👤 {user.name.split(' ')[0]}
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<LogoutIcon />}
                      sx={{ fontSize: '0.85rem' }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </>
            )}
            <IconButton component={RouterLink} to="/wishlist" color="inherit" sx={{ p: { xs: 0.75, md: 1 } }}>
              <FavoriteIcon sx={{ color: '#0e4fc1', fontSize: { xs: 18, md: 24 } }} />
            </IconButton>
            <IconButton component={RouterLink} to="/cart" color="inherit" sx={{ p: { xs: 0.75, md: 1 } }}>
              <Badge badgeContent={getTotalItems()} color="secondary">
                <ShoppingCartIcon sx={{ color: '#0e4fc1', fontSize: { xs: 18, md: 24 } }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
