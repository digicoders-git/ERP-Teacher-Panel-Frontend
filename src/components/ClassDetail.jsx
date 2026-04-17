import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaArrowLeft,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaSpinner,
  FaCheckCircle,
  FaClock as FaClockAlt
} from 'react-icons/fa'
import { getTeacherClasses } from '../api'

const ClassDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const classId = location.pathname.split('/').pop()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (classId && classId !== 'class-detail') {
      fetchClassDetail()
    }
  }, [classId])

  const fetchClassDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getTeacherClasses()
      if (response.data.success) {
        const classes = response.data.data || []
        const found = classes.find(c => c.id === classId)
        if (found) {
          setClassData(found)
        } else {
          setError('Class not found')
          toast.error('Class not found')
        }
      } else {
        setError(response.data.message || 'Failed to load class')
        toast.error('Failed to load class')
      }
    } catch (error) {
      console.error('Error fetching class:', error)
      setError(error.message)
      toast.error('Failed to load class: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading class details...</p>
        </div>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">Error: {error || 'Class not found'}</p>
          <button
            onClick={() => navigate('/dashboard/classes')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Classes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/classes')}
        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
      >
        <FaArrowLeft />
        <span>Back to Classes</span>
      </button>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{classData.name}</h1>
            <p className="text-indigo-100 text-lg">Class Details & Information</p>
          </div>
          <FaChalkboardTeacher className="text-6xl opacity-30" />
        </div>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Class Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-2">
            <FaChalkboardTeacher className="text-blue-600 text-2xl" />
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Class</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{classData.class}</p>
        </div>

        {/* Section Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-2">
            <FaCalendarAlt className="text-green-600 text-2xl" />
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Section</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{classData.section}</p>
        </div>

        {/* Students Count */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center space-x-3 mb-2">
            <FaUsers className="text-purple-600 text-2xl" />
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Students</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{classData.students || 0}</p>
        </div>

        {/* Attendance */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center space-x-3 mb-2">
            <FaCheckCircle className="text-orange-600 text-2xl" />
            <h3 className="text-sm font-semibold text-gray-600 uppercase">Attendance</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{classData.attendance || 0}%</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Subject Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <FaBook className="text-indigo-600 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">Subject</h2>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-indigo-900">
                {classData.subject || 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Stream Card */}
          {classData.stream && classData.stream.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <FaChalkboardTeacher className="text-green-600 text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">Stream</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {classData.stream.map((stream, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold"
                  >
                    {stream}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Room/Section Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <FaCalendarAlt className="text-blue-600 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">Room/Section</h2>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-blue-900">
                {classData.room || 'Not assigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Schedule Card */}
          {classData.schedule && classData.schedule.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <FaClock className="text-purple-600 text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">Schedule</h2>
              </div>
              <div className="space-y-3">
                {classData.schedule.map((sched, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
                  >
                    <span className="font-semibold text-purple-900">{sched.day}</span>
                    <span className="text-purple-700">{sched.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">Status</h2>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                {classData.isAssigned ? '✓ Assigned Class' : '📋 Timetable Class'}
              </span>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <FaClockAlt className="text-orange-600 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">Attendance Rate</h2>
            </div>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    classData.attendance >= 80
                      ? 'bg-green-500'
                      : classData.attendance >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${classData.attendance || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  {classData.attendance || 0}% Present
                </span>
                <span className="text-sm text-gray-500">
                  {classData.attendance >= 80
                    ? '✓ Excellent'
                    : classData.attendance >= 60
                    ? '⚠ Good'
                    : '✗ Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-wrap gap-4">
        <button
          onClick={() => navigate(`/dashboard/attendance?class=${classData.id}`)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          <FaUsers />
          <span>Mark Attendance</span>
        </button>
        <button
          onClick={() => navigate(`/dashboard/assignments?class=${classData.id}`)}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          <FaBook />
          <span>Create Assignment</span>
        </button>
        <button
          onClick={() => navigate('/dashboard/classes')}
          className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          <FaArrowLeft />
          <span>Back to Classes</span>
        </button>
      </div>
    </div>
  )
}

export default ClassDetail
