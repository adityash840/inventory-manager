import { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  ShoppingCart,
  Users,
  Activity
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useDataStatus } from '../contexts/DataStatusContext'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    avgOrderValue: 0
  })
  const [recentSales, setRecentSales] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { setIsDemo } = useDataStatus()

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
      // Fetch sales
      let salesData = []
      let salesError = null
      let sales = []
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*, products(name)')
          .order('created_at', { ascending: false })
        if (error && error.message.includes('created_at')) {
          // Fallback to ordering by id if created_at doesn't exist
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('sales')
            .select('*, products(name)')
            .order('id', { ascending: false })
          sales = fallbackData || []
          salesError = fallbackError
        } else {
          sales = data || []
          salesError = error
        }
      } catch (err) {
        sales = []
        salesError = err
      }
      salesData = sales
      // Debug: log sales data to help diagnose NaN
      console.log('Dashboard salesData:', salesData)
      if (productsError) {
        setIsDemo(true)
        setStats({ totalProducts: 0, totalSales: 0, totalRevenue: 0, lowStockItems: 0, avgOrderValue: 0 })
        setRecentSales([])
        setLowStockProducts([])
      } else {
        setIsDemo(false)
        const productsData = products || []
        const lowStockItems = productsData.filter(p => p.quantity < 10)
        const totalRevenue = Array.isArray(salesData) && salesData.length > 0
          ? salesData.reduce((sum, sale) => {
              const quantity = Number(sale.quantity);
              const price = Number(sale.price);
              if (!isFinite(quantity) || !isFinite(price)) return sum;
              return sum + (quantity * price);
            }, 0)
          : 0;
        const avgOrderValue = (Array.isArray(salesData) && salesData.length > 0 && isFinite(totalRevenue))
          ? totalRevenue / salesData.length
          : 0;
        setStats({
          totalProducts: productsData.length,
          totalSales: salesData.length,
          totalRevenue: totalRevenue,
          avgOrderValue: avgOrderValue,
          lowStockItems: lowStockItems.length
        })
        setRecentSales(salesData.slice(0, 5))
        setLowStockProducts(lowStockItems)
      }
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Helper to get product name from product_id
  function getProductName(sale) {
    return sale.products?.name || (typeof sale.product_id === 'string' && sale.product_id.length > 8 ? sale.product_id.slice(0, 8) : sale.product_id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Welcome to your inventory management dashboard</p>
        
        {/* Data Status Indicator */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-slate-800 dark:border-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {stats.totalProducts > 0 || stats.totalSales > 0
              ? "✅ Connected to Supabase - Using real data"
              : "🔄 Connected to Supabase - No data yet"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Products</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(Number.isFinite(stats.totalRevenue) ? stats.totalRevenue : 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Sales</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Low Stock Items</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(Number.isFinite(stats.avgOrderValue) ? stats.avgOrderValue : 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Sales</h2>
        {recentSales.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-300">No recent sales</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Sale ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {recentSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{typeof sale.id === 'string' && sale.id.length > 8 ? sale.id.slice(0, 8) : sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{getProductName(sale)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{formatCurrency(sale.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Low Stock Alerts</h2>
        {lowStockProducts.length === 0 ? (
          <div className="text-green-600 dark:text-green-400">No low stock products! 🎉</div>
        ) : (
          <ul className="space-y-2">
            {lowStockProducts.map(product => (
              <li key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">SKU: {product.sku}</span>
                </div>
                <span className="text-red-600 dark:text-red-200 font-bold">{product.quantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 