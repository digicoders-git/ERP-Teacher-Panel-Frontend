import { useState, useEffect } from 'react'
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCalendarAlt, FaSearch, FaEye, FaEyeSlash, FaUsers, FaExclamationTriangle, FaFileImage, FaFilePdf, FaDownload, FaUpload, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { createNotice, getAllNotices, updateNotice, deleteNotice, publishNotice, unpublishNotice, getTeacherClasses } from '../api'

const NoticeUpdate = () => {
  const [notices, setNotices] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [classes, setClasses] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    class: 'All'
  })

  const [selectedFiles, setSelectedFiles] = useState([])

  const noticeTypes = [
    { value: 'general', label: 'General Notice', color: 'blue' },
    { value: 'academic', label: 'Academic', color: 'green' },
    { value: 'event', label: 'Event', color: 'purple' },
    { value: 'urgent', label: 'Urgent', color: 'red' },
    { value: 'holiday', label: 'Holiday', color: 'yellow' }
  ]

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const resp = await getTeacherClasses()
      if (resp.data.success) {
        setClasses(resp.data.data)
      }
      loadNotices()
    } catch (err) {
      toast.error('Failed to load classes')
      loadNotices()
    }
  }

  const loadNotices = async () => {
    try {
      setPageLoading(true)
      const response = await getAllNotices(1, 100)
      if (response.data.notices) {
        setNotices(response.data.notices)
      }
    } catch (error) {
      console.error('Error loading notices:', error)
      toast.error('Failed to load notices')
    } finally {
      setPageLoading(false)
    }
  }

  const handleAddNotice = () => {
    setShowAddForm(true)
    setTimeout(() => {
      document.getElementById('notice-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 10 * 1024 * 1024

      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type. Only images and PDFs are allowed.`)
        return false
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('content', formData.content)
      fd.append('type', formData.type)
      fd.append('priority', formData.priority)
      if (formData.expiryDate) fd.append('expiryDate', formData.expiryDate)
      fd.append('class', formData.class)

      selectedFiles.forEach(file => {
        fd.append('attachments', file)
      })

      if (editingNotice) {
        await updateNotice(editingNotice._id, fd)
        toast.success('Notice updated successfully!')
      } else {
        await createNotice(fd)
        toast.success('Notice created successfully!')
      }

      loadNotices()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'normal',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      class: 'All'
    })
    setSelectedFiles([])
    setShowAddForm(false)
    setEditingNotice(null)
  }

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      publishDate: notice.publishDate?.split('T')[0] || '',
      expiryDate: notice.expiryDate?.split('T')[0] || '',
      class: notice.class || 'All'
    })
    setEditingNotice(notice)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Notice?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await deleteNotice(id)
        toast.success('Notice deleted successfully!')
        loadNotices()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const handlePublish = async (id) => {
    const result = await Swal.fire({
      title: 'Publish Notice?',
      text: 'This notice will be visible to students and parents.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Publish',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await publishNotice(id)
        toast.success('Notice published successfully!')
        loadNotices()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Publish failed')
      }
    }
  }

  const handleUnpublish = async (id) => {
    const result = await Swal.fire({
      title: 'Unpublish Notice?',
      text: 'This notice will no longer be visible to students and parents.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Unpublish',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await unpublishNotice(id)
        toast.success('Notice unpublished successfully!')
        loadNotices()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unpublish failed')
      }
    }
  }

  const getTypeColor = (type) => {
    const typeObj = noticeTypes.find(t => t.value === type)
    return typeObj ? typeObj.color : 'gray'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const getStatusColor = (status) => {
    return status ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'published' ? notice.isPublished : !notice.isPublished)

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: notices.length,
    published: notices.filter(n => n.isPublished).length,
    draft: notices.filter(n => !n.isPublished).length,
    urgent: notices.filter(n => n.priority === 'high').length
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading notices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Notice Update</h1>
            <p className="text-orange-100">Create and manage school notices</p>
          </div>
          <button
            onClick={handleAddNotice}
            className="bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Notice</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBullhorn className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaEye className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Published</h3>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <FaEyeSlash className="text-gray-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Draft</h3>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Urgent</h3>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        showAddForm ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div id="notice-form" className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingNotice ? 'Edit Notice' : 'New Notice'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {noticeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All Classes</option>
                  {classes.map(cls => (
                    <option key={`${cls.classId}-${cls.sectionId}`} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload images or PDF files</p>
                  <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type.startsWith('image/') ? (
                          <FaFileImage className="text-blue-500" />
                        ) : (
                          <FaFilePdf className="text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>{loading ? 'Saving...' : (editingNotice ? 'Update Notice' : 'Create Notice')}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaBullhorn className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No notices found</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div key={notice._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(notice.type)}-100 text-${getTypeColor(notice.type)}-800`}>
                      {noticeTypes.find(t => t.value === notice.type)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.isPublished)}`}>
                      {notice.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <FaUsers />
                      <span>Class: {notice.class}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!notice.isPublished ? (
                    <button
                      onClick={() => handlePublish(notice._id)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded cursor-pointer transition"
                      title="Publish Notice"
                    >
                      <FaBullhorn />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnpublish(notice._id)}
                      className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 p-2 rounded cursor-pointer transition"
                      title="Unpublish Notice"
                    >
                      <FaBullhorn />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(notice)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded cursor-pointer transition"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded cursor-pointer transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-3">{notice.content}</p>
              
              {notice.expiryDate && (
                <p className="text-sm text-red-600">
                  Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                </p>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                Created: {new Date(notice.createdAt).toLocaleString()}
                {notice.updatedAt && (
                  <span className="ml-4">Updated: {new Date(notice.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NoticeUpdate
