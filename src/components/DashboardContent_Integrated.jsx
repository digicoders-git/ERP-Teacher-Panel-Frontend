import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  FaChalkboardTeacher, 
  FaClock, 
  FaTasks, 
  FaUserCheck, 
  FaBook, 
  FaBell,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa'
import { getDashboardStats } from '../api'

const DashboardContent = ({ setActiveTab }) => {
  const [currentTeacher, setCurrentTeacher] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await getDashboardStats()
      if (response.data.success) {
        setCurrentTeacher(response.data.data.teacher)
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const dashboardCards = stats ? [
    {
      id: 'classes',
      title: 'My Classes',
      icon: FaChalkboardTeacher,
      count: stats.stats.totalClasses,
      color: 'bg-blue-500',
      description: 'Active Classes'
    },
    {
      id: 'timetable',
      title: 'Today\'s Schedule',
      icon: FaClock,
      count: stats.stats.todayClassCount,
      color: 'bg-green-500',
      description: 'Classes Today'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      icon: FaTasks,
      count: stats.stats.pendingAssignments,
      color: 'bg-orange-500',
      description: 'Pending'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: FaUserCheck,
      count: stats.stats.attendanceRate,
      color: 'bg-purple-500',
      description: 'Average %'
    },
    {
      id: 'diary',
      title: 'E-Diary',
      icon: FaBook,
      count: stats.stats.totalStudents,
      color: 'bg-teal-500',
      description: 'Total Students'
    },
    {
      id: 'notices',
      title: 'Notices',
      icon: FaBell,
      count: stats.recentNotices.length,
      color: 'bg-red-500',
      description: 'Recent'
    }
  ] : []

  const quickActions = [
    { id: 'classes', label: 'Manage Classes', icon: FaChalkboardTeacher },
    { id: 'assignments', label: 'Create Assignment', icon: FaTasks },
    { id: 'attendance', label: 'Mark Attendance', icon: FaUserCheck },
    { id: 'notices', label: 'Post Notice', icon: FaBell }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white p-6 rounded-lg mt-9 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 animate-in slide-in-from-left duration-700">Welcome back, {currentTeacher?.name}!</h1>
          <div className="flex flex-wrap gap-4 text-indigo-100 font-medium">
            <p className="flex items-center gap-2">
              <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Class:</span> 
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{typeof currentTeacher?.assignedClass === 'object' && currentTeacher.assignedClass !== null ? (currentTeacher.assignedClass.className || currentTeacher.assignedClass.name || 'N/A') : (currentTeacher?.assignedClass || 'N/A')}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Section:</span> 
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{currentTeacher?.assignedSection?.sectionName || 'N/A'}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="opacity-60 text-xs uppercase tracking-widest font-bold">Subjects:</span> 
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{currentTeacher?.subjects?.join(', ') || 'N/A'}</span>
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
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

      {/* Upcoming Classes */}
      {stats?.upcomingClasses && stats.upcomingClasses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Classes</h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="space-y-4">
              {stats.upcomingClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {typeof cls.class === 'object' ? (cls.class?.className || cls.class?.name || '') : cls.class} {cls.section}
                    </p>
                    <p className="text-sm text-gray-600">{cls.subject} • {cls.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{cls.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Notices */}
      {stats?.recentNotices && stats.recentNotices.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notices</h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="space-y-3">
              {stats.recentNotices.map((notice) => (
                <div key={notice.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <FaBell className="text-orange-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{notice.title}</p>
                    <p className="text-sm text-gray-600">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Attendance Summary */}
      {stats?.todayAttendance && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Attendance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <p className="text-sm text-gray-600">Total Marked</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAttendance.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <p className="text-sm text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.todayAttendance.present}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <p className="text-sm text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.todayAttendance.absent}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <p className="text-sm text-yellow-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.todayAttendance.late}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardContent
