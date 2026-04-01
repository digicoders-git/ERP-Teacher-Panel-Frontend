import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaClock,
  FaTasks,
  FaUserCheck,
  FaBook,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
  FaVideo,
  FaQuestionCircle,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaStar
} from 'react-icons/fa'

const Sidebar = ({ activeTab, setActiveTab, sidebarExpanded }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      localStorage.removeItem('teacherAuth')
      localStorage.removeItem('currentTeacher')
      toast.success('Logged out successfully!')
      window.dispatchEvent(new Event('storage'))
      navigate('/login')
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'classes', label: 'My Classes', icon: FaChalkboardTeacher },
    { id: 'timetable', label: 'Time Table', icon: FaClock },
    { id: 'assignments', label: 'Assignment', icon: FaTasks },
    { id: 'attendance', label: 'Student Attendance', icon: FaUserCheck },
    { id: 'my-attendance', label: 'My Attendance', icon: FaCalendarCheck },
    { id: 'my-salary', label: 'My Salary', icon: FaMoneyBillWave },
    { id: 'my-performance', label: 'My Performance', icon: FaStar },
    { id: 'diary', label: 'E-Diary', icon: FaBook },
    { id: 'library', label: 'Library', icon: FaBook, subItems: [
      { id: 'library-dashboard', label: 'Dashboard', icon: FaBook },
      { id: 'library-books', label: 'Books', icon: FaBook },
      { id: 'library-members', label: 'Members', icon: FaBook },
      { id: 'book-transactions', label: 'Transactions', icon: FaBook },
      { id: 'librarian-management', label: 'Librarians', icon: FaBook },
    ] },
    { id: 'notices', label: 'Notice Update', icon: FaBell },
    { id: 'alerts', label: 'Parent Alerts', icon: FaExclamationTriangle },
    { id: 'reports', label: 'Reports', icon: FaChartLine },
    {
      id: 'elearning',
      label: 'E-Learning',
      icon: FaPlay,
      subItems: [
        { id: 'elearning-live', label: 'Live Classes', icon: FaVideo },
        { id: 'elearning-videos', label: 'Video Classes', icon: FaPlay },
        { id: 'elearning-quizzes', label: 'Quizzes', icon: FaQuestionCircle },
        { id: 'elearning-resources', label: 'Resources', icon: FaBook },
      ]
    }
  ]

  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (id) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div
      className={`bg-gray-900 text-white h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-hide ${sidebarExpanded ? 'w-64' : 'w-16'
        }`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* Logo Section - Fixed */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg flex-shrink-0">
            <FaUserCircle className="text-xl" />
          </div>
          {sidebarExpanded && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">Teacher Panel</h1>
              <p className="text-xs text-gray-300 whitespace-nowrap">ERP System</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items - Scrollable */}
      <div className="flex-1 p-2 overflow-y-auto scrollbar-hide">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedMenus[item.id]
            const isActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeTab))

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.id)
                    } else {
                      setActiveTab(item.id)
                      const path = item.id === 'dashboard' ? '/dashboard' : `/dashboard/${item.id}`
                      navigate(path)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition group cursor-pointer ${isActive && !hasSubItems
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  title={!sidebarExpanded ? item.label : ''}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="text-lg flex-shrink-0" />
                    {sidebarExpanded && (
                      <span className="font-medium whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {sidebarExpanded && hasSubItems && (
                    isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>

                {sidebarExpanded && hasSubItems && isExpanded && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveTab(subItem.id)
                            navigate(`/dashboard/${subItem.id}`)
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition group cursor-pointer text-sm ${activeTab === subItem.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                          <SubIcon className="text-base flex-shrink-0" />
                          <span className="font-medium whitespace-nowrap overflow-hidden">
                            {subItem.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Logout Button - Fixed */}
      <div className="p-2 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          title={!sidebarExpanded ? 'Logout' : ''}
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {sidebarExpanded && (
            <span className="font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar