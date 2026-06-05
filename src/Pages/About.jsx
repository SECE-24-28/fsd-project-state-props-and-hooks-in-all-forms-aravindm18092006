import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Avatar } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Hero */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
            color: 'white',
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            mb: 6,
            boxShadow: '0 18px 36px rgba(8, 37, 87, 0.14)',
          }}
        >
          <Typography variant="h2" sx={{ mb: 1 }}>
            ℹ️ About Us
          </Typography>
          <Typography variant="h6">
            Learn more about Groceria and our mission
          </Typography>
        </Box>

        {/* About Content */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#556b8c' }}>
                  At Groceria, we believe that everyone deserves access to fresh, high-quality groceries at affordable prices. 
                  Our mission is to make grocery shopping convenient, affordable, and accessible to everyone.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Why Choose Us?
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#556b8c' }}>
                  ✅ 100% Fresh Products directly from farms<br/>
                  ✅ Same-day delivery in 2-4 hours<br/>
                  ✅ Competitive pricing with regular discounts<br/>
                  ✅ Secure and easy payment options<br/>
                  ✅ 24/7 Customer support
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
            Our Team
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: 'Aravind M', role: 'Founder & CEO' },
              { name: 'Mehanathan', role: 'CTO' },
              { name: 'Operations Team', role: 'Operations Head' }
            ].map((member, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#1976d2' }}>
                      👤
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#556b8c' }}>
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats */}
        <Grid container spacing={3}>
          {[
            { number: '50K+', label: 'Happy Customers' },
            { number: '500+', label: 'Products Available' },
            { number: '100%', label: 'Fresh Guarantee' },
            { number: '24/7', label: 'Customer Support' },
          ].map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Box sx={{ textAlign: 'center', p: 3, background: 'white', borderRadius: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ color: '#556b8c' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
