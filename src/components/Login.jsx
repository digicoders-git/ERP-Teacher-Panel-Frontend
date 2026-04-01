import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [teacherId, setTeacherId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Demo teacher data in localStorage
  const initializeTeacherData = () => {
    if (!localStorage.getItem('teacherData')) {
      const teacherData = {
        teacherId: 'T001',
        password: 'teacher123',
        name: 'John Doe',
        subject: 'Mathematics',
        classes: ['Class 10A', 'Class 10B', 'Class 9A']
      }
      localStorage.setItem('teacherData', JSON.stringify(teacherData))
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    
    initializeTeacherData()
    
    const storedData = JSON.parse(localStorage.getItem('teacherData'))
    
    if (teacherId === storedData.teacherId && password === storedData.password) {
      localStorage.setItem('teacherAuth', 'true')
      localStorage.setItem('currentTeacher', JSON.stringify(storedData))
      toast.success('Login successful!')
      setLoading(false)
      
      // Force a storage event to trigger re-render
      window.dispatchEvent(new Event('storage'))
      
      // Navigate after a brief delay to ensure state updates
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 100)
    } else {
      toast.error('Invalid Teacher ID or Password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-indigo-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Login</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher ID
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your Teacher ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login