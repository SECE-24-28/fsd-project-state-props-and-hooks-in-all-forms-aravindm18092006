import React, { useEffect, useState } from 'react';
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

const STORAGE_KEYS = {
  users: 'groceriaUsers',
  signupDraft: 'groceriaSignupDraft',
};

const FormInput = ({ label, name, type = 'text', value, onChange, error, helperText }) => (
  <TextField
    fullWidth
    label={label}
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    margin="normal"
  />
);

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

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEYS.signupDraft);
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.signupDraft);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.signupDraft, JSON.stringify(formData));
  }, [formData]);

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

    const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    const userExists = registeredUsers.some(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (userExists) {
      setErrors({ email: 'This email is already registered' });
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      STORAGE_KEYS.users,
      JSON.stringify([...registeredUsers, newUser])
    );
    localStorage.removeItem(STORAGE_KEYS.signupDraft);
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
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
