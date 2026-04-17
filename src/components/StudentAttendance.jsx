import { useState, useEffect, useRef } from 'react'
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
  FaSave,
  FaSpinner
} from 'react-icons/fa'
import { getDashboardStats, markAttendance, getStudentsForAttendance, getAttendanceByClass } from '../api'

const StudentAttendance = () => {
  const [assignedClass, setAssignedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const studentListRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (assignedClass) {
      fetchStudentsAndAttendance()
    }
  }, [assignedClass, selectedDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getDashboardStats()
      console.log('Dashboard response:', response.data)
      
      if (response.data.success && response.data.data.teacher.assignedClass) {
        const classData = response.data.data.teacher.assignedClass
        console.log('Assigned class:', classData)
        setAssignedClass(classData)
      } else {
        setError('No assigned class found')
        toast.error('No assigned class found')
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      setError(error.message)
      toast.error('Failed to load class information')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true)
      
      console.log('Fetching students for class:', assignedClass.id, 'section:', assignedClass.sectionId)
      
      // First fetch all students for the class
      const studentsResponse = await getStudentsForAttendance(
        assignedClass.id, 
        assignedClass.sectionId
      )
      
      console.log('Students response:', studentsResponse.data)
      
      if (studentsResponse.data.success) {
        const allStudents = studentsResponse.data.data || []
        console.log('All students:', allStudents)
        
        // Then fetch attendance for the selected date
        const attendanceResponse = await getAttendanceByClass(
          assignedClass.id, 
          assignedClass.sectionId, 
          selectedDate
        )
        
        console.log('Attendance response:', attendanceResponse.data)
        
        if (attendanceResponse.data.success) {
          const attendanceRecords = attendanceResponse.data.data || []
          
          // Create attendance map
          const attMap = {}
          attendanceRecords.forEach(record => {
            attMap[record.studentId] = record.status
          })
          
          // Initialize attendance data
          const initData = {}
          allStudents.forEach(student => {
            initData[student.studentId] = attMap[student.studentId] || 'present'
          })
          
          setStudents(allStudents)
          setAttendanceData(initData)
        } else {
          setStudents(allStudents)
          const initData = {}
          allStudents.forEach(student => {
            initData[student.studentId] = 'present'
          })
          setAttendanceData(initData)
        }
      } else {
        setStudents([])
        setAttendanceData({})
        toast.error(studentsResponse.data.message || 'Failed to load students')
      }
    } catch (error) {
      console.error('Error fetching students and attendance:', error)
      console.error('Error response:', error.response?.data)
      toast.error('Failed to load students: ' + (error.response?.data?.message || error.message))
      setStudents([])
      setAttendanceData({})
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: newStatus
    })
  }

  const handleSaveAttendance = async () => {
    try {
      if (!assignedClass) {
        toast.error('No assigned class found')
        return
      }

      const attendanceRecords = students.map(student => ({
        studentId: student.studentId,
        status: attendanceData[student.studentId] || 'present'
      }))

      const response = await markAttendance({
        date: selectedDate,
        classId: assignedClass.id,
        sectionId: assignedClass.sectionId,
        attendanceData: attendanceRecords
      })

      if (response.data.success) {
        setEditMode(false)
        toast.success('✅ Attendance saved successfully!')
        fetchStudentsAndAttendance()
      } else {
        toast.error(response.data.message || 'Failed to save attendance')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast.error('Failed to save attendance: ' + error.message)
    }
  }

  const handleMarkAllPresent = () => {
    const newData = {}
    students.forEach(student => {
      newData[student.studentId] = 'present'
    })
    setAttendanceData(newData)
    toast.success('All students marked as present!')
  }

  const handleMarkAllAbsent = () => {
    const newData = {}
    students.forEach(student => {
      newData[student.studentId] = 'absent'
    })
    setAttendanceData(newData)
    toast.success('All students marked as absent!')
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      case 'half-day': return 'bg-blue-100 text-blue-800'
      case 'leave': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      'present': 'Present',
      'absent': 'Absent',
      'late': 'Late',
      'half-day': 'Half Day',
      'leave': 'Leave'
    }
    return labels[status?.toLowerCase()] || 'Not Marked'
  }

  const totalStudents = students.length
  const presentStudents = Object.values(attendanceData).filter(s => s?.toLowerCase() === 'present').length
  const absentStudents = Object.values(attendanceData).filter(s => s?.toLowerCase() === 'absent').length
  const lateStudents = Object.values(attendanceData).filter(s => s?.toLowerCase() === 'late').length
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  if (loading && !assignedClass) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading attendance...</p>
        </div>
      </div>
    )
  }

  if (error && !assignedClass) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📋 Student Attendance</h1>
            <p className="text-indigo-100">Track and manage student attendance for your class</p>
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
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <FaEdit />
              <span>{editMode ? 'View Mode' : 'Mark Attendance'}</span>
            </button>
            {editMode && (
              <button 
                onClick={handleSaveAttendance}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <FaSave />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Class, Section, Stream and Date Selection */}
      {assignedClass && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-lg font-semibold text-blue-900">{assignedClass.name}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stream</label>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-lg font-semibold text-purple-900">
                  {assignedClass.stream && assignedClass.stream.length > 0 
                    ? assignedClass.stream.join(', ') 
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Code</label>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-lg font-semibold text-green-900">{assignedClass.code || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {editMode && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex space-x-2">
          <button 
            onClick={handleMarkAllPresent}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
          >
            Mark All Present
          </button>
          <button 
            onClick={handleMarkAllAbsent}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Mark All Absent
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Total</h3>
              <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Present</h3>
              <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Absent</h3>
              <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Late</h3>
              <p className="text-2xl font-bold text-yellow-600">{lateStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Rate</h3>
              <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div ref={studentListRef} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          📚 Attendance Record - {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-indigo-600" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-5xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No students found in this class</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stream</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  {editMode && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.studentId} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{student.rollNo || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{assignedClass?.name || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {assignedClass?.stream && assignedClass.stream.length > 0 
                          ? assignedClass.stream.join(', ') 
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendanceData[student.studentId] || 'present')}`}>
                        {getStatusLabel(attendanceData[student.studentId] || 'present')}
                      </span>
                    </td>
                    {editMode && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleStatusChange(student.studentId, 'present')}
                            className={`p-2 rounded transition ${attendanceData[student.studentId]?.toLowerCase() === 'present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                            title="Mark as Present"
                          >
                            <FaCheckCircle className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.studentId, 'absent')}
                            className={`p-2 rounded transition ${attendanceData[student.studentId]?.toLowerCase() === 'absent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                            title="Mark as Absent"
                          >
                            <FaTimesCircle className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.studentId, 'late')}
                            className={`p-2 rounded transition ${attendanceData[student.studentId]?.toLowerCase() === 'late' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'}`}
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
        )}
      </div>
    </div>
  )
}

export default StudentAttendance
