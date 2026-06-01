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
} from '@mui/material';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const steps = ['Shipping', 'Payment', 'Review'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    clearCart();
    navigate('/orders');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          🛒 Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {/* Step 1: Shipping */}
            {activeStep === 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    📦 Shipping Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {activeStep === 1 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    💳 Payment Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {activeStep === 2 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    ✅ Review Order
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Shipping To:</Typography>
                    <Typography variant="body2">{formData.name}</Typography>
                    <Typography variant="body2">{formData.address}, {formData.city}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Contact:</Typography>
                    <Typography variant="body2">{formData.email} | {formData.phone}</Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Subtotal: Rs.{getTotalPrice().toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>Shipping: Free</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>Tax (5%): Rs.{(getTotalPrice() * 0.05).toFixed(2)}</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Total: Rs.{(getTotalPrice() * 1.05).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;
