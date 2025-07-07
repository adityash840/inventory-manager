import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLocation, useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = typeof window !== 'undefined' ? window.location : { pathname: '/' };
  // fallback for SSR or test
  const navigate = typeof window !== 'undefined' ? (path) => { window.location.href = path } : () => {};

  useEffect(() => {
    // On mount, check session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        // If not on /login or /register, force sign out and redirect to /login
        if (!['/login', '/register'].includes(location.pathname)) {
          if (session) {
            await supabase.auth.signOut();
          }
          setUser(null);
          setLoading(false);
          navigate('/login');
        } else {
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    };
    checkSession();
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      if (user && user.id !== 'demo-user') {
        await supabase.auth.signOut()
      }
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 