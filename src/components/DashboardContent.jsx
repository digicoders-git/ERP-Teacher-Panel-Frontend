import { 
  FaChalkboardTeacher, 
  FaClock, 
  FaTasks, 
  FaUserCheck, 
  FaBook, 
  FaBell,
  FaArrowRight 
} from 'react-icons/fa'

const DashboardContent = ({ setActiveTab }) => {
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')

  const dashboardCards = [
    {
      id: 'classes',
      title: 'My Classes',
      icon: FaChalkboardTeacher,
      count: currentTeacher.classes?.length || 3,
      color: 'bg-blue-500',
      description: 'Active Classes'
    },
    {
      id: 'timetable',
      title: 'Today\'s Schedule',
      icon: FaClock,
      count: 5,
      color: 'bg-green-500',
      description: 'Classes Today'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      icon: FaTasks,
      count: 12,
      color: 'bg-orange-500',
      description: 'Pending Review'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: FaUserCheck,
      count: 85,
      color: 'bg-purple-500',
      description: 'Average %'
    },
    {
      id: 'diary',
      title: 'E-Diary',
      icon: FaBook,
      count: 8,
      color: 'bg-teal-500',
      description: 'New Entries'
    },
    {
      id: 'notices',
      title: 'Notices',
      icon: FaBell,
      count: 3,
      color: 'bg-red-500',
      description: 'Unread'
    }
  ]

  const quickActions = [
    { id: 'classes', label: 'Manage Classes', icon: FaChalkboardTeacher },
    { id: 'assignments', label: 'Create Assignment', icon: FaTasks },
    { id: 'attendance', label: 'Mark Attendance', icon: FaUserCheck },
    { id: 'notices', label: 'Post Notice', icon: FaBell }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white p-6 rounded-lg mt-9 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentTeacher.name}!</h1>
        <p className="text-indigo-100">Subject: {currentTeacher.subject} | ID: {currentTeacher.teacherId}</p>
      </div>

      {/* Dashboard Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} text-white p-3 rounded-lg`}>
                    <IconComponent className="text-xl" />
                  </div>
                  <FaArrowRight className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{card.count}</span>
                  <span className="text-sm text-gray-600">{card.description}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <IconComponent className="text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-800">{action.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <FaTasks className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">New assignment submitted</p>
                <p className="text-sm text-gray-600">Class 10A - Mathematics - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <FaUserCheck className="text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Attendance marked</p>
                <p className="text-sm text-gray-600">Class 10B - Today's session - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <FaBell className="text-orange-600" />
              <div>
                <p className="font-medium text-gray-800">New notice posted</p>
                <p className="text-sm text-gray-600">Parent-Teacher Meeting - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent