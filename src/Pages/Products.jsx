import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { useCart } from '../Context/CartContext';

const Products = () => {
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const [sortBy, setSortBy] = useState('popular');
  const [filterBy, setFilterBy] = useState('all');

  const allProducts = [
    { id: 1, name: 'Red Apples', price: 89, oldPrice: 110, weight: '1 kg', category: 'fruits', emoji: '🍎' },
    { id: 2, name: 'Broccoli', price: 55, weight: '500g', category: 'vegetables', emoji: '🥦' },
    { id: 3, name: 'Fresh Milk', price: 49, weight: '1L', category: 'dairy', emoji: '🥛' },
    { id: 4, name: 'Whole Wheat Bread', price: 39, weight: '600g', category: 'bakery', emoji: '🍞' },
    { id: 5, name: 'Chicken Breast', price: 299, weight: '500g', category: 'meat', emoji: '🥩' },
    { id: 6, name: 'Orange Juice', price: 79, weight: '1L', category: 'beverages', emoji: '🧃' },
    { id: 7, name: 'Bananas', price: 45, weight: '1 kg', category: 'fruits', emoji: '🍌' },
    { id: 8, name: 'Carrots', price: 35, weight: '500g', category: 'vegetables', emoji: '🥕' },
    { id: 9, name: 'Yogurt', price: 65, weight: '500ml', category: 'dairy', emoji: '🥣' },
    { id: 10, name: 'Croissant', price: 29, weight: '100g', category: 'bakery', emoji: '🥐' },
  ];

  const filteredProducts = filterBy === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === filterBy);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, md: 0 } }}>
        {/* Page Hero */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
            color: 'white',
            textAlign: 'center',
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            mb: { xs: 3, md: 4 },
            boxShadow: '0 18px 36px rgba(8, 37, 87, 0.14)',
          }}
        >
          <Typography variant="h2" sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            🛍️ All Products
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
            Browse and shop from our wide range of fresh groceries
          </Typography>
        </Box>

        {/* Cart Bar */}
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            p: { xs: 2, md: 2.5 },
            mb: { xs: 3, md: 4 },
            borderRadius: 2,
            gap: { xs: 2, md: 0 },
            background: '#eef6ff',
          }}
        >
          <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            🛒 Cart: {getTotalItems()} item(s) — Total: Rs.{getTotalPrice().toFixed(2)}
          </Typography>
          <Button variant="contained">View Cart</Button>
        </Paper>

        {/* Filter & Sort Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="fruits">Fruits</MenuItem>
              <MenuItem value="vegetables">Vegetables</MenuItem>
              <MenuItem value="dairy">Dairy</MenuItem>
              <MenuItem value="bakery">Bakery</MenuItem>
              <MenuItem value="meat">Meat</MenuItem>
              <MenuItem value="beverages">Beverages</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>

          <Typography sx={{ alignSelf: 'center', color: '#556b8c', fontSize: '0.9rem' }}>
            Showing {filteredProducts.length} products
          </Typography>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    background: '#f0f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 120,
                    fontSize: '3rem',
                  }}
                >
                  {product.emoji}
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#556b8c', mb: 2 }}>
                    {product.weight}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Rs.{product.price}
                        {product.oldPrice && (
                          <Typography component="span" sx={{ textDecoration: 'line-through', color: '#999', ml: 1, fontSize: '0.9rem' }}>
                            Rs.{product.oldPrice}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Products;
