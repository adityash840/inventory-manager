# 🚀 Deployment Guide - Serverless Inventory Manager

## **Step 1: Set Up Supabase (Backend)**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project name: `inventory-manager`
6. Enter database password (save this!)
7. Choose region (closest to you)
8. Click "Create new project"

### 1.2 Get Your API Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Create `.env` file in your project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 1.3 Set Up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL:

```sql
-- Products Table
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  category text,
  price numeric not null,
  quantity integer not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Sales Table
create table sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  quantity integer not null,
  sold_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table products enable row level security;
alter table sales enable row level security;

-- Create policies for authenticated users
create policy "Users can view all products" on products for select using (true);
create policy "Users can insert products" on products for insert with check (true);
create policy "Users can update products" on products for update using (true);
create policy "Users can delete products" on products for delete using (true);

create policy "Users can view all sales" on sales for select using (true);
create policy "Users can insert sales" on sales for insert with check (true);
```

### 1.4 Enable Email Auth
1. Go to **Authentication** → **Settings**
2. Enable "Email confirmations" (optional)
3. Go to **Authentication** → **Users**
4. Create your first user account

---

## **Step 2: Deploy to Vercel**

### 2.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Serverless Inventory Manager"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-manager.git
git push -u origin main
```

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click "Deploy"

---

## **Step 3: Test Your Application**

### 3.1 Local Testing
1. Update your `.env` file with real Supabase credentials
2. Run `npm run dev`
3. Go to http://localhost:5173
4. Sign up with your email
5. Test all features

### 3.2 Production Testing
1. Go to your Vercel deployment URL
2. Sign up with your email
3. Test all features:
   - Add products
   - Record sales
   - View dashboard
   - Check alerts

---

## **Step 4: Add Sample Data**

### 4.1 Add Sample Products
In your Supabase SQL Editor, run:

```sql
INSERT INTO products (name, sku, category, price, quantity, image_url) VALUES
('iPhone 15 Pro', 'IPH15-PRO-128', 'Electronics', 999.99, 25, 'https://via.placeholder.com/300x300?text=iPhone+15+Pro'),
('MacBook Air M2', 'MAC-AIR-M2-256', 'Electronics', 1199.99, 15, 'https://via.placeholder.com/300x300?text=MacBook+Air'),
('AirPods Pro', 'AIRPODS-PRO', 'Electronics', 249.99, 50, 'https://via.placeholder.com/300x300?text=AirPods+Pro'),
('Nike Air Max', 'NIKE-AIR-MAX', 'Footwear', 129.99, 30, 'https://via.placeholder.com/300x300?text=Nike+Air+Max'),
('Coffee Maker', 'COFFEE-MAKER', 'Home', 89.99, 20, 'https://via.placeholder.com/300x300?text=Coffee+Maker');
```

---

## **Cost Breakdown**

### **Supabase (Free Tier)**
- 500MB database
- 2GB bandwidth
- 50,000 MAUs
- **Cost: $0/month**

### **Vercel (Free Tier)**
- Unlimited deployments
- 100GB bandwidth
- **Cost: $0/month**

### **Total Cost: $0/month** 🎉

---

## **Features Ready**

✅ **Authentication** - Email/password login  
✅ **Dashboard** - Analytics and charts  
✅ **Inventory Management** - Add/edit/delete products  
✅ **Sales Tracking** - Record sales with auto stock updates  
✅ **Low Stock Alerts** - Get notified when products run low  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Modern UI** - Clean, professional interface  

---

## **Support**

If you need help:
1. Check the [README.md](README.md) for detailed setup
2. Create an issue in the GitHub repository
3. Contact support at support@example.com

**Your inventory manager is now ready for production!** 🚀 