import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Login from './pages/Login'
import { DataStatusProvider } from './contexts/DataStatusContext'
import { useAuth } from './contexts/AuthContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Placeholder components for new pages
const Customers = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
      <p className="text-slate-600 mt-1">Manage your customer database and relationships</p>
    </div>
    <div className="card">
      <p className="text-slate-600">Customer management features coming soon...</p>
    </div>
  </div>
)

const Reports = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
      <p className="text-slate-600 mt-1">Generate detailed reports and insights</p>
    </div>
    <div className="card">
      <p className="text-slate-600">Advanced reporting features coming soon...</p>
    </div>
  </div>
)

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  console.log('ProtectedRoute: user =', user, 'loading =', loading)
  if (loading) return null // or a loading spinner
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataStatusProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/" element={<Dashboard />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </DataStatusProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
