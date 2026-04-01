import { useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { 
  FaTasks, 
  FaCalendarAlt, 
  FaUsers,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt
} from 'react-icons/fa'

const Assignment = () => {
  const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}')
  
  // Initialize assignments data
  const initializeAssignmentsData = () => {
    if (!localStorage.getItem('assignmentsData')) {
      const assignmentsData = [
        {
          id: 1,
          title: 'Algebra Practice Problems',
          class: 'Class 10A',
          section: 'A',
          subject: 'Mathematics',
          dueDate: '2024-01-20',
          status: 'Active',
          totalStudents: 35,
          submitted: 28,
          description: 'Solve problems 1-15 from Chapter 3',
          createdDate: '2024-01-15'
        },
        {
          id: 2,
          title: 'Geometry Worksheet',
          class: 'Class 10B',
          section: 'B',
          subject: 'Mathematics',
          dueDate: '2024-01-18',
          status: 'Overdue',
          totalStudents: 32,
          submitted: 30,
          description: 'Complete the geometry exercises',
          createdDate: '2024-01-10'
        },
        {
          id: 3,
          title: 'Trigonometry Assignment',
          class: 'Class 9A',
          section: 'A',
          subject: 'Mathematics',
          dueDate: '2024-01-25',
          status: 'Active',
          totalStudents: 38,
          submitted: 15,
          description: 'Practice trigonometric ratios',
          createdDate: '2024-01-16'
        }
      ]
      localStorage.setItem('assignmentsData', JSON.stringify(assignmentsData))
    }
  }

  initializeAssignmentsData()
  const [assignments, setAssignments] = useState(JSON.parse(localStorage.getItem('assignmentsData') || '[]'))

  // Calculate stats
  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter(a => a.status === 'Active').length
  const overdueAssignments = assignments.filter(a => a.status === 'Overdue').length
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submitted, 0)

  // Button handlers
  const handleCreateAssignment = async () => {
    const { value: formValues } = await Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold; font-size: 1.3rem;"><i class="fas fa-plus-circle" style="color: #10b981; margin-right: 8px;"></i>Create New Assignment</div>`,
      html: `
        <div style="text-align: left; padding: 15px; background: #f8fafc; border-radius: 8px; margin: 5px 0;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-tasks" style="color: #3b82f6; margin-right: 6px;"></i>Assignment Title</label>
            <input id="title" class="swal2-input" placeholder="Enter assignment title" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-users" style="color: #10b981; margin-right: 6px;"></i>Class</label>
              <input id="class" class="swal2-input" placeholder="Class 10A" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-layer-group" style="color: #8b5cf6; margin-right: 6px;"></i>Section</label>
              <input id="section" class="swal2-input" placeholder="A" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-book" style="color: #f59e0b; margin-right: 6px;"></i>Subject</label>
              <input id="subject" class="swal2-input" placeholder="Subject" value="${currentTeacher.subject || ''}" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-calendar-alt" style="color: #ef4444; margin-right: 6px;"></i>Due Date</label>
              <input id="dueDate" class="swal2-input" type="date" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-user-friends" style="color: #8b5cf6; margin-right: 6px;"></i>Total Students</label>
              <input id="totalStudents" class="swal2-input" type="number" placeholder="35" style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 35px;">
            </div>
          </div>
          
          <div style="margin-bottom: 10px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 13px;"><i class="fas fa-file-alt" style="color: #6b7280; margin-right: 6px;"></i>Description</label>
            <textarea id="description" class="swal2-textarea" placeholder="Assignment description..." style="margin: 0; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 13px; width: 100%; box-sizing: border-box; height: 60px; resize: vertical;"></textarea>
          </div>
        </div>
      `,
      width: '600px',
      focusConfirm: false,
      confirmButtonText: 'Create Assignment',
      cancelButtonText: ' Cancel',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const title = document.getElementById('title').value
        const className = document.getElementById('class').value
        const section = document.getElementById('section').value
        const subject = document.getElementById('subject').value
        const dueDate = document.getElementById('dueDate').value
        const totalStudents = document.getElementById('totalStudents').value
        const description = document.getElementById('description').value
        
        if (!title || !className || !section || !subject || !dueDate || !totalStudents) {
          Swal.showValidationMessage('Please fill in all required fields')
          return false
        }
        
        return {
          title,
          class: className,
          section,
          subject,
          dueDate,
          totalStudents: parseInt(totalStudents),
          description
        }
      }
    })
    
    if (formValues) {
      const newAssignment = {
        id: Date.now(),
        ...formValues,
        status: 'Active',
        submitted: 0,
        createdDate: new Date().toISOString().split('T')[0]
      }
      const updatedAssignments = [...assignments, newAssignment]
      setAssignments(updatedAssignments)
      localStorage.setItem('assignmentsData', JSON.stringify(updatedAssignments))
      toast.success('🎉 Assignment created successfully!')
    }
  }

  const handleViewAssignment = (assignment) => {
    const submissionRate = Math.round((assignment.submitted / assignment.totalStudents) * 100)
    Swal.fire({
      title: `<div style="color: #4f46e5; font-weight: bold;">${assignment.title}</div>`,
      html: `
        <div style="text-align: left; padding: 15px;">
          <div style="margin-bottom: 15px; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <p><strong><i class="fas fa-users" style="color: #3b82f6; margin-right: 6px;"></i>Class:</strong> ${assignment.class}</p>
            <p><strong><i class="fas fa-layer-group" style="color: #8b5cf6; margin-right: 6px;"></i>Section:</strong> ${assignment.section}</p>
            <p><strong><i class="fas fa-book" style="color: #f59e0b; margin-right: 6px;"></i>Subject:</strong> ${assignment.subject}</p>
            <p><strong><i class="fas fa-calendar-alt" style="color: #ef4444; margin-right: 6px;"></i>Due Date:</strong> ${assignment.dueDate}</p>
            <p><strong><i class="fas fa-chart-bar" style="color: #8b5cf6; margin-right: 6px;"></i>Status:</strong> <span style="color: ${assignment.status === 'Active' ? '#10b981' : '#ef4444'}">${assignment.status}</span></p>
          </div>
          <div style="margin-bottom: 15px; padding: 10px; background: #e0f2fe; border-radius: 8px;">
            <p><strong><i class="fas fa-user-friends" style="color: #10b981; margin-right: 6px;"></i>Total Students:</strong> ${assignment.totalStudents}</p>
            <p><strong><i class="fas fa-check-circle" style="color: #10b981; margin-right: 6px;"></i>Submitted:</strong> ${assignment.submitted}</p>
            <p><strong><i class="fas fa-chart-line" style="color: #3b82f6; margin-right: 6px;"></i>Submission Rate:</strong> ${submissionRate}%</p>
          </div>
          <div style="margin-bottom: 10px;">
            <p><strong><i class="fas fa-file-alt" style="color: #6b7280; margin-right: 6px;"></i>Description:</strong></p>
            <p style="background: #f9fafb; padding: 10px; border-radius: 6px; margin-top: 5px;">${assignment.description || 'No description provided'}</p>
          </div>
        </div>
      `,
      width: '500px',
      confirmButtonText: 'Close'
    })
  }

  const handleDeleteAssignment = async (assignment) => {
    const result = await Swal.fire({
      title: 'Delete Assignment?',
      text: `Remove "${assignment.title}" permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    })

    if (result.isConfirmed) {
      const updatedAssignments = assignments.filter(a => a.id !== assignment.id)
      setAssignments(updatedAssignments)
      localStorage.setItem('assignmentsData', JSON.stringify(updatedAssignments))
      toast.success('Assignment deleted successfully!')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FaCheckCircle className="text-green-600" />
      case 'Overdue': return <FaExclamationCircle className="text-red-600" />
      default: return <FaClock className="text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Assignments</h1>
            <p className="text-orange-100">Manage and track student assignments</p>
          </div>
          <button 
            onClick={handleCreateAssignment}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition flex items-center space-x-2 cursor-pointer"
          >
            <FaPlus />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaTasks className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <p className="text-2xl font-bold text-blue-600">{totalAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active</h3>
              <p className="text-2xl font-bold text-green-600">{activeAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Overdue</h3>
              <p className="text-2xl font-bold text-red-600">{overdueAssignments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaFileAlt className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Submissions</h3>
              <p className="text-2xl font-bold text-purple-600">{totalSubmissions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Assignments</h3>
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submissionRate = Math.round((assignment.submitted / assignment.totalStudents) * 100)
            return (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{assignment.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaUsers className="text-xs" />
                        <span>{assignment.class} - {assignment.section}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-xs" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-xs" />
                        <span>{assignment.submitted}/{assignment.totalStudents} submitted</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(assignment.status)}
                        <span>{submissionRate}% completion</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewAssignment(assignment)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                      title="View assignment"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                      title="Delete assignment"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Submission Progress</span>
                    <span className="text-xs text-gray-600">{submissionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${submissionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {assignments.length === 0 && (
          <div className="text-center py-8">
            <FaTasks className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No assignments created yet</p>
            <button 
              onClick={handleCreateAssignment}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Create Your First Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignment