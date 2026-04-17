import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { SlCalender } from "react-icons/sl"
import { 
  FaClock, 
  FaCalendarAlt, 
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaInfoCircle
} from 'react-icons/fa'
import { getAllTimetables, addTimetable, updateTimetable, deleteTimetable, getDashboardStats } from '../api'

const TimeTable = () => {
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [assignedClass, setAssignedClass] = useState(null)
  const itemsPerPage = 3
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get assigned class info
      const statsResponse = await getDashboardStats()
      if (statsResponse.data.success && statsResponse.data.data.teacher.assignedClass) {
        setAssignedClass(statsResponse.data.data.teacher.assignedClass)
      }
      
      // Get timetable
      const response = await getAllTimetables()
      if (response.data.success) {
        setTimetable(response.data.data || [])
      } else {
        setError(response.data.message || 'Failed to load timetable')
        toast.error('Failed to load timetable')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
      toast.error('Failed to load timetable: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Group timetable by day
  const timetableByDay = {}
  days.forEach(day => {
    timetableByDay[day] = timetable.filter(item => item.day === day)
  })

  // Pagination logic
  const totalPages = Math.ceil(days.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDays = days.slice(startIndex, endIndex)
  
  // Get today's classes
  const todaysClasses = timetableByDay[today] || []
  
  // Calculate stats
  const totalClasses = timetable.length
  const todayClassCount = todaysClasses.length

  const handleAddClass = async (day) => {
    if (!assignedClass) {
      toast.error('No assigned class found')
      return
    }

    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold; font-size: 1.3rem;"><i class="fas fa-plus-circle" style="color: #10b981; margin-right: 8px;"></i>Add Class for ${assignedClass.name}</div>`,
      html: `
        <div style="text-align: left; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 5px 0;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-clock" style="color: #3b82f6; margin-right: 6px;"></i>Start Time</label>
              <input id="startTime" class="swal2-input" placeholder="09:00" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-clock" style="color: #3b82f6; margin-right: 6px;"></i>End Time</label>
              <input id="endTime" class="swal2-input" placeholder="10:00" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-book" style="color: #f59e0b; margin-right: 6px;"></i>Subject</label>
              <input id="subject" class="swal2-input" placeholder="Subject" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-map-marker-alt" style="color: #ef4444; margin-right: 6px;"></i>Room</label>
              <input id="room" class="swal2-input" placeholder="Room 101" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 10px; padding: 8px; background: #dbeafe; border-radius: 6px;">
            <small style="color: #1e40af; font-weight: 500;"><i class="fas fa-calendar-alt" style="margin-right: 4px;"></i>Class: <strong>${assignedClass.name}</strong> | Day: <strong>${day}</strong></small>
          </div>
        </div>
      `,
      width: '500px',
      focusConfirm: false,
      confirmButtonText: '<i class="fas fa-check"></i> Add Class',
      cancelButtonText: '<i class="fas fa-times"></i> Cancel',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const startTime = document.getElementById('startTime').value
        const endTime = document.getElementById('endTime').value
        const subject = document.getElementById('subject').value
        const room = document.getElementById('room').value
        
        if (!startTime || !endTime || !subject || !room) {
          Swal.showValidationMessage('Please fill in all fields')
          return false
        }
        
        return {
          startTime,
          endTime,
          subject,
          room
        }
      }
    })
    
    if (formValues) {
      try {
        const response = await addTimetable({
          day,
          startTime: formValues.startTime,
          endTime: formValues.endTime,
          subject: formValues.subject,
          room: formValues.room,
          classId: assignedClass.id
        })
        
        if (response.data.success) {
          toast.success(`Class added to ${day} successfully!`)
          fetchData()
        } else {
          toast.error(response.data.message || 'Failed to add class')
        }
      } catch (error) {
        console.error('Error adding class:', error)
        toast.error('Failed to add class: ' + error.message)
      }
    }
  }

  const handleEditClass = async (classItem) => {
    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold; font-size: 1.3rem;"><i class="fas fa-edit" style="color: #3b82f6; margin-right: 8px;"></i>Edit Class</div>`,
      html: `
        <div style="text-align: left; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 5px 0;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-clock" style="color: #3b82f6; margin-right: 6px;"></i>Start Time</label>
              <input id="startTime" class="swal2-input" value="${classItem.startTime || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-clock" style="color: #3b82f6; margin-right: 6px;"></i>End Time</label>
              <input id="endTime" class="swal2-input" value="${classItem.endTime || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-book" style="color: #f59e0b; margin-right: 6px;"></i>Subject</label>
              <input id="subject" class="swal2-input" value="${classItem.subject || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-map-marker-alt" style="color: #ef4444; margin-right: 6px;"></i>Room</label>
              <input id="room" class="swal2-input" value="${classItem.room || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
        </div>
      `,
      width: '500px',
      focusConfirm: false,
      confirmButtonText: '<i class="fas fa-check"></i> Update Class',
      cancelButtonText: '<i class="fas fa-times"></i> Cancel',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const startTime = document.getElementById('startTime').value
        const endTime = document.getElementById('endTime').value
        const subject = document.getElementById('subject').value
        const room = document.getElementById('room').value
        
        if (!startTime || !endTime || !subject || !room) {
          Swal.showValidationMessage('Please fill in all fields')
          return false
        }
        
        return {
          startTime,
          endTime,
          subject,
          room
        }
      }
    })
    
    if (formValues) {
      try {
        const response = await updateTimetable(classItem._id, formValues)
        
        if (response.data.success) {
          toast.success('Class updated successfully!')
          fetchData()
        } else {
          toast.error(response.data.message || 'Failed to update class')
        }
      } catch (error) {
        console.error('Error updating class:', error)
        toast.error('Failed to update class: ' + error.message)
      }
    }
  }

  const handleDeleteClass = async (classItem) => {
    const result = await Swal.fire({
      title: 'Delete Class?',
      text: `Remove this class?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    })

    if (result.isConfirmed) {
      try {
        const response = await deleteTimetable(classItem._id)
        
        if (response.data.success) {
          toast.success('Class deleted successfully!')
          fetchData()
        } else {
          toast.error(response.data.message || 'Failed to delete class')
        }
      } catch (error) {
        console.error('Error deleting class:', error)
        toast.error('Failed to delete class: ' + error.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading timetable...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchTimetable}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white p-6 mt-9 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className='mx-2'>
            <h1 className="text-2xl font-bold mb-2">Time Table</h1>
            <p className="text-green-100">Manage your weekly schedule</p>
          </div>
          <div className="text-right mr-3">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <SlCalender className="text-white text-lg" />
              <p className="text-md text-white">Today is</p>
            </div>
            <p className="text-xl font-bold">{today}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaClock className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Today's Classes</h3>
              <p className="text-2xl font-bold text-blue-600">{todayClassCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCalendarAlt className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Classes</h3>
              <p className="text-2xl font-bold text-green-600">{totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaChalkboardTeacher className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Days</h3>
              <p className="text-2xl font-bold text-purple-600">
                {Object.values(timetableByDay).filter(day => day.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Class Info */}
      {!assignedClass && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-yellow-600 text-xl" />
            <div>
              <h3 className="font-semibold text-yellow-800">No Assigned Class</h3>
              <p className="text-sm text-yellow-700">You don't have an assigned class yet. Contact your administrator to assign a class.</p>
            </div>
          </div>
        </div>
      )}
      
      {assignedClass && (
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <FaChalkboardTeacher className="text-indigo-600 text-xl" />
            <div>
              <h3 className="font-semibold text-indigo-900">Assigned Class</h3>
              <p className="text-sm text-indigo-700">{assignedClass.name}</p>
            </div>
          </div>
        </div>
      )}
      {todayClassCount > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaysClasses.map((classItem) => (
              <div key={classItem._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <FaClock className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{classItem.subject}</h4>
                    <p className="text-sm text-gray-600">{classItem.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{classItem.startTime} - {classItem.endTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Timetable */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
          <div className="relative">
            <select 
              onChange={(e) => e.target.value && handleAddClass(e.target.value)}
              disabled={!assignedClass}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              defaultValue=""
            >
              <option value="" disabled>{assignedClass ? 'Add Class' : 'No Assigned Class'}</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDays.map((day) => {
                const dayClasses = timetableByDay[day] || []
                if (dayClasses.length === 0) {
                  return (
                    <tr key={day} className={day === today ? 'bg-blue-50' : 'bg-white'}>
                      <td className={`px-6 py-4 whitespace-nowrap ${day === today ? 'font-bold text-blue-600' : 'font-normal text-gray-800'}`}>
                        {day} {day === today && '(Today)'}
                      </td>
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-500 text-sm text-center block">
                          No classes scheduled
                        </span>
                      </td>
                    </tr>
                  )
                }
                
                return dayClasses.map((classItem, index) => (
                  <tr key={classItem._id} className={day === today ? 'bg-blue-50' : 'bg-white'}>
                    {index === 0 && (
                      <td 
                        rowSpan={dayClasses.length} 
                        className={`px-6 py-4 whitespace-nowrap align-top ${day === today ? 'font-bold text-blue-600' : 'font-normal text-gray-800'}`}
                      >
                        {day} {day === today && '(Today)'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-500 text-xs" />
                        <span className="text-sm font-medium">{classItem.startTime} - {classItem.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{classItem.subject}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-500 text-xs" />
                        <span className="text-sm text-gray-900">{classItem.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditClass(classItem)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition"
                          title="Edit class"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition"
                          title="Delete class"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, days.length)} of {days.length} days
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeTable
