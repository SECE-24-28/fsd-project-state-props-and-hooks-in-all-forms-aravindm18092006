import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Orders = () => {
  const orders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      total: 450,
      status: 'Delivered',
      items: 'Red Apples, Broccoli, Fresh Milk',
    },
    {
      id: 'ORD002',
      date: '2024-01-12',
      total: 680,
      status: 'In Transit',
      items: 'Chicken Breast, Whole Wheat Bread, Orange Juice',
    },
    {
      id: 'ORD003',
      date: '2024-01-08',
      total: 320,
      status: 'Processing',
      items: 'Bananas, Carrots, Yogurt',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'In Transit':
        return 'info';
      case 'Processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const orderTracking = [
    {
      date: 'Jan 15, 2024',
      title: '✅ Delivered',
      description: 'Your order has been delivered.',
      icon: <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />,
    },
    {
      date: 'Jan 14, 2024',
      title: '🚚 Out for Delivery',
      description: 'Your order is on its way.',
      icon: <LocalShippingIcon sx={{ color: '#2196f3', mr: 1 }} />,
    },
    {
      date: 'Jan 13, 2024',
      title: '📦 Order Confirmed',
      description: 'Your order has been confirmed.',
      icon: <ShoppingBagIcon sx={{ color: '#ff9800', mr: 1 }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>
          📦 My Orders
        </Typography>

        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#556b8c' }}>
                          Order ID
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {order.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#556b8c' }}>
                          Order Date
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {new Date(order.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#556b8c' }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Rs.{order.total}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ color: '#556b8c', mb: 1 }}>
                        Items: {order.items}
                      </Typography>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        variant="filled"
                        sx={{ mr: 2, mb: 2 }}
                      />
                      <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                        Track Order
                      </Button>
                      <Button variant="outlined" size="small">
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: 600 }}>
          Latest Order Status
        </Typography>
        <Grid container spacing={3}>
          {orderTracking.map((step) => (
            <Grid item xs={12} md={4} key={step.date}>
              <Card sx={{ minHeight: 160 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {step.icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {step.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {step.date}
                  </Typography>
                  <Typography>{step.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Orders;
