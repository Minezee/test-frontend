import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Package, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const LoginPage = () => {
  const { isAuth, setAuth } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (isAuth) return <Navigate to="/home" replace />

  function validate() {
    let errs = {}

    if (!form.username.trim()) {
      errs.username = 'Username is required'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    }

    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length) {
      setError(errs);
      return;
    }

    setLoading(true)

    try {
      const { data } = await authService.login(form.username, form.password)
      setAuth(data, data.accessToken)
      toast.success(`Welcome back, ${data.firstName}!`)
      navigate('/home')
    } catch (err) {
      const msg = err.response?.data?.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ProductApp</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6 text-xs text-blue-700">
            <span className="font-medium">Data: </span> username <code className="bg-blue-100 px-1 rounded">emilys</code> / password <code className="bg-blue-100 px-1 rounded">emilyspass</code>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              error={error.username}
              autoComplete="username"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`input-field pr-10 ${error.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error.password && <p className="text-xs text-red-500">{error.password}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage