import React from "react";
import "./Homepage.css";

function Homepage() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <h1>🛒 Fresh Groceries Delivered To Your Door</h1>
        <p>🌾 Shop from thousands of fresh fruits, vegetables, dairy, and more.</p>
        <button className="hero-btn-main">🛍️ Shop Now</button>
        <button className="hero-btn-outline">Learn More</button>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for fruits, vegetables, dairy..."
        />
        <button>🔍 Search</button>
      </div>

      {/* CATEGORIES */}
      <div className="section">
        <h2>Shop by Category</h2>
        <p className="sub">Browse our wide range of fresh products</p>

        <div className="categories">
          <div className="category-card">🍎 Fruits</div>
          <div className="category-card">🥦 Vegetables</div>
          <div className="category-card">🥛 Dairy</div>
          <div className="category-card">🍞 Bakery</div>
          <div className="category-card">🥩 Meat</div>
          <div className="category-card">🧃 Beverages</div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features">
        <div className="feature-item">
          <h4>🚚 Free Delivery</h4>
          <p>On orders above Rs.499</p>
        </div>

        <div className="feature-item">
          <h4>🌿 100% Fresh</h4>
          <p>Farm to table quality</p>
        </div>

        <div className="feature-item">
          <h4>⏱ Same Day Delivery</h4>
          <p>Delivered in 2-4 hours</p>
        </div>

        <div className="feature-item">
          <h4>🔒 Secure Payment</h4>
          <p>100% safe checkout</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <h2>Featured Products</h2>

        <div className="products-grid">
          <div className="product-card">
            <h4>🍎 Red Apples</h4>
            <p>Rs.89</p>
          </div>

          <div className="product-card">
            <h4>🥦 Broccoli</h4>
            <p>Rs.55</p>
          </div>

          <div className="product-card">
            <h4>🥛 Full Cream Milk</h4>
            <p>Rs.62</p>
          </div>

          <div className="product-card">
            <h4>🍌 Bananas</h4>
            <p>Rs.45</p>
          </div>
        </div>
      </div>

      {/* PROMO */}
      <div className="promo">
        <h2>🎉 Get 20% Off Your First Order!</h2>
        <p>Use code FRESH20 at checkout.</p>
      </div>
    </>
  );
}

export default Homepage;