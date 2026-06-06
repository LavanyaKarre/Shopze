<div align="center">

# 🛍️ ShopEZ

### A full-stack e-commerce platform built with the MERN stack

Browse a curated catalog, add to cart, check out in seconds, and track every order —
with a complete admin panel to manage products and fulfil orders.

![Stack](https://img.shields.io/badge/Stack-MERN-d6492f)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-2f6b4f)
![React](https://img.shields.io/badge/Frontend-React%20+%20Vite-d9a521)
![License](https://img.shields.io/badge/License-Student%20Project-555)

</div>

---

## 📖 Overview

ShopEZ is an online shopping platform where customers can discover products, manage a cart, and
place orders, while admins manage the catalog and orders from a dedicated dashboard. It is built
following the **Model–View–Controller (MVC)** architecture on the backend for clean separation of
concerns, modularity, and easy collaboration.

---

## ✨ Features

### 👤 Customer
- Register and log in with secure JWT authentication
- Browse the product catalog with **live search** and **category filters**
- View detailed product pages with descriptions, pricing, discounts, and **customer reviews**
- **"Shop Now"** for instant checkout, or **"Add to Cart"** to keep browsing
- Manage the cart with quantity controls
- Checkout with shipping address, payment method, and special requirements
- Receive an **order confirmation** with full order details
- View complete **order history** in the profile section

### 🛠️ Admin
- Dashboard with revenue, orders, and user statistics
- Full **product CRUD** — add, edit, and delete products
- View all customer orders and **update order status** (Pending → Confirmed → Shipped → Delivered)
- Manage store **categories** and homepage **banners**

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | MongoDB (Atlas cloud) with Mongoose ODM |
| **Backend** | Node.js + Express (MVC pattern) |
| **Frontend** | React 18 + Vite + React Router |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt password hashing |
| **HTTP Client** | Axios |
| **Notifications** | react-toastify |

---

## 🏗️ Architecture — MVC Pattern

The backend separates the application into three layers:

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| **Model** | `server/models` | Mongoose schemas defining data structure and database operations |
| **Controller** | `server/controllers` | Business logic — processes requests, talks to models, returns responses |
| **View** | `server/routes` | REST API endpoints that map HTTP requests to controller functions |

This makes the codebase modular, testable, scalable, and collaboration-friendly — multiple
developers can work on different layers without conflicts.

---

## 📁 Project Structure

```
shopez/
├── server/                      # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/                  # MODEL — Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── controllers/             # CONTROLLER — business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── routes/                  # VIEW — API endpoints
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT protection + admin guard
│   ├── seed.js                  # Loads sample data
│   ├── server.js                # Entry point
│   └── .env                     # Secrets (not committed)
│
└── client/                      # Frontend (React + Vite)
    └── src/
        ├── context/             # AuthContext, CartContext (global state)
        ├── services/
        │   └── api.js           # All API calls (axios)
        ├── components/          # Navbar, Footer, ProductCard, ProtectedRoute
        └── pages/               # Home, Login, Register, ProductDetails,
            └── admin/           #   Cart, Checkout, OrderConfirmation,
                                 #   Profile, admin/AdminDashboard
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier)
- [Git](https://git-scm.com)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/shopez.git
cd shopez
```

### 2️⃣ Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/` (use `.env.example` as a template):
```env
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/shopez?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_string
```

Load sample data (run once):
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```
> Backend runs at **http://localhost:5000**

### 3️⃣ Frontend setup
Open a **second terminal**:
```bash
cd client
npm install
npm run dev
```
> Frontend runs at **http://localhost:5173**

### 4️⃣ Open the app
Visit **http://localhost:5173** in your browser.

---

## 🔑 Demo Accounts

After running the seed script, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@shopez.com` | `admin123` |
| **User** | `user@shopez.com` | `user123` |

> Admins are automatically redirected to the dashboard on login.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Create a new account | Public |
| POST | `/api/auth/login` | Log in | Public |
| GET | `/api/auth/profile` | Get current user | Protected |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products?search=&category=` | List / search products | Public |
| GET | `/api/products/:id` | Get a single product | Public |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |
| POST | `/api/products/:id/reviews` | Add a review | Protected |

### Cart
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get the user's cart | Protected |
| POST | `/api/cart` | Add an item | Protected |
| PUT | `/api/cart` | Update item quantity | Protected |
| DELETE | `/api/cart/:productId` | Remove an item | Protected |
| DELETE | `/api/cart/clear` | Empty the cart | Protected |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Place an order | Protected |
| GET | `/api/orders/myorders` | Get the user's orders | Protected |
| GET | `/api/orders/:id` | Get a single order | Protected |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/orders` | All orders | Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | Admin |
| GET | `/api/admin/users` | All registered users | Admin |
| GET | `/api/admin/settings` | Get categories + banners | Public |
| PUT | `/api/admin/settings` | Update categories + banners | Admin |

---

## 👥 Team Collaboration (GitHub)

After cloning, each teammate:
1. `cd server` → `npm install`
2. Create `server/.env` from `.env.example` and paste the **real** values (shared privately by the team lead)
3. `cd ../client` → `npm install`
4. Run the backend and frontend in two separate terminals

> Everyone shares the **same** `MONGO_URI` and `JWT_SECRET`, so the whole team works on a single
> cloud database. The `.env` file is **gitignored** and must never be committed — only `.env.example` goes to GitHub.

### Branch workflow
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
# ... make changes ...
git add .
git commit -m "Describe what you built"
git push origin feature/your-feature
# then open a Pull Request to merge into dev
```

---

## 🧪 Testing the Full Flow

1. Log in as the **user** → browse products → add to cart → checkout → place order
2. Check the order appears under **My Orders**
3. Log in as the **admin** → add a product → update an order's status → edit categories

---

## 📝 User Flow

```
Register → Login → Browse Products → Add to Cart → Checkout
   → Enter Address & Payment → Place Order → Order Confirmation → View in Profile
```

---

<div align="center">

Built with the **MERN stack** · A student project

</div>
