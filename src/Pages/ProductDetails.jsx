import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = {
    id,
    name: 'Red Apples',
    price: 89,
    oldPrice: 110,
    weight: '1 kg pack',
    emoji: '🍎',
    label: 'Fresh',
    description:
      'Fresh and juicy red apples sourced from the finest organic farms. Perfect for snacking and baking.',
    features: ['Farm fresh', 'No added preservatives', 'Rich in vitamins and fiber'],
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back to Products
        </Button>
        <Card>
          <CardContent>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    background: '#f0f7ff',
                    height: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '6rem',
                    borderRadius: 3,
                  }}
                >
                  {product.emoji}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  {product.name}
                </Typography>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>
                  Rs.{product.price} {' '}
                  <Typography component="span" sx={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem' }}>
                    Rs.{product.oldPrice}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#556b8c', mb: 3 }}>
                  {product.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {product.features.map((feature, idx) => (
                    <Typography key={idx} sx={{ mb: 1, display: 'flex', gap: 1 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate('/cart')}>
                    Go to Cart
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProductDetails;
