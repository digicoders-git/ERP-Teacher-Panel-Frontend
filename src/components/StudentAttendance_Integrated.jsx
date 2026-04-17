import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
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
import { 
  getAttendanceByClass, 
  markAttendance, 
  bulkUpdateAttendance,
  getTeacherClasses
} from '../api'

  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedClassLabel, setSelectedClassLabel] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const resp = await getTeacherClasses()
      if (resp.data.success && resp.data.data.length > 0) {
        setClasses(resp.data.data)
        const first = resp.data.data[0]
        setSelectedClass(first.classId)
        setSelectedSection(first.sectionId)
        setSelectedClassLabel(first.name)
      }
    } catch (err) {
      toast.error('Failed to load teacher classes')
    }
  }

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchAttendance()
    }
  }, [selectedClass, selectedSection, selectedDate])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await getAttendanceByClass(selectedClass, selectedSection, selectedDate)
      if (response.data.success) {
        setStudents(response.data.data)
        const attMap = {}
        response.data.data.forEach(s => {
          attMap[s.studentId] = s.status
        })
        setAttendance(attMap)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast.error('Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: newStatus
    }))
  }

  const handleSaveAttendance = async () => {
    try {
      const attendanceData = students.map(s => ({
        studentId: s.studentId,
        status: attendance[s.studentId] || 'not_marked'
      }))

      await markAttendance({
        date: selectedDate,
        classId: selectedClass,
        sectionId: selectedSection,
        attendanceData
      })

      setEditMode(false)
      toast.success('Attendance saved successfully!')
      fetchAttendance()
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast.error('Failed to save attendance')
    }
  }

  const handleMarkAllPresent = async () => {
    try {
      await bulkUpdateAttendance({
        date: selectedDate,
        classId: selectedClass,
        sectionId: selectedSection,
        status: 'present'
      })
      toast.success('All students marked as present!')
      fetchAttendance()
    } catch (error) {
      toast.error('Failed to mark all present')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <FaCheckCircle className="text-green-600" />
      case 'absent': return <FaTimesCircle className="text-red-600" />
      case 'late': return <FaClock className="text-yellow-600" />
      default: return <FaClock className="text-gray-600" />
    }
  }

  const totalStudents = students.length
  const presentStudents = Object.values(attendance).filter(s => s === 'present').length
  const absentStudents = Object.values(attendance).filter(s => s === 'absent').length
  const lateStudents = Object.values(attendance).filter(s => s === 'late').length
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
                    studentListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition flex items-center space-x-2 cursor-pointer"
            >
              <FaEdit />
              <span>{editMode ? 'View Mode' : 'Mark Attendance'}</span>
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

      {/* Class & Date Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={`${selectedClass}-${selectedSection}`}
              onChange={(e) => {
                const [cid, sid] = e.target.value.split('-')
                setSelectedClass(cid)
                setSelectedSection(sid)
                const found = classes.find(c => c.classId === cid && c.sectionId === sid)
                if (found) setSelectedClassLabel(found.name)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {classes.map(cls => (
                <option key={`${cls.classId}-${cls.sectionId}`} value={`${cls.classId}-${cls.sectionId}`}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {editMode && (
          <button 
            onClick={handleMarkAllPresent}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition"
          >
            Mark All Present
          </button>
        )}
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
          {selectedClassLabel} - Attendance ({selectedDate})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {editMode && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">{student.rollNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendance[student.studentId] || 'not_marked')}`}>
                      {attendance[student.studentId] || 'Not Marked'}
                    </span>
                  </td>
                  {editMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'present')}
                          className={`p-2 rounded ${attendance[student.studentId] === 'present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'} transition`}
                          title="Mark as Present"
                        >
                          <FaCheckCircle className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'absent')}
                          className={`p-2 rounded ${attendance[student.studentId] === 'absent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'} transition`}
                          title="Mark as Absent"
                        >
                          <FaTimesCircle className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, 'late')}
                          className={`p-2 rounded ${attendance[student.studentId] === 'late' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'} transition`}
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
        
        {students.length === 0 && (
          <div className="text-center py-8">
            <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No students found for {selectedClassLabel}</p>
          </div>
        )}
      </div>
    </div>
  )


export default StudentAttendance
