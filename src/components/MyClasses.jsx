import { useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaClock, 
  FaCalendarAlt,
  FaUserGraduate,
  FaPlus,
  FaEye,
  // FaEdit
} from 'react-icons/fa'

const MyClasses = () => {
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')
  
  // Initialize classes data in localStorage
  const initializeClassesData = () => {
    if (!localStorage.getItem('classesData')) {
      const classesData = [
        {
          id: 1,
          name: 'Class 10A',
          subject: 'Mathematics',
          students: 35,
          schedule: 'Mon, Wed, Fri - 9:00 AM',
          room: 'Room 101',
          color: 'bg-blue-500',
          nextClass: '2024-01-15 09:00',
          attendance: 92
        },
        {
          id: 2,
          name: 'Class 10B',
          subject: 'Mathematics',
          students: 32,
          schedule: 'Tue, Thu - 10:30 AM',
          room: 'Room 102',
          color: 'bg-green-500',
          nextClass: '2024-01-16 10:30',
          attendance: 88
        },
        {
          id: 3,
          name: 'Class 9A',
          subject: 'Mathematics',
          students: 38,
          schedule: 'Mon, Wed, Fri - 2:00 PM',
          room: 'Room 103',
          color: 'bg-purple-500',
          nextClass: '2024-01-15 14:00',
          attendance: 95
        }
      ]
      localStorage.setItem('classesData', JSON.stringify(classesData))
    }
  }

  initializeClassesData()
  const classes = JSON.parse(localStorage.getItem('classesData') || '[]')

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0)
  const avgAttendance = Math.round(classes.reduce((sum, cls) => sum + cls.attendance, 0) / classes.length)

  // Button handlers
  const handleAddClass = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Class',
      html: `
        <input id="className" class="swal2-input" placeholder="Class Name (e.g., Class 11A)">
        <input id="subject" class="swal2-input" placeholder="Subject" value="${currentTeacher.subject || ''}">
        <input id="students" class="swal2-input" type="number" placeholder="Number of Students">
        <input id="room" class="swal2-input" placeholder="Room Number">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById('className').value,
          subject: document.getElementById('subject').value,
          students: parseInt(document.getElementById('students').value),
          room: document.getElementById('room').value
        }
      }
    })
    
    if (formValues && formValues.name && formValues.students) {
      toast.success(`Class ${formValues.name} added successfully!`)
    }
  }

  const handleViewClass = (classItem) => {
    Swal.fire({
      title: classItem.name,
      html: `
        <div style="text-align: left;">
          <p><strong>Subject:</strong> ${classItem.subject}</p>
          <p><strong>Students:</strong> ${classItem.students}</p>
          <p><strong>Schedule:</strong> ${classItem.schedule}</p>
          <p><strong>Room:</strong> ${classItem.room}</p>
          <p><strong>Attendance:</strong> ${classItem.attendance}%</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    })
  }

  // const handleEditClass = async (classItem) => {
  //   const { value: formValues } = await Swal.fire({
  //     title: `Edit ${classItem.name}`,
  //     html: `
  //       <input id="className" class="swal2-input" value="${classItem.name}">
  //       <input id="subject" class="swal2-input" value="${classItem.subject}">
  //       <input id="students" class="swal2-input" type="number" value="${classItem.students}">
  //       <input id="room" class="swal2-input" value="${classItem.room}">
  //     `,
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       return {
  //         name: document.getElementById('className').value,
  //         subject: document.getElementById('subject').value,
  //         students: parseInt(document.getElementById('students').value),
  //         room: document.getElementById('room').value
  //       }
  //     }
  //   })
    
  //   if (formValues) {
  //     toast.success(`${classItem.name} updated successfully!`)
  //   }
  // }

  const handleManageStudents = () => {
    toast.info('Student management feature coming soon!')
  }

  const handleScheduleClass = () => {
    toast.info('Class scheduling feature coming soon!')
  }

  const handleViewAttendance = () => {
    toast.info('Attendance view feature coming soon!')
  }

  const handleClassReports = () => {
    toast.info('Class reports feature coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 text-white p-6 rounded-lg mt-9 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Classes</h1>
            <p className="text-blue-100"></p>
          </div>
           <span className='text-xl'>Here Is Your Classes</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaChalkboardTeacher className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Classes</h3>
              <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
              <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUserGraduate className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Avg Attendance</h3>
              <p className="text-2xl font-bold text-purple-600">{avgAttendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
              {/* Class Header */}
              <div className={`${classItem.color} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{classItem.name}</h3>
                    <p className="text-sm opacity-90">{classItem.subject}</p>
                  </div>
                  <FaChalkboardTeacher className="text-2xl opacity-80" />
                </div>
              </div>

              {/* Class Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaUsers className="text-sm" />
                  <span className="text-sm">{classItem.students} Students</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaClock className="text-sm" />
                  <span className="text-sm">{classItem.schedule}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCalendarAlt className="text-sm" />
                  <span className="text-sm">{classItem.room}</span>
                </div>

                {/* Attendance Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Attendance</span>
                    <span className="text-sm text-gray-600">{classItem.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${classItem.attendance}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button 
                    onClick={() => handleViewClass(classItem)}
                    className="flex-1 cursor-pointer bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center space-x-1"
                  >
                    <FaEye className="text-xs" />
                    <span>View</span>
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
       
    </div>
  )
}

export default MyClasses