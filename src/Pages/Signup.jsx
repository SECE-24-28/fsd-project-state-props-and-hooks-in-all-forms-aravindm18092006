import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} from '../utils/validation';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Enter minimum 3 letters';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter valid email';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain letter and number (min 6 chars)';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMessage('Registration successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8, 37, 87, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 1, color: '#1976d2' }}>
              📝 Sign Up
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#556b8c', mb: 3 }}>
              Join Groceria for fresh groceries!
            </Typography>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="normal"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c' }}>
              Already have an account?{' '}
              <Link
                component="button"
                onClick={() => navigate('/login')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
              >
                Login here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Signup;
