import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../image/Groceria logo.png';

const Footer = () => {

  return (
    <Box component="footer" sx={{ background: '#ffffff', py: { xs: 3, md: 5 }, mt: 8, borderTop: '1px solid rgba(14, 79, 193, 0.12)' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src={logo} alt="Groceria logo" sx={{ width: { xs: 32, md: 38 }, height: { xs: 32, md: 38 }, objectFit: 'contain' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0e4fc1', fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Groceria
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 3 }, flexWrap: 'wrap', justifyContent: 'center', fontSize: { xs: '0.85rem', md: '1rem' } }}>
          <Link component={RouterLink} to="/about" underline="hover" color="text.secondary">
            About
          </Link>
          <Link component={RouterLink} to="/contact" underline="hover" color="text.secondary">
            Contact
          </Link>
          <Link component={RouterLink} to="/faq" underline="hover" color="text.secondary">
            FAQ
          </Link>
          <Link component={RouterLink} to="/profile" underline="hover" color="text.secondary">
            Profile
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
          © {new Date().getFullYear()} Groceria. Fresh groceries delivered to your door.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
