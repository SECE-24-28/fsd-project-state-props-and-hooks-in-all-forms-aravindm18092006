import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid,
  TextField, Button, Alert, CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { sendContactForm } from '../api/contactApi';

const DRAFT_KEY = 'groceriaContactDraft';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Restore draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setFormData(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Save draft on change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendContactForm(formData);
      // Save locally for admin panel regardless of email status
      const all = JSON.parse(localStorage.getItem('groceriaContactMessages') || '[]');
      localStorage.setItem('groceriaContactMessages', JSON.stringify([
        ...all,
        { ...formData, createdAt: new Date().toISOString() },
      ]));
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (res.success) {
        setSuccessMessage('✅ Your message has been sent! We\'ll get back to you within 24 hours.');
      } else {
        // Mail delivery failed but message is saved
        setSuccessMessage('✅ Your message has been received. We\'ll contact you soon at ' + formData.email);
      }
    } catch (err) {
      // Backend unreachable — save locally
      const all = JSON.parse(localStorage.getItem('groceriaContactMessages') || '[]');
      localStorage.setItem('groceriaContactMessages', JSON.stringify([
        ...all,
        { ...formData, createdAt: new Date().toISOString() },
      ]));
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSuccessMessage('✅ Your message has been saved. We will contact you soon at ' + formData.email);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <EmailIcon sx={{ color: '#1976d2' }} />, label: 'Email', value: 'groceriasupport@gmail.com', href: 'mailto:groceriasupport@gmail.com' },
    { icon: <PhoneIcon sx={{ color: '#1976d2' }} />, label: 'Phone', value: '+91 90804 25338', href: 'tel:+919080425338' },
    { icon: <LocationOnIcon sx={{ color: '#1976d2' }} />, label: 'Address', value: 'SECE Campus, Coimbatore - 641202' },
    { icon: <AccessTimeIcon sx={{ color: '#1976d2' }} />, label: 'Support Hours', value: '24/7 Customer Support' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>📞 Contact Us</Typography>
          <Typography variant="body1" sx={{ color: '#556b8c', maxWidth: 500, mx: 'auto' }}>
            Have a question or need help? Our team is here for you — reach out anytime.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1976d2' }}>
                  Get in Touch
                </Typography>

                {contactInfo.map((info, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Box sx={{ mt: 0.3 }}>{info.icon}</Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#12254a' }}>
                        {info.label}
                      </Typography>
                      {info.href ? (
                        <Typography
                          component="a"
                          href={info.href}
                          variant="body2"
                          sx={{ color: '#556b8c', textDecoration: 'none', '&:hover': { color: '#1976d2' } }}
                        >
                          {info.value}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#556b8c' }}>{info.value}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}

                <Box sx={{
                  mt: 4, p: 2.5, background: 'linear-gradient(135deg,#eef6ff,#dbeafe)',
                  borderRadius: 2, border: '1px solid #bfdbfe',
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5 }}>
                    🚀 Quick Response Guarantee
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#556b8c' }}>
                    We respond to all queries within 24 hours. For urgent issues, call us directly.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Send us a Message
                </Typography>

                {successMessage && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Your Name" name="name"
                        value={formData.name} onChange={handleInputChange} required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Email Address" name="email" type="email"
                        value={formData.email} onChange={handleInputChange} required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Subject" name="subject"
                        value={formData.subject} onChange={handleInputChange} required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth label="Message" name="message"
                        value={formData.message} onChange={handleInputChange}
                        multiline rows={5} required
                        placeholder="Tell us how we can help you..."
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3, minWidth: 160 }}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
