import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Products from '../Pages/Products';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import Profile from '../Pages/Profile';
import Orders from '../Pages/Orders';
import ProductDetails from '../Pages/ProductDetails';
import Wishlist from '../Pages/Wishlist';
import Contact from '../Pages/Contact';
import FAQ from '../Pages/FAQ';
import Admin from '../Pages/Admin';
import ForgotPassword from '../Pages/ForgotPassword';
import ResetPassword from '../Pages/ResetPassword';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"                       element={<Home />} />
      <Route path="/about"                  element={<About />} />
      <Route path="/products"               element={<Products />} />
      <Route path="/product/:id"            element={<ProductDetails />} />
      <Route path="/contact"                element={<Contact />} />
      <Route path="/faq"                    element={<FAQ />} />

      {/* Auth */}
      <Route path="/login"                  element={<Login />} />
      <Route path="/signup"                 element={<Signup />} />
      <Route path="/forgot-password"        element={<ForgotPassword />} />
      <Route path="/reset-password/:token"  element={<ResetPassword />} />

      {/* Protected (user) */}
      <Route path="/cart"                   element={<Cart />} />
      <Route path="/checkout"               element={<Checkout />} />
      <Route path="/orders"                 element={<Orders />} />
      <Route path="/wishlist"               element={<Wishlist />} />
      <Route path="/profile"                element={<Profile />} />

      {/* Admin */}
      <Route path="/admin"                  element={<Admin />} />
    </Routes>
  );
}

export default AppRoutes;
