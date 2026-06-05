import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { placeOrderApi } from '../api/orderApi';
import { getStoredUser } from '../api/authApi';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipcode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const steps = ['Shipping', 'Payment', 'Review'];
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (!formData.name.trim()) return 'Full name is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.address.trim()) return 'Address is required.';
    if (!formData.city.trim()) return 'City is required.';
    return '';
  };

  const handleNext = () => {
    setError('');
    if (activeStep === 0) {
      const err = validateShipping();
      if (err) { setError(err); return; }
    }
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderItems = cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipcode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: 0,
        totalPrice: total,
      };

      if (user) {
        const res = await placeOrderApi(orderData);
        if (res.success) {
          clearCart();
          navigate('/orders');
        } else {
          setError(res.message || 'Failed to place order.');
        }
      } else {
        // Guest: just clear cart and go to orders page
        clearCart();
        alert('Order placed successfully! (Guest checkout — log in to track orders)');
        navigate('/');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && activeStep === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>🛒 Cart is Empty</Typography>
            <Typography sx={{ color: '#556b8c', mb: 3 }}>Add items before checking out.</Typography>
            <Button variant="contained" onClick={() => navigate('/products')}>Shop Now</Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>🛒 Checkout</Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Step 0: Shipping */}
            {activeStep === 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>📦 Shipping Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Street Address" name="address" value={formData.address} onChange={handleInputChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Zip / PIN Code" name="zipcode" value={formData.zipcode} onChange={handleInputChange} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Payment */}
            {activeStep === 1 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>💳 Payment Method</Typography>
                  <FormControl>
                    <FormLabel>Choose payment method</FormLabel>
                    <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                      <FormControlLabel value="cod" control={<Radio />} label="💵 Cash on Delivery" />
                      <FormControlLabel value="card" control={<Radio />} label="💳 Credit / Debit Card" />
                      <FormControlLabel value="upi" control={<Radio />} label="📱 UPI" />
                    </RadioGroup>
                  </FormControl>

                  {formData.paymentMethod === 'card' && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Card Number" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Expiry Date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="CVV" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" type="password" />
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Review */}
            {activeStep === 2 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>✅ Review Your Order</Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Shipping To:</Typography>
                  <Typography variant="body2" sx={{ color: '#556b8c', mb: 2 }}>
                    {formData.name} · {formData.phone}<br />
                    {formData.address}, {formData.city} {formData.zipcode}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Payment:</Typography>
                  <Typography variant="body2" sx={{ color: '#556b8c', mb: 2, textTransform: 'capitalize' }}>
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod.toUpperCase()}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Order Items:</Typography>
                  {cart.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs.{(item.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Order Summary sidebar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Summary</Typography>
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal ({cart.reduce((t, i) => t + i.quantity, 0)} items)</Typography>
                    <Typography sx={{ fontWeight: 600 }}>Rs.{subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#4caf50' }}>Free</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax (5%)</Typography>
                    <Typography sx={{ fontWeight: 600 }}>Rs.{tax.toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>Rs.{total.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Button variant="contained" size="large" onClick={handleNext} disabled={loading}>
                    {loading ? 'Placing Order...' : activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                  </Button>
                  {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack} disabled={loading}>Back</Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
