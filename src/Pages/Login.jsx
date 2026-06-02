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
import { validateEmail, validatePassword } from '../utils/validation';

const STORAGE_KEYS = {
  users: 'groceriaUsers',
  loginDraft: 'groceriaLoginDraft',
  currentUser: 'groceriaCurrentUser',
  loginHistory: 'groceriaLoginHistory',
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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEYS.loginDraft);
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.loginDraft);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.loginDraft, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter valid email';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain letter and number (min 6 chars)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    const matchedUser = registeredUsers.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password
    );

    if (!matchedUser) {
      setErrors({ email: 'Email or password is incorrect' });
      return;
    }

    const currentUser = {
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone,
      lastLoginAt: new Date().toISOString(),
    };

    const loginHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.loginHistory) || '[]');
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    localStorage.setItem(
      STORAGE_KEYS.loginHistory,
      JSON.stringify([
        ...loginHistory,
        { email: matchedUser.email, loginAt: currentUser.lastLoginAt },
      ])
    );
    localStorage.removeItem(STORAGE_KEYS.loginDraft);
    setMessage('Login successful! Redirecting...');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8, 37, 87, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 1, color: '#1976d2' }}>
              🔐 Login
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#556b8c', mb: 3 }}>
              Welcome back to Groceria
            </Typography>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
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
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c' }}>
              Don't have an account?{' '}
              <Link
                component="button"
                onClick={() => navigate('/signup')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign up here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
