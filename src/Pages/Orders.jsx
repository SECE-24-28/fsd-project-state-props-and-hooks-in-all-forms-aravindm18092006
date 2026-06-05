import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid,
  Chip, Button, CircularProgress, Alert, Collapse, Divider, Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders, cancelOrderApi } from '../api/orderApi';
import { getStoredUser } from '../api/authApi';

const statusConfig = {
  pending:    { color: 'warning', icon: <PendingIcon />,       label: 'Pending' },
  processing: { color: 'info',    icon: <ShoppingBagIcon />,   label: 'Processing' },
  shipped:    { color: 'primary', icon: <LocalShippingIcon />, label: 'Shipped' },
  delivered:  { color: 'success', icon: <CheckCircleIcon />,   label: 'Delivered' },
  cancelled:  { color: 'error',   icon: <CancelIcon />,        label: 'Cancelled' },
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [cancelling, setCancelling] = useState('');
  const [snack, setSnack]         = useState({ open: false, message: '', severity: 'success' });
  const user = getStoredUser();

  const loadOrders = async () => {
    try {
      const res = await fetchMyOrders();
      if (res.success) setOrders(res.data);
      else setError(res.message || 'Failed to load orders');
    } catch {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(orderId);
    try {
      const res = await cancelOrderApi(orderId);
      if (res.success) {
        setSnack({ open: true, message: 'Order cancelled successfully', severity: 'success' });
        loadOrders();
      } else {
        setSnack({ open: true, message: res.message || 'Could not cancel order', severity: 'error' });
      }
    } catch (e) {
      setSnack({ open: true, message: e.response?.data?.message || 'Error cancelling order', severity: 'error' });
    } finally {
      setCancelling('');
    }
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>📦 My Orders</Typography>
            <Typography sx={{ color: '#556b8c', mb: 3 }}>Please log in to view your order history.</Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600 }}>📦 My Orders</Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {!loading && orders.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#556b8c', mb: 3 }}>You haven't placed any orders yet.</Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/products')}>Start Shopping</Button>
          </Box>
        )}

        <Grid container spacing={3}>
          {orders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const isExpanded = expandedId === order._id;
            const canCancel = ['pending', 'processing'].includes(order.status);

            return (
              <Grid item xs={12} key={order._id}>
                <Card sx={{ border: order.status === 'cancelled' ? '1px solid #ffcdd2' : undefined }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      {/* Order ID */}
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: '#556b8c', fontSize: '0.75rem' }}>ORDER ID</Typography>
                        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </Typography>
                      </Grid>

                      {/* Date */}
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: '#556b8c', fontSize: '0.75rem' }}>DATE</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Typography>
                      </Grid>

                      {/* Total */}
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: '#556b8c', fontSize: '0.75rem' }}>TOTAL</Typography>
                        <Typography sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1rem' }}>
                          Rs.{order.totalPrice?.toFixed(2)}
                        </Typography>
                      </Grid>

                      {/* Status + Actions */}
                      <Grid item xs={6} sm={3}>
                        <Chip icon={sc.icon} label={sc.label} color={sc.color} size="small" sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button size="small" variant="outlined"
                            onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                            {isExpanded ? 'Hide' : 'Details'}
                          </Button>
                          {canCancel && (
                            <Button size="small" variant="outlined" color="error"
                              onClick={() => handleCancel(order._id)}
                              disabled={cancelling === order._id}>
                              {cancelling === order._id ? '...' : 'Cancel'}
                            </Button>
                          )}
                        </Box>
                      </Grid>

                      {/* Expanded Details */}
                      <Grid item xs={12}>
                        <Collapse in={isExpanded}>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={3}>
                            {/* Items & Pricing */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>🛍️ Items Ordered</Typography>
                              {(order.orderItems || []).map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Rs.{(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                </Box>
                              ))}
                              <Divider sx={{ my: 1 }} />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Subtotal</Typography>
                                <Typography variant="body2">Rs.{order.itemsPrice?.toFixed(2)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Tax (5%)</Typography>
                                <Typography variant="body2">Rs.{order.taxPrice?.toFixed(2)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Total</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                  Rs.{order.totalPrice?.toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ mt: 1, color: '#556b8c' }}>
                                Payment: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
                              </Typography>
                            </Grid>

                            {/* Shipping + Tracking */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>📍 Shipping Address</Typography>
                              {order.shippingAddress && (
                                <Typography variant="body2" sx={{ color: '#556b8c', lineHeight: 1.9 }}>
                                  {order.shippingAddress.fullName}<br />
                                  {order.shippingAddress.address}<br />
                                  {order.shippingAddress.city}{order.shippingAddress.postalCode ? ` — ${order.shippingAddress.postalCode}` : ''}<br />
                                  {order.shippingAddress.phone && `📞 ${order.shippingAddress.phone}`}
                                </Typography>
                              )}

                              <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>📋 Tracking</Typography>
                              {(order.trackingHistory || []).map((t, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
                                  <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, textTransform: 'capitalize', minWidth: 90, flexShrink: 0 }}>
                                    {t.status}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#556b8c' }}>
                                    {t.message} · {new Date(t.timestamp).toLocaleString('en-IN')}
                                  </Typography>
                                </Box>
                              ))}
                            </Grid>
                          </Grid>
                        </Collapse>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Snackbar
        open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
