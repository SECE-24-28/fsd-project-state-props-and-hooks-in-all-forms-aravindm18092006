import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Card, CardContent,
  TextField, Button, Alert, Link, CircularProgress,
  InputAdornment, IconButton, LinearProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordWithOtpApi } from '../api/authApi';

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColor = ['', '#f44336', '#ff9800', '#2196f3', '#4caf50', '#1b5e20'];

const ResetPasswordOtp = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';
  const otp       = location.state?.otp   || '';

  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState(false);

  const strength = getStrength(password);

  useEffect(() => {
    if (!email || !otp) navigate('/forgot-password');
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) { setError('Password must contain at least one letter and one number.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtpApi(email, otp, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.message || 'Reset failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4, display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8,37,87,0.08)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '4rem', mb: 1 }}>✅</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>Password Reset Successful!</Typography>
              <Typography variant="body1" sx={{ color: '#556b8c', mb: 3 }}>Your password has been updated. Redirecting to login...</Typography>
              <CircularProgress size={24} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8,37,87,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>🔒 Reset Password</Typography>
              <Typography variant="body1" sx={{ color: '#556b8c' }}>Create a new strong password for your account.</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                margin="normal" required autoFocus
                helperText="Min 6 characters with letters and numbers"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {password.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate" value={(strength / 5) * 100}
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: strengthColor[strength] } }}
                  />
                  <Typography variant="caption" sx={{ color: strengthColor[strength], fontWeight: 600 }}>
                    {strengthLabel[strength]}
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth label="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal" required
                error={confirmPassword.length > 0 && password !== confirmPassword}
                helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Passwords do not match' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth variant="contained" size="large" type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockResetIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c' }}>
              <Link component="button" onClick={() => navigate('/forgot-password')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>
                Request a new OTP
              </Link>
              {' · '}
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

export default ResetPasswordOtp;
