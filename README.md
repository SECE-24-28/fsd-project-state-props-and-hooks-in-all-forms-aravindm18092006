# 🛒 Groceria — Frontend

**Groceria** is a full-stack online grocery store built as part of an academic project at SECE Campus, Coimbatore. This is the React frontend — it handles everything the user sees and interacts with, from browsing products to placing orders and managing their account.

The app is live at: **https://groceria-frontend-six.vercel.app**
The backend API runs at: **https://groceria-backend.onrender.com/api**

---

## What Does This App Do?

Think of Groceria like a mini Amazon for groceries. Here's the basic idea:

- A **guest** can browse products, use the search bar, and add things to the cart
- A **registered user** gets their cart and wishlist saved to the cloud (MongoDB), so it persists across sessions and devices
- An **admin** gets access to a special dashboard where they can manage products, users, and orders
- The app sends real emails — when you forget your password, a reset link hits your inbox. When you contact support, the admin gets an email too.

---

## Tech Stack

| What | Tool | Why |
|------|------|-----|
| UI Framework | React 19 | Latest stable React with concurrent features |
| Routing | React Router DOM v7 | Client-side routing with 16 defined routes |
| UI Components | Material UI (MUI) v9 | Pre-built accessible components + custom theme |
| HTTP Client | Axios 1.17 | API calls with request/response interceptors |
| State Management | React Context API | Cart and Wishlist global state (no Redux needed) |
| Auth | JWT (localStorage) | Token-based auth, auto-logout on 401 |
| Build Tool | react-scripts (CRA) 5 | Zero-config build setup |
| Deployment | Vercel | Auto-deploys on every push to main |

---

## Project Workflow

Here's how everything connects:

```
User opens the app
        ↓
React loads App.js → ThemeProvider → CartProvider → WishlistProvider → Router
        ↓
Layout component checks the current URL path
  → If path is /login, /signup, /forgot-password, /verify-otp, /reset-password/:token
      → Renders page WITHOUT Navbar and Footer (clean auth experience)
  → All other paths
      → Renders Navbar + Page + Footer
        ↓
Navbar checks localStorage for groceriaToken and groceriaUser
  → If logged in as admin → shows Admin link
  → If logged in as user  → shows profile name + logout
  → If not logged in      → shows Login button
        ↓
CartContext and WishlistContext load on mount
  → If user is logged in → fetch cart/wishlist from MongoDB API
  → If not logged in     → read from localStorage
  → Listen for storage events → re-sync if user logs in later
```

---

## Pages & Routes

Every page has its own file in `src/Pages/`. Here's a tour:

### Public Pages (anyone can visit)

| Route | File | What it does |
|-------|------|--------------|
| `/` | `Home.jsx` | Landing page. Shows hero section with Groceria logo, category grid, features section, and 6 featured products with add-to-cart and wishlist controls |
| `/products` | `Products.jsx` | Full product catalog. Has a search bar, category filter, sort options, live quantity controls, and wishlist toggle on every card |
| `/product/:id` | `ProductDetails.jsx` | Single product page. Full description, features list, add to cart, wishlist toggle |
| `/about` | `About.jsx` | About Groceria |
| `/faq` | `FAQ.jsx` | Common questions answered |
| `/contact` | `Contact.jsx` | Contact form. Sends email to admin via backend nodemailer |

### Auth Pages (no navbar/footer shown)

| Route | File | What it does |
|-------|------|--------------|
| `/login` | `Login.jsx` | Email + password login. Has "Forgot password?" link. Draft auto-saved to localStorage |
| `/signup` | `Signup.jsx` | Registration form with full validation (name, email, Indian phone, password, confirm) |
| `/forgot-password` | `ForgotPassword.jsx` | Enter email → backend sends reset link. If SMTP is blocked on the network, the page shows a direct "Reset Password Now" button as fallback |
| `/verify-otp` | `VerifyOtp.jsx` | OTP verification step |
| `/reset-password-otp` | `ResetPasswordOtp.jsx` | Set new password after OTP |
| `/reset-password/:token` | `ResetPassword.jsx` | Set new password via email link token. Has password strength meter (5 levels) and show/hide toggles |

### Protected Pages (need to be logged in)

| Route | File | What it does |
|-------|------|--------------|
| `/cart` | `Cart.jsx` | Shows cart items with product images, +/− quantity controls, order summary (subtotal + 5% tax + free shipping) |
| `/checkout` | `Checkout.jsx` | 3-step checkout: Shipping details → Payment method (COD / Card / UPI) → Review → Place Order |
| `/orders` | `Orders.jsx` | Order history. Each order is expandable — shows items, prices, shipping address, and full tracking timeline. Has a Cancel button for pending/processing orders |
| `/wishlist` | `Wishlist.jsx` | Saved products. "Move to Cart" button removes from wishlist and adds to cart in one click |
| `/profile` | `Profile.jsx` | 3 tabs: Personal Info (name, phone) | Address | Security (change password, logout) |

### Admin Only

| Route | File | What it does |
|-------|------|--------------|
| `/admin` | `Admin.jsx` | Full dashboard. 4 tabs: Users (view, toggle role, delete) / Products (CRUD with image preview + description) / Orders (status updates) / Support (contact messages). Admin link only shows in navbar when logged in as admin |

---

## Folder Structure

```
src/
│
├── api/                    All backend communication lives here
│   ├── axios.js            Two Axios instances:
│   │                       - API: for /api/user (auth)
│   │                       - GAPI: for everything else
│   │                       Both have:
│   │                       - Request interceptor: adds "Bearer <token>" header
│   │                       - Response interceptor: on 401, clears localStorage + redirects to /login
│   ├── authApi.js          register, login, saveAuthData, clearAuthData, getStoredUser,
│   │                       isAuthenticated, updateUserProfile, forgotPasswordApi,
│   │                       resetPasswordApi, resetPasswordByTokenApi,
│   │                       adminGetUsers, adminUpdateUserRole, adminDeleteUser
│   ├── productApi.js       fetchProducts, fetchProductById, createProduct,
│   │                       updateProduct, deleteProduct, seedProducts
│   ├── cartApi.js          fetchCart, addItemToCart, updateCartItemQty,
│   │                       removeCartItem, clearCartApi
│   ├── wishlistApi.js      fetchWishlist, addToWishlistApi,
│   │                       removeFromWishlistApi, clearWishlistApi
│   ├── orderApi.js         placeOrderApi, fetchMyOrders, fetchOrderById,
│   │                       cancelOrderApi, fetchAllOrders, updateOrderStatusApi
│   └── contactApi.js       sendContactForm
│
├── Components/
│   ├── Navbar.jsx          Sticky top bar. Cart badge shows item count. Heart badge
│   │                       shows wishlist count. Admin link only for admin role.
│   │                       Mobile: hamburger drawer with full nav links.
│   ├── Footer.jsx          Site footer
│   └── ProductCard.jsx     Reusable product card (used in Home featured section)
│
├── Context/
│   ├── CartContext.jsx     Global cart state. On login: syncs from MongoDB.
│   │                       On logout: clears. Offline: uses localStorage.
│   │                       Listens to storage events for cross-tab login sync.
│   └── WishlistContext.jsx Same sync strategy as CartContext.
│
├── Pages/                  One file per route (16 pages total)
│
├── Routes/
│   └── AppRoutes.jsx       Defines all 16 <Route> elements
│
├── Styles/
│   └── theme.js            Custom MUI theme:
│                           Primary: #0e4fc1 (deep blue)
│                           Typography: Lucida Bright / Times New Roman
│                           Cards: 16px border radius
│                           Buttons: pill shape (999px radius)
│
├── utils/
│   ├── defaultProducts.js  33 default products with verified Unsplash image URLs.
│   │                       IMAGE_MAP (keyed by name) always overrides DB images —
│   │                       ensures correct product photos regardless of DB state.
│   │                       3 removed products: Sparkling Water, Tender Coconut Water,
│   │                       Apple Cider (persistent image issues)
│   └── validation.js       Regex validators: email, phone, password, name
│
├── image/
│   └── Groceria logo.png   Brand logo (also copied to public/ for favicon)
│
├── App.js                  Root component. Layout component handles
│                           navbar/footer visibility per route.
└── index.js                ReactDOM.createRoot entry point
```

---

## How the Search Works

The search bar lives on the `/products` page. Here's how it works:

1. User types in the search box and presses **Enter** or clicks **Search**
2. The query is added to the URL as `?search=tomato` — making it bookmarkable and shareable
3. Products are filtered in the frontend — matching against **name**, **category**, and **description**
4. An active search shows a dismissible chip tag: `Results for: "tomato"`
5. The result count updates: `"4 products found"`
6. If nothing matches: shows a friendly message with "Clear Search" and "View All Products" buttons
7. Changing the category filter automatically clears the search

---

## How Cart & Wishlist Sync Works

This was a tricky problem — the cart needs to work both for guests and logged-in users.

```
App loads
    ↓
CartContext mounts → checks localStorage for groceriaToken
    → Token found (logged in) → fetches cart from MongoDB API
    → No token (guest)        → reads from localStorage
    ↓
User adds item to cart
    → Optimistic update (cart updates instantly in UI)
    → If logged in → API call to sync with MongoDB
    → If guest     → saves to localStorage only
    ↓
User logs in mid-session
    → Login page saves token to localStorage
    → Storage event fires
    → CartContext detects the change → re-fetches cart from MongoDB
    → Guest cart merges into the cloud cart
    ↓
User logs out
    → All localStorage cleared (token, user, cart, wishlist)
    → Cart and wishlist reset to empty
```

---

## How the Password Reset Works

Two flows depending on network conditions:

**When email works (normal flow):**
1. User enters email on `/forgot-password`
2. Backend generates a secure random token (32 bytes), hashes it with SHA-256, stores hash in DB
3. Nodemailer sends an email with a button linking to `/reset-password/<rawToken>`
4. User clicks the link → arrives at `/reset-password/:token`
5. Enters new password → backend verifies hash → updates password → clears token

**When SMTP is blocked (college/corporate network):**
1. Same first step
2. Backend tries to send email, fails
3. Returns the raw token directly in the API response
4. Frontend detects this and shows a **"Reset Password Now"** button
5. Clicking it navigates directly to `/reset-password/<token>`
6. Rest of the flow is identical

---

## API Endpoints Used

All calls go to `REACT_APP_API_URL` (defaults to `http://localhost:5000/api`)

### Auth (`/api/user`)
```
POST   /user/register              → Create new account
POST   /user/login                 → Login, get JWT token
POST   /user/forgot-password       → Request password reset
POST   /user/reset-password        → Reset via body token
POST   /user/reset-password/:token → Reset via URL token (from email)
PUT    /user/profile               → Update name/phone/address/password
GET    /user/admin/users           → Admin: get all users
PUT    /user/admin/user/:id/role   → Admin: toggle user role
DELETE /user/admin/user/:id        → Admin: delete user
```

### Products (`/api/products`)
```
GET    /products                → Get all products (supports ?category= and ?sort=)
GET    /products/:id            → Get single product by MongoDB ID
POST   /products/seed           → Admin: seed 33 default products
POST   /products                → Admin: create product
PUT    /products/:id            → Admin: update product
DELETE /products/:id            → Admin: soft-delete (sets isActive: false)
```

### Cart (`/api/cart`) — all require login
```
GET    /cart                    → Get my cart
POST   /cart/add                → Add item (increments if already exists)
PUT    /cart/update             → Update quantity (quantity 0 = remove)
DELETE /cart/remove/:productId  → Remove single item
DELETE /cart/clear              → Empty the cart
```

### Wishlist (`/api/wishlist`) — all require login
```
GET    /wishlist                       → Get my wishlist
POST   /wishlist/add                   → Add product
DELETE /wishlist/remove/:productId     → Remove product
DELETE /wishlist/clear                 → Clear wishlist
```

### Orders (`/api/orders`) — all require login
```
POST   /orders                   → Place order (clears cart after)
GET    /orders/my                → My order history
GET    /orders/:id               → Single order details
PUT    /orders/:id/cancel        → Cancel (only pending/processing)
GET    /orders/admin/all         → Admin: all orders
PUT    /orders/admin/:id/status  → Admin: update status
```

### Contact (`/api/contact`)
```
POST   /contact                  → Send support message (triggers email to admin)
```

---

## Environment Variables

```env
# Development (.env)
REACT_APP_API_URL=http://localhost:5000/api

# Production (.env.production)
REACT_APP_API_URL=https://groceria-backend.onrender.com/api
```

---

## Running Locally

```bash
# 1. Clone / navigate to project
cd "C:\Users\ARAVIND M\OneDrive\Desktop\Groceria\groceria"

# 2. Install dependencies
npm install

# 3. Make sure the backend is running first
#    (see backend README)

# 4. Start the dev server
npm start
# Opens http://localhost:3000
```

---

## Building for Production

```bash
npm run build
```

This creates an optimized `build/` folder. The `netlify.toml` and `public/_redirects` handle SPA routing so page refreshes work correctly on Vercel/Netlify.

---

## Deployment

The app is deployed on **Vercel** connected to `github.com/aravindm18092006/Groceria-frontend`.

Every push to `main` triggers an automatic redeploy. Vercel environment variable:
```
REACT_APP_API_URL = https://groceria-backend.onrender.com/api
```

---

## Admin Access

To access the admin dashboard:
- Login with `aravindm123@gmail.com`
- The Admin link appears in the navbar automatically when role is `admin`
- Go to `/admin`

To promote any user to admin, run this from the backend folder:
```bash
node set_admin.js user@example.com
```

---

## Known Quirks

- **Render cold start**: The backend on Render's free tier spins down after 15 minutes of inactivity. The first API call after that may take 30–60 seconds. This is normal.
- **Image override**: Product images are always taken from `defaultProducts.js` (not from MongoDB) by matching the product name. This ensures images are always correct even if the DB has stale URLs.
- **SMTP blocked**: If you're on a college/corporate network, password reset emails may not arrive. The forgot-password page handles this gracefully with a direct link.

---

*Groceria — Built with ❤️ at SECE Campus, Coimbatore*
