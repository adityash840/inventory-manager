# Setup Guide

## Current Status
The app is now running in demo mode with mock data. To enable full functionality with Supabase:

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

## 2. Set Environment Variables
Create a `.env` file in the root directory with:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 3. Database Schema
Run these SQL commands in your Supabase SQL editor:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  sku TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO products (name, description, price, quantity, category, sku) VALUES
('Laptop', 'High-performance laptop', 999.99, 15, 'Electronics', 'LAP001'),
('T-Shirt', 'Cotton t-shirt', 19.99, 50, 'Clothing', 'TSH001'),
('Coffee Mug', 'Ceramic coffee mug', 12.99, 30, 'Home & Garden', 'MUG001');
```

## 4. Enable Authentication
1. Go to Authentication > Settings in Supabase
2. Enable Email auth
3. Create a user or enable sign-ups

## 5. Re-enable Authentication
Once Supabase is configured, update the App.jsx to use authentication:

```jsx
// In App.jsx, uncomment the AuthProvider and ProtectedRoute
import { AuthProvider, useAuth } from './contexts/AuthContext'
// ... rest of the authentication code
```

## 6. Deploy to Vercel
1. Add environment variables in Vercel dashboard
2. Deploy using: `vercel --prod`

The app will work in demo mode until you complete these steps! 