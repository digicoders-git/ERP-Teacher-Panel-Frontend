import { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa'

const Navbar = ({ sidebarExpanded, setSidebarExpanded }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')

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
            
            <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {currentTeacher.name ? currentTeacher.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 text-center">{currentTeacher.name}</p>
                <p className='text-sm text-gray-800'>Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar