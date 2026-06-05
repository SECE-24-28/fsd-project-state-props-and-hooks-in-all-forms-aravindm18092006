Frontend

Groceria Frontend is the client-side application of the Groceria Grocery E-Commerce Platform. It provides a modern and responsive shopping experience where users can browse products, manage their cart and wishlist, place orders, and track their purchases.

Project Overview

-> Built using React.js

-> Provides a responsive user interface for customers and administrators

-> Connects with backend REST APIs

-> Handles authentication and user sessions

-> Supports product browsing and order management

Tech Stack

-> React.js

-> React Router DOM

-> Material UI (MUI)

-> Axios

-> Context API

-> JavaScript ES6+

-> HTML5

-> CSS3

-> Netlify

Features

-> User Registration

-> User Login

-> Forgot Password

-> Reset Password

-> Home Page

-> Product Listing

-> Product Search

-> Category Filtering

-> Product Details

-> Shopping Cart

-> Wishlist Management

-> Checkout Page

-> Order Placement

-> Order History

-> User Profile

-> Contact Page

-> Admin Dashboard

-> Product Management

-> User Management

-> Order Management

Application Flow

-> User opens the application

-> React Router manages page navigation

-> Axios communicates with backend APIs

-> Data is fetched and displayed dynamically

-> User actions are stored through backend services

-> Updates are reflected instantly in the interface

Project Structure

frontend/

-> public/

-> src/

-> components/

-> pages/

-> context/

-> services/

-> assets/

-> App.js

-> index.js

Installation

Clone Repository

```bash
git clone https://github.com/yourusername/groceria-frontend.git
cd groceria-frontend
```

Install Dependencies

```bash
npm install
```

Start Development Server

```bash
npm start
```

Environment Variables

Create a .env file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Example API Call

```javascript
import axios from "axios";

const response = await axios.get(
  `${process.env.REACT_APP_API_URL}/products`
);

console.log(response.data);
```

Pages Included

-> Home

-> Login

-> Register

-> Products

-> Product Details

-> Cart

-> Wishlist

-> Checkout

-> Orders

-> Profile

-> Contact

-> Admin Dashboard

Deployment

-> Frontend deployed using Netlify

-> Connected with GitHub for automatic deployment

-> Production build generated using React build tools

Future Improvements

-> Online Payments

-> Product Reviews

-> Product Ratings

-> Push Notifications

-> Dark Mode

-> AI Product Recommendations

Author

Aravind M

Full Stack Grocery E-Commerce Project

Sri Eshwar College of Engineering
