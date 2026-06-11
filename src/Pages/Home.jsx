import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import logo from '../image/Groceria logo.png';
import { DEFAULT_PRODUCTS } from '../utils/defaultProducts';
import { fetchProducts } from '../api/productApi';

const IMAGE_MAP = Object.fromEntries(DEFAULT_PRODUCTS.map((p) => [p.name, p.image]));

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchProducts();
        if (data.success && data.data.length > 0) {
          const patched = data.data.map((p) => ({
            ...p,
            image: IMAGE_MAP[p.name] || p.image,
            id: p._id || p.id,
          }));
          setFeaturedProducts(patched.slice(0, 6).map((item, idx) => ({
            ...item,
            label: idx % 2 === 0 ? 'Fresh' : 'Organic',
          })));
          return;
        }
      } catch (_) {}
      // Fallback to defaults when backend is offline
      setFeaturedProducts(DEFAULT_PRODUCTS.slice(0, 6).map((item, idx) => ({
        ...item,
        label: idx % 2 === 0 ? 'Fresh' : 'Organic',
      })));
    };
    loadFeatured();
  }, []);

  const categories = [
    { icon: '🍎', name: 'Fruits' },
    { icon: '🥦', name: 'Vegetables' },
    { icon: '🥛', name: 'Dairy' },
    { icon: '🍞', name: 'Bakery' },
    { icon: '🥩', name: 'Meat' },
    { icon: '🧃', name: 'Beverages' },
  ];

  const features = [
    { icon: <LocalShippingIcon sx={{ fontSize: 40 }} />, title: 'Free Delivery', desc: 'On orders above Rs.499' },
    { icon: <LocalFloristIcon sx={{ fontSize: 40 }} />, title: '100% Fresh', desc: 'Farm to table quality' },
    { icon: <AccessTimeIcon sx={{ fontSize: 40 }} />, title: 'Same Day Delivery', desc: 'Delivered in 2-4 hours' },
    { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'Secure Payment', desc: '100% safe checkout' },
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 55%, #bfdbfe 100%)',
          color: 'black',
          textAlign: 'center',
          py: { xs: 5, md: 10 },
          px: { xs: 2, md: 3 },
          backgroundImage: 'radial-gradient(circle at top right, rgba(96, 165, 250, 0.18), transparent 35%), radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.12), transparent 20%)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 5 } }}>
          <Box
            component="img"
            src={logo}
            alt="Groceria logo"
            sx={{
              width: { xs: 140, sm: 180, md: 220 },
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(14, 79, 193, 0.18))',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.08)',
              },
            }}
          />
        </Box>
        <Typography variant="h1" sx={{ mb: 2, letterSpacing: '0.02em', fontSize: { xs: '1.75rem', md: '2.5rem' }, color: 'black' }}>
          🛒 Fresh Groceries Delivered To Your Door
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: 760, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.1rem' }, color: 'black' }}>
          🌾 Shop from thousands of premium fruits, vegetables, dairy, and pantry essentials with fast delivery and trusted quality.
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ background: '#f8fafc', color: '#0e4fc1', fontWeight: 'bold', px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            🛍️ Shop Now
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/about')}
            sx={{ background: '#f8fafc', color: '#0e4fc1', fontWeight: 'bold', px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.9rem', md: '1rem' }, '&:hover': { background: '#e2e8f0' } }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, md: 2 } }}>
        {/* Search Bar */}
        <Paper
          sx={{
            display: 'flex',
            gap: 1,
            p: { xs: 1.5, md: 2 },
            mb: { xs: 4, md: 6 },
            borderRadius: 3,
            boxShadow: '0 22px 48px rgba(8, 37, 87, 0.09)',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for fruits, vegetables, dairy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>🔍 Search</Button>
        </Paper>

        {/* Categories Section */}
        <Box sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2rem' } }}>
            Shop by Category
          </Typography>
          <Typography variant="body1" sx={{ color: '#556b8c', mb: { xs: 3, md: 4 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Browse our wide range of fresh products
          </Typography>
          <Grid container spacing={{ xs: 1.5, md: 3 }}>
            {categories.map((cat, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Card
                  onClick={() => navigate('/products?category=' + cat.name.toLowerCase())}
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(14, 79, 193, 0.15)' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>{cat.icon}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                      {cat.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 5, md: 8 } }}>
          {features.map((feat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  background: 'white',
                  boxShadow: '0 14px 32px rgba(14, 79, 193, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(14, 79, 193, 0.15)' },
                }}
              >
                <Box sx={{ color: '#0e4fc1', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>{feat.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                  {feat.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#556b8c', fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                  {feat.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Featured Products */}
        <Box>
          <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2rem' } }}>
            Featured Products
          </Typography>
          <Typography variant="body1" sx={{ color: '#556b8c', mb: { xs: 3, md: 4 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Handpicked fresh items just for you
          </Typography>
          <Grid container spacing={{ xs: 1.5, md: 3 }}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 16px 32px rgba(14, 79, 193, 0.15)' } }}>
                  <Box sx={{ position: 'relative', height: { xs: 140, md: 180 } }}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: '#0e4fc1',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                        fontWeight: 'bold',
                      }}
                    >
                      {product.label}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#556b8c', mb: 2, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                      {product.weight}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                          Rs.{product.price}
                        </Typography>
                        {product.oldPrice && (
                          <Typography sx={{ textDecoration: 'line-through', color: '#999', fontSize: { xs: '0.75rem', md: '0.9rem' } }}>
                            Rs.{product.oldPrice}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        sx={{ borderRadius: '50%', minWidth: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, p: 0 }}
                        onClick={() => handleAddToCart(product)}
                      >
                        +
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
