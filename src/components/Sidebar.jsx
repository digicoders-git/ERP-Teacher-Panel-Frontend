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
  FaUserCircle
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
    { id: 'diary', label: 'E-Diary', icon: FaBook },
    { id: 'notices', label: 'Notice Update', icon: FaBell }
  ]

  return (
    <div 
      className={`bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 ${
        sidebarExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
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

      {/* Menu Items */}
      <div className="flex-1 p-2">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition group cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={!sidebarExpanded ? item.label : ''}
              >
                <IconComponent className="text-lg flex-shrink-0" />
                {sidebarExpanded && (
                  <span className="font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-700">
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