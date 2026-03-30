import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Package, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className={`relative transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className={`fixed flex flex-col bg-primary-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-700">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-lg tracking-tight">ProductApps</span>}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary-700 p-3 space-y-1">
          {!collapsed && user && (
            <div className="px-3 py-2 rounded-lg bg-primary-800">
              <p className="text-xs text-primary-300">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-200 hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-primary-700 hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-colors shadow"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>
    </aside>
  )
}

export const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/products', icon: Package, label: 'Products' },
]