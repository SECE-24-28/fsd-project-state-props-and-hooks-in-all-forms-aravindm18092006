import React from 'react';
import { Card, CardContent, Box, Typography, Button, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          background: '#f0f7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 140,
          fontSize: '4rem',
          position: 'relative',
        }}
      >
        {product.emoji}
        {product.label && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'primary.main',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {product.label}
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#556b8c', mb: 2 }}>
          {product.weight}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Rs.{product.price}
          {product.oldPrice && (
            <Typography component="span" sx={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem', ml: 1 }}>
              Rs.{product.oldPrice}
            </Typography>
          )}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button variant="outlined" component={RouterLink} to={`/product/${product.id}`}>
          View
        </Button>
        <Button variant="contained" onClick={() => onAddToCart(product)}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
