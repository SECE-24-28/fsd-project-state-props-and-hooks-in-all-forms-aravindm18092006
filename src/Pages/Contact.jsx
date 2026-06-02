import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material';

const Contact = () => {
  const STORAGE_KEYS = {
    contactDraft: 'groceriaContactDraft',
    contactMessages: 'groceriaContactMessages',
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const ContactInput = ({ label, name, multiline = false, rows = 1 }) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={formData[name]}
      onChange={handleInputChange}
      margin="normal"
      multiline={multiline}
      rows={rows}
    />
  );

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEYS.contactDraft);
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.contactDraft);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.contactDraft, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.contactMessages) || '[]');
    const payload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.contactMessages, JSON.stringify([...allMessages, payload]));
    localStorage.removeItem(STORAGE_KEYS.contactDraft);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setSuccessMessage('Your message has been saved. We will contact you soon.');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          📞 Contact Us
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Get in touch
                </Typography>
                <Typography sx={{ mb: 1, color: '#556b8c' }}>
                  Email: support@groceria.com
                </Typography>
                <Typography sx={{ mb: 1, color: '#556b8c' }}>
                  Phone: +91 98765 43210
                </Typography>
                <Typography sx={{ mb: 1, color: '#556b8c' }}>
                  Address: 123 Grocery Lane, Food City
                </Typography>
                <Typography sx={{ mt: 3, color: '#556b8c' }}>
                  Our customer support team is available 24/7 for order assistance, returns and general inquiries.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Send us a message
                </Typography>
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                  <ContactInput label="Name" name="name" />
                  <ContactInput label="Email" name="email" />
                  <ContactInput label="Subject" name="subject" />
                  <ContactInput label="Message" name="message" multiline rows={4} />
                  <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Send Message
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
