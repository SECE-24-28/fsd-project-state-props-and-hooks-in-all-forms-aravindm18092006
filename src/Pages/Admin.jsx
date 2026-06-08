import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, Divider,
  Button, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Chip, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminGetUsers, adminUpdateUserRole, adminDeleteUser, getStoredUser } from '../api/authApi';
import { fetchProducts, createProduct, updateProduct, deleteProduct, seedProducts } from '../api/productApi';
import { fetchAllOrders, updateOrderStatusApi } from '../api/orderApi';
import { DEFAULT_PRODUCTS } from '../utils/defaultProducts';

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', oldPrice: '', weight: '',
    category: 'fruits', image: '', description: '', stock: '100',
  });

  useEffect(() => {
    const activeUser = getStoredUser();
    if (!activeUser || activeUser.role !== 'admin') {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
      fetchUsers();
      loadProducts();
      loadOrders();
      loadContactMessages();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminGetUsers();
      if (response.success) setUsers(response.data);
    } catch (err) {
      setErrorMessage('Failed to load users from API.');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      setErrorMessage('Could not load products from server.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetchAllOrders();
      if (res.success) setOrders(res.data);
    } catch (err) {
      // orders endpoint may fail if no orders yet
    }
  };

  const loadContactMessages = () => {
    try {
      const saved = localStorage.getItem('groceriaContactMessages');
      setMessages(saved ? JSON.parse(saved) : []);
    } catch (e) { setMessages([]); }
  };

  // User handlers
  const handleToggleRole = async (userId, currentRole) => {
    setStatusMessage(''); setErrorMessage('');
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const response = await adminUpdateUserRole(userId, newRole);
      if (response.success) { setStatusMessage('User role updated.'); fetchUsers(); }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error updating role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setStatusMessage(''); setErrorMessage('');
    try {
      const response = await adminDeleteUser(userId);
      if (response.success) { setStatusMessage('User deleted.'); fetchUsers(); }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error deleting user.');
    }
  };

  // Product handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', oldPrice: '', weight: '', category: 'fruits', image: '', description: '', stock: '100' });
    setOpenProductDialog(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name, price: prod.price, oldPrice: prod.oldPrice || '',
      weight: prod.weight, category: prod.category, image: prod.image,
      description: prod.description || '', stock: prod.stock || 100,
    });
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Remove this product from catalog?')) return;
    try {
      await deleteProduct(prodId);
      setStatusMessage('Product removed.');
      loadProducts();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error deleting product.');
    }
  };

  const handleSaveProductForm = async () => {
    if (!productForm.name || !productForm.price || !productForm.weight) {
      alert('Name, Price, and Weight are required.');
      return;
    }
    const payload = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      oldPrice: productForm.oldPrice ? parseFloat(productForm.oldPrice) : 0,
      weight: productForm.weight,
      category: productForm.category,
      description: productForm.description || '',
      image: productForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      stock: parseInt(productForm.stock) || 100,
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        setStatusMessage('Product updated.');
      } else {
        await createProduct(payload);
        setStatusMessage('Product added.');
      }
      loadProducts();
      setOpenProductDialog(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error saving product.');
    }
  };

  const handleSeedProducts = async () => {
    if (!window.confirm('This will replace all products in the database with the default catalog. Continue?')) return;
    try {
      const res = await seedProducts(DEFAULT_PRODUCTS);
      if (res.success) { setStatusMessage(`${res.data.length} products seeded from default catalog.`); loadProducts(); }
    } catch (err) {
      setErrorMessage('Failed to seed products.');
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatusApi(orderId, status);
      setStatusMessage(`Order status updated to ${status}.`);
      loadOrders();
    } catch (err) {
      setErrorMessage('Failed to update order status.');
    }
  };

  const handleManageOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  const handleClearMessages = () => {
    localStorage.removeItem('groceriaContactMessages');
    setMessages([]);
    setStatusMessage('Contact messages cleared.');
  };

  const orderStatusColors = {
    pending: 'warning', processing: 'info', shipped: 'primary',
    delivered: 'success', cancelled: 'error',
  };

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
        <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error" sx={{ mb: 2, fontWeight: 700 }}>⛔ Access Denied</Typography>
          <Typography variant="body1" sx={{ color: '#556b8c', mb: 3 }}>
            You do not have administrative privileges. Please log in with an admin account.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: '#1976d2' }}>🛠️ Admin Command Center</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#556b8c' }}>
          Manage users, products, orders, and support messages — all connected to MongoDB Atlas.
        </Typography>

        {statusMessage && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setStatusMessage('')}>{statusMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}

        {/* Dashboard stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Registered Users', value: users.length, color: '#1976d2' },
            { label: 'Store Products', value: products.length, color: '#2e7d32' },
            { label: 'Total Orders', value: orders.length, color: '#ed6c02' },
            { label: 'Support Messages', value: messages.length, color: '#9c27b0' },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ borderLeft: `6px solid ${item.color}` }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: '#556b8c', fontWeight: 600 }}>{item.label}</Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: item.color }}>{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant="scrollable" scrollButtons="auto">
              <Tab label="👥 Users" />
              <Tab label="📦 Products" />
              <Tab label="🧾 Orders" />
              <Tab label="📧 Support" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Tab 0: Users */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>👥 User Accounts (MongoDB Atlas)</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow><TableCell colSpan={5} align="center">No users found.</TableCell></TableRow>
                      ) : users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role.toUpperCase()} size="small"
                              color={user.role === 'admin' ? 'success' : 'primary'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => handleToggleRole(user._id, user.role)} sx={{ mr: 1 }}>
                              Toggle Role
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteUser(user._id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 1: Products */}
            {tabValue === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>📦 Product Catalog (MongoDB)</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" onClick={handleSeedProducts} size="small">
                      Seed Defaults
                    </Button>
                    <Button variant="contained" onClick={handleOpenAddProduct}>+ Add Product</Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              No products in DB. Click "Seed Defaults" to populate from the default catalog.
                            </TableCell>
                          </TableRow>
                        ) : products.map((prod) => (
                          <TableRow key={prod._id}>
                            <TableCell>
                              <Box component="img" src={prod.image} alt={prod.name}
                                sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }} />
                            </TableCell>
                            <TableCell>{prod.name}</TableCell>
                            <TableCell sx={{ textTransform: 'capitalize' }}>{prod.category}</TableCell>
                            <TableCell>{prod.weight}</TableCell>
                            <TableCell>Rs.{prod.price}</TableCell>
                            <TableCell>{prod.stock}</TableCell>
                            <TableCell>
                              <Button size="small" variant="outlined" onClick={() => handleOpenEditProduct(prod)} sx={{ mr: 1 }}>Edit</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteProduct(prod._id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* Tab 2: Orders */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🧾 All Orders</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Update Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow><TableCell colSpan={6} align="center">No orders placed yet.</TableCell></TableRow>
                      ) : orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell>{order.user?.name || 'N/A'}<br /><Typography variant="caption" sx={{ color: '#556b8c' }}>{order.user?.email}</Typography></TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString('en-IN')}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Rs.{order.totalPrice?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip label={order.status} color={orderStatusColors[order.status] || 'default'} size="small" />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              size="small"
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              sx={{ minWidth: 130 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="processing">Processing</MenuItem>
                              <MenuItem value="shipped">Shipped</MenuItem>
                              <MenuItem value="delivered">Delivered</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="contained" onClick={() => handleManageOrder(order)}>
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 3: Support messages */}
            {tabValue === 3 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>📧 Support Messages</Typography>
                  {messages.length > 0 && (
                    <Button variant="outlined" color="error" onClick={handleClearMessages}>Clear All</Button>
                  )}
                </Box>
                {messages.length === 0 ? (
                  <Typography sx={{ color: '#556b8c', py: 3, textAlign: 'center' }}>No support queries at this time.</Typography>
                ) : messages.map((msg, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }} elevation={0}>
                    <CardContent>
                      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>Subject: {msg.subject}</Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c', mb: 1 }}>
                        From: {msg.name} ({msg.email}) · {new Date(msg.createdAt).toLocaleString()}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography sx={{ color: '#12254a', whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Order Details Dialog */}
      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700 }}>🧾 Order Details — #{selectedOrder?._id.slice(-8).toUpperCase()}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Customer Info */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>👤 Customer</Typography>
                <Typography><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {selectedOrder.user?.phone || selectedOrder.shippingAddress?.phone || 'N/A'}</Typography>
              </Grid>

              {/* Shipping Address */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>📍 Shipping Address</Typography>
                {selectedOrder.shippingAddress ? (
                  <>
                    <Typography>{selectedOrder.shippingAddress.fullName}</Typography>
                    <Typography>{selectedOrder.shippingAddress.address}</Typography>
                    <Typography>{selectedOrder.shippingAddress.city}{selectedOrder.shippingAddress.postalCode ? ` — ${selectedOrder.shippingAddress.postalCode}` : ''}</Typography>
                    <Typography>📞 {selectedOrder.shippingAddress.phone}</Typography>
                  </>
                ) : <Typography sx={{ color: '#888' }}>No address on record.</Typography>}
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>🛍️ Ordered Products</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(selectedOrder.orderItems || []).map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.image && <Box component="img" src={item.image} alt={item.name} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />}
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>Rs.{item.price?.toFixed(2)}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Rs.{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Pricing Summary */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>💰 Pricing</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal</Typography><Typography>Rs.{selectedOrder.itemsPrice?.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Tax (5%)</Typography><Typography>Rs.{selectedOrder.taxPrice?.toFixed(2)}</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Shipping</Typography><Typography sx={{ color: '#4caf50' }}>Free</Typography></Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontWeight: 700 }}>Total</Typography><Typography sx={{ fontWeight: 700, color: '#1976d2' }}>Rs.{selectedOrder.totalPrice?.toFixed(2)}</Typography></Box>
              </Grid>

              {/* Payment & Status */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>📋 Order Info</Typography>
                <Typography><strong>Payment:</strong> {selectedOrder.paymentMethod?.toUpperCase()}</Typography>
                <Typography><strong>Placed on:</strong> {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Update Status:</Typography>
                  <Select
                    value={selectedOrder.status}
                    size="small"
                    onChange={(e) => {
                      handleUpdateOrderStatus(selectedOrder._id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, status: e.target.value });
                    }}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add / Edit Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProduct ? '✏️ Edit Product' : '📦 Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Product Name" value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Weight / Size (e.g. 1 kg)" value={productForm.weight}
                onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Price (Rs.)" type="number" value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Original Price (optional)" type="number" value={productForm.oldPrice}
                onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Stock" type="number" value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select value={productForm.category} label="Category"
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="vegetables">Vegetables</MenuItem>
                  <MenuItem value="dairy">Dairy</MenuItem>
                  <MenuItem value="bakery">Bakery</MenuItem>
                  <MenuItem value="meat">Meat</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Image URL" value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                margin="normal" helperText="Paste an Unsplash or other direct image URL." />
              {productForm.image && (
                <Box component="img" src={productForm.image} alt="preview"
                  sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1, mt: 1 }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                placeholder="Describe the product — freshness, source, nutritional info, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProductForm}>Save Product</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
