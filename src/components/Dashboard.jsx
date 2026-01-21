import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import DashboardContent from './DashboardContent'
import MyClasses from './MyClasses'
import TimeTable from './TimeTable'
import Assignment from './Assignment'
import StudentAttendance from './StudentAttendance'
import EDiary from './EDiary'
import NoticeUpdate from './NoticeUpdate'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent setActiveTab={setActiveTab} />
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
      default:
        return <DashboardContent setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarExpanded={sidebarExpanded}
      />
      
      {/* Main Content */}
      <div className={`pt-16 p-6 transition-all duration-300 ${
        sidebarExpanded ? 'ml-64' : 'ml-16'
      }`}>
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard