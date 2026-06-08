import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent,
  TextField, Button, Alert, Link, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { sendOtpApi } from '../api/authApi';
import { validateEmail } from '../utils/validation';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtpApi(email);
      if (res.success) {
        // Pass email to verify-otp page via state
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server is waking up, please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8,37,87,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>
                🔑 Forgot Password
              </Typography>
              <Typography variant="body1" sx={{ color: '#556b8c' }}>
                Enter your registered email and we'll send you a 6-digit OTP.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Email Address" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                margin="normal" autoFocus required
                placeholder="Enter your registered email"
              />
              <Button
                fullWidth variant="contained" size="large" type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c', mt: 1 }}>
              Remember your password?{' '}
              <Link component="button" onClick={() => navigate('/login')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>
                Back to Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
