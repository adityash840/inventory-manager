import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

export default function Alerts() {
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLowStock()
  }, [])

  const fetchLowStock = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lt('quantity', 10)
      .order('quantity', { ascending: true })
    if (!error) setLowStock(data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          Low Stock Alerts
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">Products with less than 10 units in stock</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
        {loading ? (
          <div className="text-center text-slate-500 dark:text-slate-300">Loading...</div>
        ) : lowStock.length === 0 ? (
          <div className="text-center text-green-600 dark:text-green-400">No low stock products! 🎉</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {lowStock.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">{product.quantity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{formatCurrency(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 