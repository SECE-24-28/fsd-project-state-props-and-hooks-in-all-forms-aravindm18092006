import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
              🛒 Your Cart is Empty
            </Typography>
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
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          🛒 Shopping Cart
        </Typography>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: '#f0f7ff' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography sx={{ fontSize: '2rem' }}>{item.emoji}</Typography>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                            <Typography variant="body2" sx={{ color: '#556b8c' }}>
                              {item.weight}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">Rs.{item.price}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          startIcon={<DeleteIcon />}
                          color="error"
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>Rs.{getTotalPrice().toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping:</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#4caf50' }}>Free</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>Rs.{(getTotalPrice() * 0.05).toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    Rs.{(getTotalPrice() * 1.05).toFixed(2)}
                  </Typography>
                </Box>

                <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')} sx={{ mb: 2 }}>
                  Proceed to Checkout
                </Button>
                <Button fullWidth variant="outlined" onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
                <Button fullWidth variant="text" color="error" onClick={clearCart} sx={{ mt: 1 }}>
                  Clear Cart
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
