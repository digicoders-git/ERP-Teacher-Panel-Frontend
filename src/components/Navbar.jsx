import { useState, useEffect } from 'react'
import { FaBars, FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ sidebarExpanded, setSidebarExpanded }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://erp-backend-0ab5.onrender.com/api/teacher-panel';
  const IMAGE_BASE_URL = BASE_URL.replace('/api/teacher-panel', '');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 fixed top-0 right-0 z-50 transition-all duration-300 ${
      sidebarExpanded ? 'left-64' : 'left-16'
    }`}>
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left Side - Toggle Button */}
          <div>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <FaBars className="text-lg" />
            </button>
          </div>

          {/* Right Side - Time, Date, Day & User Info */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-base font-semibold text-gray-800">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-600">
                {formatDate(currentTime)}
              </div>
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                  {currentTeacher.profileImage ? (
                    <img 
                      src={currentTeacher.profileImage.startsWith('http') 
                        ? currentTeacher.profileImage 
                        : `${IMAGE_BASE_URL}/${currentTeacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`
                      } 
                      alt={currentTeacher.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentTeacher.name ? currentTeacher.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{currentTeacher.name}</p>
                  <p className='text-xs text-gray-600'>Teacher</p>
                </div>
                <FaChevronDown className={`text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      navigate('/dashboard/profile')
                      setShowDropdown(false)
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 flex items-center space-x-2 transition-colors"
                  >
                    <FaUser className="text-indigo-600" />
                    <span>View Profile</span>
                  </button>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar