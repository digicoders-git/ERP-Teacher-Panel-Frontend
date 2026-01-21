import { useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { SlCalender } from "react-icons/sl"
import { 
  FaClock, 
  FaCalendarAlt, 
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa'

const TimeTable = () => {
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')
  
  // Initialize timetable data
  const initializeTimetableData = () => {
    if (!localStorage.getItem('timetableData')) {
      const timetableData = {
        Monday: [
          { id: 1, time: '09:00-10:00', class: 'Class 10A', subject: 'Mathematics', room: 'Room 101' },
          { id: 2, time: '14:00-15:00', class: 'Class 9A', subject: 'Mathematics', room: 'Room 103' }
        ],
        Tuesday: [
          { id: 3, time: '10:30-11:30', class: 'Class 10B', subject: 'Mathematics', room: 'Room 102' }
        ],
        Wednesday: [
          { id: 4, time: '09:00-10:00', class: 'Class 10A', subject: 'Mathematics', room: 'Room 101' },
          { id: 5, time: '14:00-15:00', class: 'Class 9A', subject: 'Mathematics', room: 'Room 103' }
        ],
        Thursday: [
          { id: 6, time: '10:30-11:30', class: 'Class 10B', subject: 'Mathematics', room: 'Room 102' }
        ],
        Friday: [
          { id: 7, time: '09:00-10:00', class: 'Class 10A', subject: 'Mathematics', room: 'Room 101' },
          { id: 8, time: '14:00-15:00', class: 'Class 9A', subject: 'Mathematics', room: 'Room 103' }
        ],
        Saturday: [],
        Sunday: []
      }
      localStorage.setItem('timetableData', JSON.stringify(timetableData))
    }
  }

  initializeTimetableData()
  const [timetable, setTimetable] = useState(JSON.parse(localStorage.getItem('timetableData') || '{}'))
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  
  // Get today's classes
  const todaysClasses = timetable[today] || []
  
  // Calculate stats
  const totalClasses = Object.values(timetable).flat().length
  const todayClassCount = todaysClasses.length
  
  // Button handlers
  const handleAddClass = async (day) => {
    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold; font-size: 1.3rem;">📚 Add New Class</div>`,
      html: `
        <div style="text-align: left; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 5px 0;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🕐 Class Time</label>
              <input id="time" class="swal2-input" placeholder="09:00-10:00" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🎓 Class Name</label>
              <input id="class" class="swal2-input" placeholder="Class 10A" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">📖 Subject</label>
              <input id="subject" class="swal2-input" placeholder="Subject" value="${currentTeacher.subject || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🏫 Room</label>
              <input id="room" class="swal2-input" placeholder="Room 101" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 10px; padding: 8px; background: #dbeafe; border-radius: 6px;">
            <small style="color: #1e40af; font-weight: 500;">📅 Adding to: <strong>${day}</strong></small>
          </div>
        </div>
      `,
      width: '500px',
      focusConfirm: false,
      confirmButtonText: '✅ Add Class',
      cancelButtonText: '❌ Cancel',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const time = document.getElementById('time').value
        const className = document.getElementById('class').value
        const subject = document.getElementById('subject').value
        const room = document.getElementById('room').value
        
        if (!time || !className || !subject || !room) {
          Swal.showValidationMessage('Please fill in all fields')
          return false
        }
        
        return {
          time: time,
          class: className,
          subject: subject,
          room: room
        }
      }
    })
    
    if (formValues && formValues.time && formValues.class) {
      const newClass = {
        id: Date.now(),
        ...formValues
      }
      const updatedTimetable = {
        ...timetable,
        [day]: [...(timetable[day] || []), newClass]
      }
      setTimetable(updatedTimetable)
      localStorage.setItem('timetableData', JSON.stringify(updatedTimetable))
      toast.success(`🎉 Class added to ${day} successfully!`)
    }
  }

  const handleEditClass = async (day, classItem) => {
    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold; font-size: 1.3rem;">✏️ Edit Class</div>`,
      html: `
        <div style="text-align: left; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 5px 0;">
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🕐 Class Time</label>
              <input id="time" class="swal2-input" value="${classItem.time}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🎓 Class Name</label>
              <input id="class" class="swal2-input" value="${classItem.class}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">📖 Subject</label>
              <input id="subject" class="swal2-input" value="${classItem.subject}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;">🏫 Room</label>
              <input id="room" class="swal2-input" value="${classItem.room}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 10px; padding: 8px; background: #fef3c7; border-radius: 6px;">
            <small style="color: #92400e; font-weight: 500;">📅 Editing: <strong>${day}</strong></small>
          </div>
        </div>
      `,
      width: '500px',
      focusConfirm: false,
      confirmButtonText: '✅ Update Class',
      cancelButtonText: '❌ Cancel',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const time = document.getElementById('time').value
        const className = document.getElementById('class').value
        const subject = document.getElementById('subject').value
        const room = document.getElementById('room').value
        
        if (!time || !className || !subject || !room) {
          Swal.showValidationMessage('Please fill in all fields')
          return false
        }
        
        return {
          time: time,
          class: className,
          subject: subject,
          room: room
        }
      }
    })
    
    if (formValues) {
      const updatedTimetable = {
        ...timetable,
        [day]: timetable[day].map(item => 
          item.id === classItem.id ? { ...item, ...formValues } : item
        )
      }
      setTimetable(updatedTimetable)
      localStorage.setItem('timetableData', JSON.stringify(updatedTimetable))
      toast.success('✨ Class updated successfully!')
    }
  }

  const handleDeleteClass = async (day, classItem) => {
    const result = await Swal.fire({
      title: 'Delete Class?',
      text: `Remove ${classItem.class} from ${day}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    })

    if (result.isConfirmed) {
      const updatedTimetable = {
        ...timetable,
        [day]: timetable[day].filter(item => item.id !== classItem.id)
      }
      setTimetable(updatedTimetable)
      localStorage.setItem('timetableData', JSON.stringify(updatedTimetable))
      toast.success('Class deleted successfully!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white p-6 mt-9 rounded-lg shadow-lg">
        <div className="flex items-center justify-between grid grid-cols-2">
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
                {Object.values(timetable).filter(day => day.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      {todayClassCount > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaysClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <FaClock className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Class {classItem.class}</h4>
                    <p className="text-sm text-gray-600">{classItem.subject} • {classItem.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{classItem.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Timetable */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {days.map((day) => (
            <div key={day} className={`border rounded-lg p-4 ${day === today ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${day === today ? 'text-blue-700' : 'text-gray-800'}`}>
                  {day} {day === today && '(Today)'}
                </h4>
                
              </div>
              
              <div className="space-y-2">
                {timetable[day]?.length > 0 ? (
                  timetable[day].map((classItem) => (
                    <div key={classItem.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FaClock className="text-xs text-gray-500" />
                            <span className="text-sm font-medium text-gray-800">{classItem.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FaChalkboardTeacher className="text-xs text-gray-500" />
                            <span className="text-sm text-gray-700">CLASS {classItem.class}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="text-xs text-gray-500" />
                            <span className="text-xs text-gray-600">ROOM {classItem.room}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                        
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No classes scheduled</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimeTable