import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './Styles/theme';
import AppRoutes from './Routes/AppRoutes';
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

const hideNavFooterRoutes = ['/login', '/signup'];

function Layout() {
  const { pathname } = useLocation();
  const hide = hideNavFooterRoutes.includes(pathname);
  return (
    <>
      {!hide && <Navbar />}
      <AppRoutes />
      {!hide && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
