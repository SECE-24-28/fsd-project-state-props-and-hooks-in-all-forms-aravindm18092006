import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, TextField, Button } from '@mui/material';

const Contact = () => {
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
                <Box component="form">
                  <TextField fullWidth label="Name" margin="normal" />
                  <TextField fullWidth label="Email" margin="normal" />
                  <TextField fullWidth label="Subject" margin="normal" />
                  <TextField fullWidth label="Message" margin="normal" multiline rows={4} />
                  <Button variant="contained" sx={{ mt: 2 }}>
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
