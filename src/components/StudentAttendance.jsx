import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { 
  FaUserCheck, 
  FaUsers, 
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaSave
} from 'react-icons/fa'

const StudentAttendance = () => {
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')
  
  // Initialize attendance data
  const initializeAttendanceData = () => {
    if (!localStorage.getItem('attendanceData')) {
      const attendanceData = {
        'Class 10A': [
          { id: 1, name: 'John Smith', rollNo: '001', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 2, name: 'Emma Johnson', rollNo: '002', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 3, name: 'Michael Brown', rollNo: '003', status: 'Absent', lastUpdated: '2024-01-15' },
          { id: 4, name: 'Sarah Davis', rollNo: '004', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 5, name: 'David Wilson', rollNo: '005', status: 'Late', lastUpdated: '2024-01-15' }
        ],
        'Class 10B': [
          { id: 6, name: 'Lisa Anderson', rollNo: '001', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 7, name: 'James Taylor', rollNo: '002', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 8, name: 'Anna Martinez', rollNo: '003', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 9, name: 'Robert Garcia', rollNo: '004', status: 'Absent', lastUpdated: '2024-01-15' }
        ],
        'Class 9A': [
          { id: 10, name: 'Jennifer Lee', rollNo: '001', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 11, name: 'Christopher White', rollNo: '002', status: 'Present', lastUpdated: '2024-01-15' },
          { id: 12, name: 'Amanda Clark', rollNo: '003', status: 'Late', lastUpdated: '2024-01-15' }
        ]
      }
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData))
    }
  }

  initializeAttendanceData()
  const [attendanceData, setAttendanceData] = useState(JSON.parse(localStorage.getItem('attendanceData') || '{}'))
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [editMode, setEditMode] = useState(false)
  const studentListRef = useRef(null)

  const classes = Object.keys(attendanceData)
  const currentStudents = attendanceData[selectedClass] || []
  
  // Calculate stats
  const totalStudents = currentStudents.length
  const presentStudents = currentStudents.filter(s => s.status === 'Present').length
  const absentStudents = currentStudents.filter(s => s.status === 'Absent').length
  const lateStudents = currentStudents.filter(s => s.status === 'Late').length
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  const handleStatusChange = (studentId, newStatus) => {
    const updatedData = {
      ...attendanceData,
      [selectedClass]: attendanceData[selectedClass].map(student =>
        student.id === studentId 
          ? { ...student, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
          : student
      )
    }
    setAttendanceData(updatedData)
    localStorage.setItem('attendanceData', JSON.stringify(updatedData))
  }

  const handleSaveAttendance = () => {
    setEditMode(false)
    toast.success('Attendance saved successfully!')
  }

  const handleMarkAllPresent = () => {
    const updatedData = {
      ...attendanceData,
      [selectedClass]: attendanceData[selectedClass].map(student => ({
        ...student,
        status: 'Present',
        lastUpdated: new Date().toISOString().split('T')[0]
      }))
    }
    setAttendanceData(updatedData)
    localStorage.setItem('attendanceData', JSON.stringify(updatedData))
    toast.success('All students marked as present!')
  }

  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800'
      case 'Absent': return 'bg-red-100 text-red-800'
      case 'Late': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <FaCheckCircle className="text-green-600" />
      case 'Absent': return <FaTimesCircle className="text-red-600" />
      case 'Late': return <FaClock className="text-yellow-600" />
      default: return <FaClock className="text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Student Attendance</h1>
            <p className="text-purple-100">Track and manage student attendance</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditMode(!editMode)
                if (!editMode && studentListRef.current) {
                  setTimeout(() => {
                    studentListRef.current.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    })
                  }, 100)
                }
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition flex items-center space-x-2 cursor-pointer"
            >
              <FaEdit />
              <span>{editMode ? 'View Mode' : 'Mark Attendence'}</span>
            </button>
            {editMode && (
              <button 
                onClick={handleSaveAttendance}
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center space-x-2 cursor-pointer"
              >
                <FaSave />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Select Class</h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleMarkAllPresent}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
            >
              Mark All Present
            </button>
            
          </div>
        </div>
        <div className="flex space-x-2">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedClass === className
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Present</h3>
              <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Absent</h3>
              <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div ref={studentListRef} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedClass} - Attendance ({new Date().toLocaleDateString()})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                {editMode && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center" title={`Roll Number: ${student.rollNo}`}>
                      <span className="text-sm font-semibold text-gray-600">{student.rollNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900" title={`Student: ${student.name}`}>{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`} title={`Status: ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={`Last updated on ${student.lastUpdated}`}>
                    {student.lastUpdated}
                  </td>
                  {editMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`p-2 rounded ${student.status === 'Present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'} transition`}
                          title="Mark as Present"
                        >
                          <FaCheckCircle className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`p-2 rounded ${student.status === 'Absent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'} transition`}
                          title="Mark as Absent"
                        >
                          <FaTimesCircle className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`p-2 rounded ${student.status === 'Late' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'} transition`}
                          title="Mark as Late"
                        >
                          <FaClock className="text-sm" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {currentStudents.length === 0 && (
          <div className="text-center py-8">
            <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No students found for {selectedClass}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentAttendance