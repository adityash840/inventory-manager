import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always sign out any existing session on app load
    const forceSignOut = async () => {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error signing out on app load:', error)
      } finally {
        setUser(null)
        setLoading(false)
      }
    }
    forceSignOut()
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