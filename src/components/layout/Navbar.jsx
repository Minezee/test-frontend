import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { User } from 'lucide-react'

const pageTitles = {
  '/home': 'Dashboard',
  '/products': 'Products',
  '/products/add': 'Add Product',
}

export default function Navbar() {
  const { user } = useAuthStore()
  const { pathname } = useLocation()

  const title = pageTitles[pathname] || (pathname.includes('/products/') ? 'Product Detail' : 'App')

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
