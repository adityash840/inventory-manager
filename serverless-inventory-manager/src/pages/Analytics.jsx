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

const timeRanges = ['Last 6 months', 'Last year', 'Custom range']

export default function Analytics({ openDropdown, setOpenDropdown }) {
  const [analyticsData, setAnalyticsData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState(timeRanges[0])

  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        revenueData: [
          { month: 'Jan', revenue: 12500, growth: 12 },
          { month: 'Feb', revenue: 15800, growth: 15 },
          { month: 'Mar', revenue: 14200, growth: -8 },
          { month: 'Apr', revenue: 18900, growth: 25 },
          { month: 'May', revenue: 22100, growth: 18 },
          { month: 'Jun', revenue: 19800, growth: -12 }
        ],
        topProducts: [
          { name: 'Laptop', sales: 45, revenue: 44955 },
          { name: 'Wireless Mouse', sales: 38, revenue: 1139.62 },
          { name: 'Coffee Mug', sales: 32, revenue: 415.68 },
          { name: 'T-Shirt', sales: 28, revenue: 559.72 },
          { name: 'Desk Lamp', sales: 25, revenue: 1149.75 }
        ],
        customerSegments: [
          { segment: 'New', value: 35, color: '#3B82F6' },
          { segment: 'Returning', value: 45, color: '#10B981' },
          { segment: 'VIP', value: 20, color: '#F59E0B' }
        ],
        metrics: {
          totalRevenue: 82300,
          avgOrderValue: 156.80,
          customerRetention: 78.5,
          conversionRate: 12.3
        }
      }
      setAnalyticsData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
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
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+15.2%</span>
              </div>
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
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+8.7%</span>
              </div>
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
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 ml-1">+3.2%</span>
              </div>
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
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 ml-1">-1.5%</span>
              </div>
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
        </div>

        {/* Top Products */}
        <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Products</h3>
            <span className="text-sm text-slate-500">By revenue</span>
          </div>
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
        </div>
      </div>

      {/* Customer Segments */}
      <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Customer Segments</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Segment Breakdown</h4>
            {analyticsData.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                  <span className="font-medium text-slate-900">{segment.segment}</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{segment.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 