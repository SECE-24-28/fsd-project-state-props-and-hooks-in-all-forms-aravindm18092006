import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Grid, Button,
  Select, MenuItem, FormControl, InputLabel, Paper, IconButton,
  Tooltip, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { fetchProducts } from '../api/productApi';
import { DEFAULT_PRODUCTS } from '../utils/defaultProducts';

// Products removed from catalog
const REMOVED_PRODUCTS = ['Sparkling Water', 'Tender Coconut Water', 'Apple Cider'];

// Always use these image URLs regardless of what MongoDB has
const IMAGE_MAP = Object.fromEntries(DEFAULT_PRODUCTS.map((p) => [p.name, p.image]));

const applyCorrectImages = (list) =>
  list
    .filter((p) => !REMOVED_PRODUCTS.includes(p.name))
    .map((p) => ({ ...p, image: IMAGE_MAP[p.name] || p.image }));

const Products = () => {
  const { addToCart, cart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('popular');
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const filterBy = searchParams.get('category') || 'all';

  const setFilterBy = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') newParams.delete('category');
    else newParams.set('category', value);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetchProducts();
        if (res.success && res.data && res.data.length > 0) {
          setProducts(applyCorrectImages(res.data));
        } else {
          setProducts(DEFAULT_PRODUCTS.filter((p) => !REMOVED_PRODUCTS.includes(p.name)));
        }
      } catch (err) {
        setProducts(DEFAULT_PRODUCTS.filter((p) => !REMOVED_PRODUCTS.includes(p.name)));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const getProductId = (product) => product._id || String(product.id);

  // Get current quantity of a product in cart
  const getCartQty = (product) => {
    const pid = getProductId(product);
    const item = cart.find((c) => c.id === pid || c._id === pid);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnack({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
  };

  const handleIncrease = (product) => {
    const pid = getProductId(product);
    const item = cart.find((c) => c.id === pid || c._id === pid);
    if (item) {
      updateQuantity(pid, item.quantity + 1);
    } else {
      addToCart(product);
    }
  };

  const handleDecrease = (product) => {
    const pid = getProductId(product);
    const item = cart.find((c) => c.id === pid || c._id === pid);
    if (item) {
      updateQuantity(pid, item.quantity - 1);
    }
  };

  const handleWishlist = (product) => {
    const pid = getProductId(product);
    if (isInWishlist(pid)) {
      removeFromWishlist(pid);
      setSnack({ open: true, message: `${product.name} removed from wishlist`, severity: 'info' });
    } else {
      addToWishlist(product);
      setSnack({ open: true, message: `${product.name} added to wishlist!`, severity: 'info' });
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const filteredProducts =
    filterBy === 'all'
      ? sortedProducts
      : sortedProducts.filter((p) => p.category === filterBy);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, md: 0 } }}>

        {/* Page Hero */}
        <Box sx={{
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          color: 'white', textAlign: 'center',
          p: { xs: 3, md: 4 }, borderRadius: 3, mb: { xs: 3, md: 4 },
          boxShadow: '0 18px 36px rgba(8,37,87,0.14)',
        }}>
          <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            🛍️ All Products
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
            Browse and shop from our wide range of fresh groceries
          </Typography>
        </Box>

        {/* Cart summary bar */}
        <Paper sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          p: { xs: 2, md: 2.5 }, mb: { xs: 3, md: 4 }, borderRadius: 2,
          gap: { xs: 2, md: 0 }, background: '#eef6ff',
        }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            🛒 Cart: {getTotalItems()} item(s) — Total: Rs.{getTotalPrice().toFixed(2)}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/cart')}>View Cart</Button>
        </Paper>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="fruits">🍎 Fruits</MenuItem>
              <MenuItem value="vegetables">🥦 Vegetables</MenuItem>
              <MenuItem value="dairy">🥛 Dairy</MenuItem>
              <MenuItem value="bakery">🍞 Bakery</MenuItem>
              <MenuItem value="meat">🥩 Meat</MenuItem>
              <MenuItem value="beverages">🧃 Beverages</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ alignSelf: 'center', color: '#556b8c', fontSize: '0.9rem' }}>
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => {
              const pid = getProductId(product);
              const inWishlist = isInWishlist(pid);
              const cartQty = getCartQty(product);
              const discount = product.oldPrice > 0
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pid}>
                  <Card sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 32px rgba(14,79,193,0.15)' },
                  }}>
                    {/* Discount badge */}
                    {discount > 0 && (
                      <Box sx={{
                        position: 'absolute', top: 10, left: 10, zIndex: 1,
                        background: '#e53935', color: 'white',
                        px: 1, py: 0.3, borderRadius: 1,
                        fontSize: '0.7rem', fontWeight: 700,
                      }}>
                        -{discount}%
                      </Box>
                    )}

                    {/* Wishlist button */}
                    <Tooltip title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                      <IconButton
                        size="small"
                        onClick={() => handleWishlist(product)}
                        sx={{
                          position: 'absolute', top: 8, right: 8, zIndex: 1,
                          bgcolor: 'white', boxShadow: 1,
                          '&:hover': { bgcolor: '#fff0f0' },
                        }}
                      >
                        {inWishlist
                          ? <FavoriteIcon sx={{ color: '#e53935', fontSize: 18 }} />
                          : <FavoriteBorderIcon sx={{ color: '#aaa', fontSize: 18 }} />
                        }
                      </IconButton>
                    </Tooltip>

                    {/* Product image */}
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      onClick={() => navigate(`/product/${pid}`)}
                      sx={{ width: '100%', height: 160, objectFit: 'cover', cursor: 'pointer' }}
                    />

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem', cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
                        onClick={() => navigate(`/product/${pid}`)}
                      >
                        {product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#556b8c', mb: 0.5, fontSize: '0.8rem', textTransform: 'capitalize' }}>
                        {product.category} · {product.weight}
                      </Typography>

                      <Box sx={{ mt: 'auto' }}>
                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1.05rem' }}>
                            Rs.{product.price}
                          </Typography>
                          {product.oldPrice > 0 && (
                            <Typography sx={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8rem' }}>
                              Rs.{product.oldPrice}
                            </Typography>
                          )}
                        </Box>

                        {/* Quantity selector or Add button */}
                        {cartQty === 0 ? (
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(product)}
                            size="small"
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            border: '2px solid #1976d2', borderRadius: '999px', overflow: 'hidden',
                          }}>
                            <IconButton
                              size="small"
                              onClick={() => handleDecrease(product)}
                              sx={{ color: '#1976d2', borderRadius: 0, px: 1.5, '&:hover': { bgcolor: '#e3f2fd' } }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ fontWeight: 700, color: '#1976d2', minWidth: 24, textAlign: 'center' }}>
                              {cartQty}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleIncrease(product)}
                              sx={{ color: '#1976d2', borderRadius: 0, px: 1.5, '&:hover': { bgcolor: '#e3f2fd' } }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {!loading && filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#556b8c' }}>No products found in this category.</Typography>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
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

export default Products;
