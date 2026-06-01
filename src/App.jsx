import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './Styles/theme';
import AppRoutes from './Routes/AppRoutes';
import { CartProvider } from './Context/CartContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
