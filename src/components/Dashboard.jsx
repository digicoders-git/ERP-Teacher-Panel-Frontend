import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import DashboardContent from './DashboardContent'
import MyClasses from './MyClasses'
import TimeTable from './TimeTable'
import Assignment from './Assignment'
import StudentAttendance from './StudentAttendance'
import EDiary from './EDiary'
import NoticeUpdate from './NoticeUpdate'
import ParentAlerts from './ParentAlerts'
import Reports from './Reports'
import ELearning from './ELearning'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [loading, setLoading] = useState(false)

  // Sync tab with URL on mount / location change
  useEffect(() => {
    const pathPart = location.pathname.split('/')[2] // e.g., 'classes'
    if (pathPart && pathPart !== '') {
      setActiveTab(pathPart)
    } else {
      setActiveTab('dashboard')
    }
  }, [location])

  const handleTabChange = (newTab) => {
    setLoading(true)
    setTimeout(() => {
      setActiveTab(newTab)
      navigate(`/dashboard/${newTab}`)
      setLoading(false)
    }, 500)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent setActiveTab={handleTabChange} />
      case 'classes':
        return <MyClasses />
      case 'timetable':
        return <TimeTable />
      case 'assignments':
        return <Assignment />
      case 'attendance':
        return <StudentAttendance />
      case 'diary':
        return <EDiary />
      case 'notices':
        return <NoticeUpdate />
      case 'alerts':
        return <ParentAlerts />
      case 'reports':
        return <Reports />
      case 'elearning':
      case 'elearning-live':
      case 'elearning-videos':
      case 'elearning-quizzes':
      case 'elearning-resources':
        const subTab = activeTab.includes('-') ? activeTab.split('-')[1] : 'live'
        return <ELearning subTab={subTab} />
      default:
        return <DashboardContent setActiveTab={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        sidebarExpanded={sidebarExpanded}
      />

      {/* Main Content */}
      <div className={`pt-16 p-6 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'
        }`}>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  )
}

export default Dashboard