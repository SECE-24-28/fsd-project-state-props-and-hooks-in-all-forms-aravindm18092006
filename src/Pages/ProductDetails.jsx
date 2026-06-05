import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Grid, Button,
  Chip, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { fetchProductById } from '../api/productApi';
import { DEFAULT_PRODUCTS } from '../utils/defaultProducts';

const IMAGE_MAP = Object.fromEntries(DEFAULT_PRODUCTS.map((p) => [p.name, p.image]));

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Try MongoDB first (id may be a MongoDB ObjectId)
        const res = await fetchProductById(id);
        if (res.success && res.data) {
          const p = res.data;
          setProduct({
            ...p,
            id: p._id,
            image: IMAGE_MAP[p.name] || p.image,
            description: p.description || `Fresh and premium ${p.name.toLowerCase()} sourced directly from certified farms. Quality guaranteed.`,
            features: ['100% Certified Fresh', 'No artificial additives', 'Rich in natural nutrients'],
          });
          return;
        }
      } catch (_) {
        // MongoDB lookup failed — try local fallback
      }

      // Fallback: match by numeric id from DEFAULT_PRODUCTS
      const localProduct = DEFAULT_PRODUCTS.find((p) => String(p.id) === id);
      if (localProduct) {
        setProduct({
          ...localProduct,
          description: `Fresh and premium ${localProduct.name.toLowerCase()} sourced from certified local farms. Quality guaranteed.`,
          features: ['100% Certified Fresh', 'No artificial additives', 'Rich in natural nutrients'],
        });
      }
    };
    load().finally(() => setLoading(false));
  }, [id]);

  const getProductId = () => product?._id || String(product?.id);
  const inWishlist = product ? isInWishlist(getProductId()) : false;
  const discount = product?.oldPrice > 0
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Product not found</Typography>
          <Button variant="contained" onClick={() => navigate('/products')}>Back to Products</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back to Products
        </Button>
        <Card>
          <CardContent>
            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={5}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 3 }}
                  />
                  {discount > 0 && (
                    <Chip
                      label={`-${discount}% OFF`}
                      sx={{ position: 'absolute', top: 12, left: 12, background: '#e53935', color: 'white', fontWeight: 700 }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="body2" sx={{ color: '#556b8c', mb: 0.5, textTransform: 'capitalize' }}>
                  {product.category}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>{product.name}</Typography>
                <Typography variant="body2" sx={{ color: '#556b8c', mb: 2 }}>Weight: {product.weight}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
                    Rs.{product.price}
                  </Typography>
                  {product.oldPrice > 0 && (
                    <Typography sx={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem' }}>
                      Rs.{product.oldPrice}
                    </Typography>
                  )}
                  {discount > 0 && (
                    <Chip label={`Save Rs.${product.oldPrice - product.price}`} color="success" size="small" />
                  )}
                </Box>

                <Typography variant="body1" sx={{ color: '#556b8c', mb: 3, lineHeight: 1.7 }}>
                  {product.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  {product.features?.map((feature, idx) => (
                    <Typography key={idx} sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#4caf50', fontWeight: 700 }}>✓</span> {feature}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => {
                      addToCart(product);
                      setSnack({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant={inWishlist ? 'contained' : 'outlined'}
                    size="large"
                    color={inWishlist ? 'error' : 'primary'}
                    startIcon={inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={() => {
                      if (inWishlist) {
                        removeFromWishlist(getProductId());
                        setSnack({ open: true, message: 'Removed from wishlist', severity: 'info' });
                      } else {
                        addToWishlist(product);
                        setSnack({ open: true, message: `${product.name} added to wishlist!`, severity: 'info' });
                      }
                    }}
                  >
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
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

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
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

export default ProductDetails;
