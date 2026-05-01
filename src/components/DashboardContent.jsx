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
  FaSpinner,
  FaMapMarkerAlt
} from 'react-icons/fa'
import { getDashboardStats } from '../api'

const DashboardContent = ({ setActiveTab }) => {
  const [currentTeacher, setCurrentTeacher] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDashboardStats()
      if (response.data.success) {
        setCurrentTeacher(response.data.data.teacher)
        setStats(response.data.data)
      } else {
        setError(response.data.message || 'Failed to load dashboard')
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      setError(error?.response?.data?.message || error.message)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Initializing Faculty Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-red-50 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">!</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Connection Error</h3>
          <p className="text-slate-500 mb-6 font-bold">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const dashboardCards = [
    {
      id: 'classes',
      title: 'My Classes',
      icon: FaChalkboardTeacher,
      count: stats?.stats?.totalClasses ?? 0,
      color: 'bg-blue-600',
      description: 'Active Groups'
    },
    {
      id: 'timetable',
      title: 'Today\'s Schedule',
      icon: FaClock,
      count: stats?.stats?.todayClassCount ?? 0,
      color: 'bg-indigo-600',
      description: 'Pending Sessions'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      icon: FaTasks,
      count: stats?.stats?.pendingAssignments ?? 0,
      color: 'bg-orange-600',
      description: 'Needs Review'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: FaUserCheck,
      count: `${stats?.stats?.attendanceRate ?? 0}%`,
      color: 'bg-emerald-600',
      description: 'Average Rate'
    }
  ]

  return (
    <div className="space-y-10 p-2 sm:p-0 pb-20">
      {/* Welcome Section - Academic Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-10 rounded-[2.5rem] mt-9 shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <FaChalkboardTeacher className="text-white text-xl" />
            </div>
            <span className="text-indigo-100 font-black uppercase tracking-[0.3em] text-xs">Faculty Portal</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Welcome, {currentTeacher?.name || 'Teacher'}!</h1>
          <div className="flex flex-wrap gap-3">
            {currentTeacher?.subjects?.map((sub, i) => (
              <span key={i} className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black border border-white/10 uppercase tracking-[0.1em]">
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* System Overview Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer border border-slate-50 hover:-translate-y-2"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`${card.color} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="text-2xl" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <FaArrowRight />
                  </div>
                </div>
                <h3 className="text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">{card.title}</h3>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-black text-slate-900 tabular-nums">{card.count}</span>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl">
                    {card.description}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upcoming Sessions */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Today's Schedule</h2>
          </div>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 min-h-[300px]">
            {stats?.upcomingClasses && stats.upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingClasses.map((cls) => (
                  <div key={cls.id} className="group flex items-center justify-between p-6 bg-slate-50 hover:bg-indigo-600 rounded-[2rem] transition-all duration-500 hover:shadow-xl hover:shadow-indigo-100">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <FaClock />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-white transition-colors text-lg">
                          {cls.class} {cls.section}
                        </p>
                        <p className="text-xs font-bold text-slate-400 group-hover:text-indigo-100 transition-colors uppercase tracking-widest mt-1">
                          {cls.subject} {cls.room && cls.room !== 'N/A' ? `• Room ${cls.room}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/10 group-hover:bg-white/20 px-4 py-2 rounded-xl border border-transparent group-hover:border-white/30 transition-all">
                      <p className="font-black text-indigo-600 group-hover:text-white text-sm tabular-nums">{cls.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-4 text-3xl">
                  <FaClock />
                </div>
                <p className="text-slate-400 font-bold">No sessions remaining today</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Notices */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Academic Notices</h2>
          </div>
          <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 min-h-[300px]">
            {stats?.recentNotices && stats.recentNotices.length > 0 ? (
              <div className="space-y-4">
                {stats.recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-center gap-6 p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 hover:border-orange-300 transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                      <FaBell />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-lg leading-tight mb-2">{notice.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-orange-100">
                          {new Date(notice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-4 text-3xl">
                  <FaBell />
                </div>
                <p className="text-slate-400 font-bold">No recent notices found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Analytics Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="w-1.5 h-8 bg-emerald-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Attendance Analytics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Marked', val: stats?.todayAttendance?.total ?? 0, color: 'indigo', pct: 100 },
            { label: 'Present', val: stats?.todayAttendance?.present ?? 0, color: 'emerald', pct: (stats?.todayAttendance?.present / stats?.todayAttendance?.total * 100) || 0 },
            { label: 'Absent', val: stats?.todayAttendance?.absent ?? 0, color: 'rose', pct: (stats?.todayAttendance?.absent / stats?.todayAttendance?.total * 100) || 0 },
            { label: 'Late Arrival', val: stats?.todayAttendance?.late ?? 0, color: 'amber', pct: (stats?.todayAttendance?.late / stats?.todayAttendance?.total * 100) || 0 }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-2 transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{item.label}</p>
              <p className="text-5xl font-black text-slate-900 tabular-nums mb-6">{item.val}</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    item.color === 'indigo' ? 'bg-indigo-600' : 
                    item.color === 'emerald' ? 'bg-emerald-500' : 
                    item.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-black text-slate-400 mt-4 text-right uppercase tracking-widest">{Math.round(item.pct)}% Ratio</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
