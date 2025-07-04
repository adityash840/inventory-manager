import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Profile</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Account</p>
                <p className="text-sm text-gray-500">Inventory Manager User</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-500">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Change Password
            </button>
            
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Update Profile
            </button>
            
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Export Data
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Version</span>
              <span className="text-sm font-medium text-gray-900">1.0.0</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Database</span>
              <span className="text-sm font-medium text-gray-900">Supabase</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Documentation
            </button>
            
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Report Bug
            </button>
            
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              Feature Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 