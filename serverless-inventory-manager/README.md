# Serverless Inventory Manager

A modern, cloud-native inventory management system for small retailers built with React, Supabase, and Vercel.

## Features

- 🔐 **Secure Authentication** - Email/password login with Supabase Auth
- 📊 **Dashboard Analytics** - Sales charts and inventory overview
- 📦 **Inventory Management** - Add, edit, delete products with images
- 💰 **Sales Tracking** - Record sales and auto-update stock levels
- ⚠️ **Low Stock Alerts** - Get notified when products are running low
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean interface with Tailwind CSS

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **Deployment**: Vercel
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd serverless-inventory-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

Run this SQL in your Supabase SQL Editor:

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

-- Create policies (optional - for production)
create policy "Users can view all products" on products for select using (true);
create policy "Users can insert products" on products for insert with check (true);
create policy "Users can update products" on products for update using (true);
create policy "Users can delete products" on products for delete using (true);

create policy "Users can view all sales" on sales for select using (true);
create policy "Users can insert sales" on sales for insert with check (true);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── Topbar.jsx      # Top navigation bar
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── lib/               # Utility functions
│   ├── supabase.js    # Supabase client
│   └── utils.js       # Helper functions
├── pages/             # Page components
│   ├── Login.jsx      # Authentication page
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Inventory.jsx  # Product management
│   ├── Sales.jsx      # Sales tracking
│   ├── Alerts.jsx     # Low stock alerts
│   └── Settings.jsx   # User settings
└── App.jsx            # Main app component
```

## Features in Detail

### Dashboard
- Overview cards showing total products, sales, inventory value
- Line chart showing sales over time
- Pie chart showing product distribution by category

### Inventory Management
- Add new products with images
- Edit existing products
- Delete products
- View stock levels with color-coded indicators

### Sales Tracking
- Record sales transactions
- Automatic stock reduction
- Sales history with detailed information

### Low Stock Alerts
- Products with quantity < 10 are highlighted
- Critical alerts for products with ≤2 units
- Recommendations for restocking

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository.
