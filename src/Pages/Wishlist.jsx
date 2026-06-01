import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const navigate = useNavigate();
  const wishlist = [
    { id: 1, name: 'Strawberries', price: 129, emoji: '🍓', note: 'Add when in season' },
    { id: 2, name: 'Almond Milk', price: 119, emoji: '🥛', note: 'Favorite non-dairy option' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          💖 Wishlist
        </Typography>

        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ fontSize: '4rem' }}>{item.emoji}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#556b8c', mb: 1 }}>
                      {item.note}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Rs.{item.price}
                    </Typography>
                  </Box>
                  <Button variant="contained" onClick={() => navigate('/cart')}>
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Wishlist;
