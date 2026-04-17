import { useState, useEffect } from 'react'
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
  FaFileAlt,
  FaSpinner
} from 'react-icons/fa'
import { 
  createAssignment, 
  getAllAssignments, 
  updateAssignment, 
  deleteAssignment,
  getTeacherClasses
} from '../api'

const Assignment = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [classes, setClasses] = useState([])

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
      }
    } catch (err) {
      toast.error('Failed to load teacher classes')
    }
  }

  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchAssignments()
    }
  }, [page, selectedClass, selectedSection])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await getAllAssignments(page, 10, selectedClass, selectedSection)
      if (response.data.assignments) {
        setAssignments(response.data.assignments)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Assignment',
      html: `
        <div style="text-align: left; padding: 15px;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Title</label>
            <input id="title" class="swal2-input" placeholder="Assignment title" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Class</label>
            <select id="classIdAndSection" class="swal2-input" style="width: 100%;">
              <option value="">Select Class</option>
              ${classes.map(c => `<option value="${c.classId}-${c.sectionId}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Due Date</label>
            <input id="dueDate" type="date" class="swal2-input" style="width: 100%;">
          </div>
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Description</label>
            <textarea id="description" class="swal2-textarea" placeholder="Assignment description..." style="width: 100%; height: 80px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const classInfo = document.getElementById('classIdAndSection').value
        const [cid, sid] = classInfo.split('-')
        return {
          title: document.getElementById('title').value,
          classId: cid,
          sectionId: sid,
          dueDate: document.getElementById('dueDate').value,
          description: document.getElementById('description').value
        }
      }
    })

    if (formValues && formValues.title && formValues.classId && formValues.dueDate) {
      try {
        await createAssignment(formValues)
        toast.success('Assignment created successfully!')
        fetchAssignments()
      } catch (error) {
        toast.error('Failed to create assignment')
      }
    }
  }

  const handleDeleteAssignment = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Assignment?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    })

    if (result.isConfirmed) {
      try {
        await deleteAssignment(id)
        toast.success('Assignment deleted successfully!')
        fetchAssignments()
      } catch (error) {
        toast.error('Failed to delete assignment')
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    )
  }

  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter(a => a.status === 'Active').length
  const overdueAssignments = assignments.filter(a => a.status === 'Overdue').length

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
              <p className="text-2xl font-bold text-purple-600">{classes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Class</h3>
        <div className="flex space-x-2">
          {classes.map((cls) => (
            <button
              key={`${cls.classId}-${cls.sectionId}`}
              onClick={() => {
                setSelectedClass(cls.classId)
                setSelectedSection(cls.sectionId)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedClass === cls.classId && selectedSection === cls.sectionId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Assignments</h3>
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <FaTasks className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No assignments found</p>
            </div>
          ) : (
            assignments.map((assignment) => {
              const submissionRate = assignment.submitted && assignment.totalStudents 
                ? Math.round((assignment.submitted / assignment.totalStudents) * 100)
                : 0
              return (
                <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
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
                          <span>{assignment.class?.className}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-xs" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaFileAlt className="text-xs" />
                          <span>{assignment.submitted || 0}/{assignment.totalStudents} submitted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(assignment.status)}
                          <span>{submissionRate}% completion</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => toast.info('View feature coming soon')}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        title="View assignment"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
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
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignment
