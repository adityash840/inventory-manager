import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-full w-72 flex-col sidebar bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex h-20 items-center justify-center border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Inventory Pro</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg dark:from-blue-900 dark:to-blue-800 dark:text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white dark:text-slate-400 dark:hover:bg-slate-700/70 dark:hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white dark:text-slate-500 dark:group-hover:text-white'
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 