import { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Users,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { Listbox } from '@headlessui/react'
import { supabase } from '../lib/supabase'

const timeRanges = ['Last 6 months', 'Last year', 'Custom range']

export default function Analytics({ openDropdown, setOpenDropdown }) {
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    metrics: {
      totalRevenue: 0,
      avgOrderValue: 0,
      customerRetention: 0,
      conversionRate: 0,
    },
    topProducts: [],
    customerSegments: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRange, setSelectedRange] = useState(timeRanges[0])

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all sales
        const { data: sales, error } = await supabase
          .from('sales')
          .select('*');
        if (error) throw error;
        // Calculate total revenue and avg order value
        const totalRevenue = sales.reduce((sum, sale) => {
          const quantity = Number(sale.quantity);
          const price = Number(sale.price);
          if (!isFinite(quantity) || !isFinite(price)) return sum;
          return sum + (quantity * price);
        }, 0);
        const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
        // Revenue trend by month (last 6 months)
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: `${d.getFullYear()}-${d.getMonth() + 1}`,
            label: d.toLocaleString('default', { month: 'short' }),
            year: d.getFullYear(),
            month: d.getMonth() + 1,
          });
        }
        const revenueData = months.map(({ key, label, year, month }) => {
          const monthSales = sales.filter(sale => {
            const date = new Date(sale.sold_at || sale.created_at || sale.timestamp || sale.date);
            return date.getFullYear() === year && date.getMonth() + 1 === month;
          });
          const revenue = monthSales.reduce((sum, sale) => {
            const quantity = Number(sale.quantity);
            const price = Number(sale.price);
            if (!isFinite(quantity) || !isFinite(price)) return sum;
            return sum + (quantity * price);
          }, 0);
          return { month: label, revenue };
        });
        setAnalyticsData({
          revenueData,
          metrics: {
            totalRevenue,
            avgOrderValue,
            customerRetention: 0, // TODO: Implement real data
            conversionRate: 0,    // TODO: Implement real data
          },
          topProducts: [], // TODO: Implement real data
          customerSegments: [], // TODO: Implement real data
        });
      } catch (err) {
        setError('Failed to load analytics.');
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Visualize your sales and inventory data</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-500 dark:text-slate-300">{selectedRange}</span>
          <Listbox
            value={selectedRange}
            onChange={setSelectedRange}
            as="div"
            open={openDropdown === 'analytics-listbox'}
            onOpen={() => {
              setOpenDropdown('analytics-listbox')
            }}
            onClose={() => setOpenDropdown(null)}
          >
            <div className="relative w-48">
              <Listbox.Button className="w-full py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
                {selectedRange}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-40 border border-slate-200 dark:border-slate-700">
                {timeRanges.map((range) => (
                  <Listbox.Option
                    key={range}
                    value={range}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none py-2 px-4 text-slate-900 dark:text-slate-100 ${
                        active ? 'bg-blue-100 dark:bg-slate-700' : ''
                      } ${selected ? 'font-bold' : ''}`
                    }
                  >
                    {range}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(analyticsData.metrics.totalRevenue)}</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(analyticsData.metrics.avgOrderValue)}</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Customer Retention</p>
              <p className="text-2xl font-bold text-slate-900">{analyticsData.metrics.customerRetention}%</p>
              <p className="text-xs text-slate-400 mt-1">Coming soon</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-900">{analyticsData.metrics.conversionRate}%</p>
              <p className="text-xs text-slate-400 mt-1">Coming soon</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">Monthly</span>
            </div>
          </div>
          {analyticsData.revenueData && analyticsData.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={analyticsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">No revenue data</div>
          )}
        </div>

        {/* Top Products */}
        <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Products</h3>
            <span className="text-sm text-slate-500">By revenue</span>
          </div>
          {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">Coming soon</div>
          )}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Customer Segments</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {analyticsData.customerSegments && analyticsData.customerSegments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analyticsData.customerSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 w-full">Coming soon</div>
          )}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Segment Breakdown</h4>
            {analyticsData.customerSegments && analyticsData.customerSegments.length > 0 ? (
              analyticsData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="font-medium text-slate-900">{segment.segment}</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{segment.value}%</span>
                </div>
              ))
            ) : (
              <div className="text-slate-400">Coming soon</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 