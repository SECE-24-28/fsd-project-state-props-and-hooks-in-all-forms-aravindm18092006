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
import { loginUser, saveAuthData } from '../api/authApi';

const STORAGE_KEYS = {
  loginDraft: 'groceriaLoginDraft',
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
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');
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

    setLoading(true);
    try {
      const response = await loginUser(formData);

      if (response.success) {
        saveAuthData(response.data);
        localStorage.removeItem(STORAGE_KEYS.loginDraft);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setErrorMessage(response.message || 'Login failed');
      }
    } catch (error) {
      const apiMessage =
        error.response?.data?.message || 'Could not reach server. Please try again.';
      setErrorMessage(apiMessage);
    } finally {
      setLoading(false);
    }
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

            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
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
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Connecting...' : 'Login'}
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
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c', mt: 1 }}>
              <Link
                component="button"
                onClick={() => navigate('/forgot-password')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot your password?
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
