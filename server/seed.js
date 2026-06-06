/*
  Seed script — fills your database with sample data so the app
  has something to show immediately.

  Run it once with:   node seed.js

  It creates:
   - 1 admin account   (email: admin@shopez.com / password: admin123)
   - 1 normal account  (email: user@shopez.com  / password: user123)
   - a set of sample products
   - the store categories + homepage banners
*/
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

dotenv.config();

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];

const banners = [
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
];

const products = [
  {
    name: 'Aurora Wireless Headphones',
    description:
      'Studio-grade over-ear headphones with active noise cancellation, 40-hour battery life, and plush memory-foam cushions. Built for long listening sessions.',
    price: 7999, discount: 20, category: 'Electronics', stock: 35, rating: 4.6, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    name: 'Meridian Leather Watch',
    description:
      'A minimalist timepiece with a genuine leather strap, sapphire-coated glass, and a Japanese quartz movement. Water resistant to 30m.',
    price: 5499, discount: 10, category: 'Fashion', stock: 22, rating: 4.4, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
  },
  {
    name: 'Terra Ceramic Mug Set',
    description:
      'Set of four hand-glazed stoneware mugs in earthy tones. Microwave and dishwasher safe. 350ml each.',
    price: 1299, discount: 0, category: 'Home', stock: 60, rating: 4.8, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
  },
  {
    name: 'Lumen Smart Desk Lamp',
    description:
      'Adjustable LED desk lamp with five brightness levels, three color temperatures, and a built-in USB charging port.',
    price: 2499, discount: 15, category: 'Home', stock: 40, rating: 4.5, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  },
  {
    name: 'Drift Running Shoes',
    description:
      'Lightweight breathable mesh running shoes with responsive cushioning and a durable rubber outsole. For everyday training.',
    price: 4299, discount: 25, category: 'Sports', stock: 50, rating: 4.3, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  },
  {
    name: 'Botanica Face Serum',
    description:
      'A hydrating vitamin-C serum with hyaluronic acid and green tea extract. Brightens and smooths skin. 30ml.',
    price: 1899, discount: 5, category: 'Beauty', stock: 70, rating: 4.7, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  },
  {
    name: 'Nomad Canvas Backpack',
    description:
      'Water-resistant 22L canvas backpack with a padded laptop sleeve, leather trims, and antique brass hardware.',
    price: 3299, discount: 30, category: 'Fashion', stock: 30, rating: 4.5, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  },
  {
    name: 'The Quiet Library (Hardcover)',
    description:
      'An award-winning novel about memory, time, and the choices that shape a life. 320 pages, hardcover edition.',
    price: 699, discount: 0, category: 'Books', stock: 100, rating: 4.9, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
  },
  {
    name: 'Pulse Bluetooth Speaker',
    description:
      'Compact waterproof speaker with 360-degree sound, 12-hour playtime, and deep bass in a pocket-sized form.',
    price: 2799, discount: 18, category: 'Electronics', stock: 45, rating: 4.4, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  },
  {
    name: 'Yoga Flow Mat',
    description:
      'Non-slip eco-friendly yoga mat with alignment markings, 6mm cushioning, and a carry strap. 183 x 61 cm.',
    price: 1599, discount: 10, category: 'Sports', stock: 55, rating: 4.6, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80',
  },
  {
    name: 'Glow Scented Candle',
    description:
      'Hand-poured soy wax candle with notes of sandalwood and vanilla. 45-hour burn time in a reusable amber jar.',
    price: 899, discount: 0, category: 'Home', stock: 80, rating: 4.7, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&q=80',
  },
  {
    name: 'Vertex Mechanical Keyboard',
    description:
      'A compact 75% mechanical keyboard with hot-swappable tactile switches, RGB backlight, and aluminium frame.',
    price: 5999, discount: 12, category: 'Electronics', stock: 28, rating: 4.5, numReviews: 0,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Admin.deleteMany();

    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    await User.create({
      name: 'Store Admin', email: 'admin@shopez.com', password: adminPass, isAdmin: true,
    });
    await User.create({
      name: 'Sample User', email: 'user@shopez.com', password: userPass, isAdmin: false,
    });

    await Product.insertMany(products);
    await Admin.create({ bannerImages: banners, categories });

    console.log('✅ Seed complete!');
    console.log('   Admin login: admin@shopez.com / admin123');
    console.log('   User login:  user@shopez.com  / user123');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
