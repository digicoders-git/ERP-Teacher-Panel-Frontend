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
  FaSpinner,
  FaInfoCircle,
  FaChalkboardTeacher,
  FaBook,
  FaDownload
} from 'react-icons/fa'
import { getDashboardStats, getAllAssignments, createAssignment, deleteAssignment, updateAssignment } from '../api'

const Assignment = () => {
  const [assignments, setAssignments] = useState([])
  const [assignedClass, setAssignedClass] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    description: '',
    instructions: '',
    marks: '',
    document: null,
    image: null
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const statsResponse = await getDashboardStats()
      if (statsResponse.data.success && statsResponse.data.data.teacher.assignedClass) {
        setAssignedClass(statsResponse.data.data.teacher.assignedClass)
      }
      
      const response = await getAllAssignments()
      if (response.data.assignments) {
        setAssignments(response.data.assignments || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
      toast.error('Failed to load data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const classAssignments = assignments

  const totalAssignments = classAssignments.length
  const activeAssignments = classAssignments.filter(a => a.status === 'active').length
  const overdueAssignments = classAssignments.filter(a => a.status === 'overdue').length
  const totalSubmissions = classAssignments.reduce((sum, a) => sum + (a.submitted || 0), 0)

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData(prev => (({
        ...prev,
        [name]: files[0] || null
      })))
    } else {
      setFormData(prev => (({
        ...prev,
        [name]: value
      })))
    }
  }

  const handleCreateOrUpdateAssignment = async (e) => {
    e.preventDefault()

    if (!assignedClass) {
      toast.error('No assigned class found')
      return
    }

    if (!formData.title || !formData.subject || !formData.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('dueDate', formData.dueDate)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('marks', formData.marks || 0)
      
      if (formData.document) {
        formDataToSend.append('document', formData.document)
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (editingAssignment) {
        // Update existing assignment
        await updateAssignment(editingAssignment._id, formDataToSend)
        toast.success('✅ Assignment updated successfully!')
        setEditingAssignment(null)
      } else {
        // Create new assignment
        formDataToSend.append('classId', assignedClass.id)
        formDataToSend.append('sectionId', assignedClass.sectionId)
        formDataToSend.append('totalStudents', assignedClass.students || 0)
        
        const response = await createAssignment(formDataToSend)

        if (response.data.assignment) {
          setAssignments([...assignments, response.data.assignment])
          toast.success('✅ Assignment created successfully!')
        }
      }
      
      setFormData({
        title: '',
        subject: '',
        dueDate: '',
        description: '',
        instructions: '',
        marks: '',
        document: null,
        image: null
      })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      const message = editingAssignment ? 'update' : 'create'
      toast.error(`Failed to ${message} assignment: ` + (error.response?.data?.message || error.message))
    }
  }

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      dueDate: assignment.dueDate.split('T')[0],
      description: assignment.description || '',
      instructions: '',
      marks: assignment.marks || '',
      document: null,
      image: null
    })
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingAssignment(null)
    setFormData({
      title: '',
      subject: '',
      dueDate: '',
      description: '',
      instructions: '',
      marks: '',
      document: null,
      image: null
    })
  }

  const handleViewAssignment = (assignment) => {
    const submissionRate = assignment.totalStudents > 0 
      ? Math.round(((assignment.submitted || 0) / assignment.totalStudents) * 100)
      : 0
    
    const dueDate = new Date(assignment.dueDate).toLocaleDateString()
    
    Swal.fire({
      title: `<div style="color: #1f2937; font-weight: bold; font-size: 1.2rem;">${assignment.title}</div>`,
      html: `
        <div style="text-align: left; padding: 20px;">
          <div style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0284c7;">
            <p style="margin: 8px 0;"><strong style="color: #0c4a6e;">📚 Class:</strong> ${assignment.class?.className || 'N/A'}</p>
            <p style="margin: 8px 0;"><strong style="color: #0c4a6e;">📖 Subject:</strong> ${assignment.subject}</p>
            <p style="margin: 8px 0;"><strong style="color: #0c4a6e;">📅 Due Date:</strong> ${dueDate}</p>
            <p style="margin: 8px 0;"><strong style="color: #0c4a6e;">Status:</strong> <span style="color: #16a34a; font-weight: bold;">Active</span></p>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #166534;">📊 Submission Status</p>
            <p style="margin: 5px 0;"><strong>Total Students:</strong> ${assignment.totalStudents}</p>
            <p style="margin: 5px 0;"><strong>Submitted:</strong> ${assignment.submitted || 0}</p>
            <p style="margin: 5px 0;"><strong>Pending:</strong> ${(assignment.totalStudents || 0) - (assignment.submitted || 0)}</p>
            <p style="margin: 5px 0;"><strong>Completion Rate:</strong> <span style="color: #16a34a; font-weight: bold;">${submissionRate}%</span></p>
          </div>

          ${assignment.description ? `
            <div style="margin-bottom: 20px; padding: 15px; background: #f5f3ff; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #5b21b6;">📄 Description</p>
              <p style="margin: 0; white-space: pre-wrap; color: #6b21a8;">${assignment.description}</p>
            </div>
          ` : ''}

          <div style="margin-top: 20px; padding: 10px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Created: ${new Date(assignment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Close',
      confirmButtonColor: '#0284c7'
    })
  }

  const handleDeleteAssignment = async (assignment) => {
    const result = await Swal.fire({
      title: 'Delete Assignment?',
      text: `Remove "${assignment.title}" permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!'
    })

    if (result.isConfirmed) {
      try {
        await deleteAssignment(assignment._id)
        const updatedAssignments = assignments.filter(a => a._id !== assignment._id)
        setAssignments(updatedAssignments)
        toast.success('Assignment deleted successfully!')
      } catch (error) {
        console.error('Error deleting assignment:', error)
        toast.error('Failed to delete assignment: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📚 Assignment Management</h1>
            <p className="text-blue-100">Create and manage assignments for your class</p>
          </div>
          <button 
            onClick={() => {
              setEditingAssignment(null)
              setFormData({
                title: '',
                subject: '',
                dueDate: '',
                description: '',
                instructions: '',
                marks: ''
              })
              setShowForm(!showForm)
            }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <FaPlus />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Assigned Class Info */}
      {!assignedClass ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-yellow-600 text-xl" />
            <div>
              <h3 className="font-semibold text-yellow-800">No Assigned Class</h3>
              <p className="text-sm text-yellow-700">Contact your administrator to assign a class.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaChalkboardTeacher className="text-blue-600 text-xl" />
            <div>
              <h3 className="font-semibold text-blue-900">Assigned Class</h3>
              <p className="text-sm text-blue-700">{assignedClass.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Assignment Form */}
      {showForm && assignedClass && (
        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaFileAlt className="text-blue-600" />
            <span>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</span>
          </h2>

          <form onSubmit={handleCreateOrUpdateAssignment} className="space-y-6">
            {/* Class Info Display */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Class:</strong> <span className="text-blue-700 font-semibold">{assignedClass.name}</span>
              </p>
            </div>

            {/* Row 1: Title and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chapter 5 - Algebra Problems"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Row 2: Due Date and Marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 3: File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📄 Upload Document (PDF, DOC)
                </label>
                <input
                  type="file"
                  name="document"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.document && <p className="text-xs text-green-600 mt-1">✓ {formData.document.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🖼️ Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.image && <p className="text-xs text-green-600 mt-1">✓ {formData.image.name}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description / Details
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., This assignment covers topics from Chapter 5. Students should refer to pages 45-50 in the textbook."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <FaPlus />
                <span>{editingAssignment ? 'Update Assignment' : 'Create Assignment'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      {assignedClass && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Assignments</p>
                <p className="text-3xl font-bold text-blue-600">{totalAssignments}</p>
              </div>
              <FaTasks className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeAssignments}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{overdueAssignments}</p>
              </div>
              <FaExclamationCircle className="text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Submissions</p>
                <p className="text-3xl font-bold text-purple-600">{totalSubmissions}</p>
              </div>
              <FaFileAlt className="text-4xl text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">📋 Assignment List</h3>
        </div>

        {classAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <FaTasks className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No assignments created yet</p>
            {assignedClass && (
              <button 
                onClick={() => setShowForm(true)}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Create First Assignment
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Marks</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Document</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Submissions</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classAssignments.map((assignment) => {
                  const daysLeft = getDaysRemaining(assignment.dueDate)
                  const submissionRate = assignment.totalStudents > 0
                    ? Math.round(((assignment.submitted || 0) / assignment.totalStudents) * 100)
                    : 0
                  const dueDate = new Date(assignment.dueDate).toLocaleDateString()
                  
                  return (
                    <tr key={assignment._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{assignment.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{assignment.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>
                          <p>{dueDate}</p>
                          <p className={`text-xs font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft < 3 ? 'text-orange-600' : 'text-green-600'}`}>
                            {daysLeft < 0 ? `Overdue ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-900 font-semibold">{assignment.marks || '-'}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        {assignment.document ? (
                          <a href={`/uploads/${assignment.document}`} download className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                            <FaDownload />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">{assignment.submitted || 0}/{assignment.totalStudents}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${submissionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 mt-1">{submissionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewAssignment(assignment)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            title="View details"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment)}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignment
