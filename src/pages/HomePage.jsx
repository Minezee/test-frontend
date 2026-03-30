import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 text-white">
        <p className="text-primary-100 text-sm">Good day 👋</p>
        <h2 className="text-2xl font-bold mt-1">
          Welcome, {user?.firstName} {user?.lastName}!
        </h2>
        <p className="text-primary-100 text-sm mt-2">
          Here's what's happening with your products today.
        </p>
        <Link
          to="/products"
          className="inline-block mt-4 bg-white text-primary-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          View Products
        </Link>
      </div>
    </div>
  )
}

export default HomePage
