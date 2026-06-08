import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Typography, Card, CardContent,
  Button, Alert, Link, CircularProgress, TextField,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtpApi, sendOtpApi } from '../api/authApi';

const VerifyOtp = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';

  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [timer, setTimer]       = useState(600); // 10 minutes in seconds
  const inputRefs               = useRef([]);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = () => {
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtpApi(email, otpValue);
      if (res.success) {
        navigate('/reset-password-otp', { state: { email, otp: otpValue } });
      } else {
        setError(res.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      const res = await sendOtpApi(email);
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        setTimer(600);
        setSuccess('A new OTP has been sent to your email.');
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 22px 40px rgba(8,37,87,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography sx={{ fontSize: '3.5rem' }}>📧</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                Enter OTP
              </Typography>
              <Typography variant="body1" sx={{ color: '#556b8c' }}>
                We sent a 6-digit OTP to
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#12254a' }}>
                {email}
              </Typography>
            </Box>

            {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

            {/* OTP Input Boxes */}
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }} onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <TextField
                  key={idx}
                  inputRef={(el) => (inputRefs.current[idx] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, padding: '12px 0' } }}
                  sx={{ width: 52 }}
                />
              ))}
            </Box>

            {/* Timer */}
            <Typography variant="body2" sx={{ textAlign: 'center', color: timer > 0 ? '#556b8c' : '#f44336', mb: 2 }}>
              {timer > 0 ? `OTP expires in ${formatTimer()}` : 'OTP has expired'}
            </Typography>

            <Button
              fullWidth variant="contained" size="large"
              onClick={handleVerify} disabled={loading || otp.join('').length !== 6}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify OTP'}
            </Button>

            {/* Resend */}
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c' }}>
              Didn't receive it?{' '}
              <Link
                component="button"
                onClick={handleResend}
                disabled={resending}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </Link>
            </Typography>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#556b8c', mt: 1 }}>
              <Link component="button" onClick={() => navigate('/forgot-password')}
                sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>
                Change Email
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

export default VerifyOtp;
