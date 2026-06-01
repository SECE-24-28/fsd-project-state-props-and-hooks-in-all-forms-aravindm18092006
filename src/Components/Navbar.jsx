import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import logo from '../image/Groceria logo.png';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
];

const Navbar = () => {
  const { getTotalItems } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="sticky" color="inherit" elevation={3} sx={{ background: '#ffffff', borderBottom: '1px solid rgba(14, 79, 193, 0.1)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', minHeight: { xs: 64, md: 70 }, px: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
          >
            <MenuIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 0.5 }}>
            <Box component="img" src={logo} alt="Groceria logo" sx={{ width: { xs: 32, md: 42 }, height: { xs: 32, md: 42 }, objectFit: 'contain' }} />
            {!isMobile && (
              <Typography
                variant="h6"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Groceria
              </Typography>
            )}
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit"
                sx={{ color: '#12254a', fontWeight: 600, fontSize: '0.95rem' }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {!isMobile && (
            <Button component={RouterLink} to="/login" color="inherit" sx={{ color: '#12254a', fontSize: '0.9rem' }}>
              Login
            </Button>
          )}
          {!isMobile && (
            <Button component={RouterLink} to="/signup" variant="contained" color="primary" sx={{ fontSize: '0.9rem' }}>
              Sign Up
            </Button>
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
  );
};

export default Navbar;
