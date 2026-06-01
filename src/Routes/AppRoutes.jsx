import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Products from "../Pages/Products";
import Cart from "../Pages/Cart";
import Checkout from "../Pages/Checkout";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Profile from "../Pages/Profile";
import Orders from "../Pages/Orders";
import ProductDetails from "../Pages/ProductDetails";
import Wishlist from "../Pages/Wishlist";
import Contact from "../Pages/Contact";
import FAQ from "../Pages/FAQ";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
  );
}

export default AppRoutes;
