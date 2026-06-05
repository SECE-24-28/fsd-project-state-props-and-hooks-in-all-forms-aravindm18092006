import React from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid,
  Button, IconButton, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: '#c5d8f6', mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>Your Cart is Empty</Typography>
            <Typography variant="body1" sx={{ color: '#556b8c', mb: 4 }}>
              Add some fresh groceries to get started!
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>🛒 Shopping Cart</Typography>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                {cart.map((item, idx) => (
                  <Box key={item.id || item._id}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2 }}>
                      {/* Product image */}
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        onClick={() => navigate(`/product/${item.id || item._id}`)}
                        sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', flexShrink: 0 }}
                      />

                      {/* Name & weight */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#1976d2' }, fontSize: { xs: '0.9rem', md: '1rem' } }}
                          onClick={() => navigate(`/product/${item.id || item._id}`)}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#556b8c' }}>{item.weight}</Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                          Rs.{item.price}
                        </Typography>
                      </Box>

                      {/* Quantity controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                          sx={{ border: '1px solid #1976d2', color: '#1976d2', p: 0.5 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                          sx={{ border: '1px solid #1976d2', color: '#1976d2', p: 0.5 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Line total */}
                      <Typography sx={{ fontWeight: 700, minWidth: 72, textAlign: 'right', flexShrink: 0 }}>
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </Typography>

                      {/* Remove */}
                      <IconButton
                        size="small" color="error"
                        onClick={() => removeFromCart(item.id || item._id)}
                        sx={{ flexShrink: 0 }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                    {idx < cart.length - 1 && <Divider />}
                  </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="text" color="error" size="small" onClick={clearCart}>
                    🗑️ Clear Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 80 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography>Subtotal ({cart.reduce((t, i) => t + i.quantity, 0)} items)</Typography>
                  <Typography sx={{ fontWeight: 600 }}>Rs.{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography>Shipping</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#4caf50' }}>Free</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography>Tax (5%)</Typography>
                  <Typography sx={{ fontWeight: 600 }}>Rs.{tax.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    Rs.{total.toFixed(2)}
                  </Typography>
                </Box>

                <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')} sx={{ mb: 1.5 }}>
                  Proceed to Checkout
                </Button>
                <Button fullWidth variant="outlined" onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;
