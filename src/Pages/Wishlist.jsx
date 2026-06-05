import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import { getStoredUser } from '../api/authApi';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const user = getStoredUser();

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>💖 Wishlist</Typography>
            <Typography variant="body1" sx={{ color: '#556b8c', mb: 3 }}>
              Please log in to view and manage your wishlist.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>💖 Your Wishlist is Empty</Typography>
            <Typography variant="body1" sx={{ color: '#556b8c', mb: 4 }}>
              Save items you love and come back to them anytime.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef6ff, #f6fbff)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            💖 Wishlist ({wishlist.length})
          </Typography>
          <Button variant="outlined" color="error" onClick={clearWishlist}>
            Clear All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: '100%', height: 180, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer', '&:hover': { color: '#1976d2' } }}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#556b8c', mb: 0.5, textTransform: 'capitalize' }}>
                    {item.category} · {item.weight}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 2 }}>
                    Rs.{item.price}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      fullWidth
                      onClick={() => {
                        addToCart(item);
                        removeFromWishlist(item.id);
                      }}
                    >
                      Move to Cart
                    </Button>
                    <Tooltip title="Remove from wishlist">
                      <IconButton color="error" onClick={() => removeFromWishlist(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

export default Wishlist;
