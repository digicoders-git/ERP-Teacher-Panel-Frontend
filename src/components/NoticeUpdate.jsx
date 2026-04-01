import { useState, useEffect } from 'react'
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCalendarAlt, FaSearch, FaEye, FaEyeSlash, FaUsers, FaExclamationTriangle, FaFileImage, FaFilePdf, FaDownload, FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const NoticeUpdate = () => {
  const [notices, setNotices] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
    priority: 'normal',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'draft',
    attachments: []
  })

  const [selectedFiles, setSelectedFiles] = useState([])

  const noticeTypes = [
    { value: 'general', label: 'General Notice', color: 'blue' },
    { value: 'academic', label: 'Academic', color: 'green' },
    { value: 'event', label: 'Event', color: 'purple' },
    { value: 'urgent', label: 'Urgent', color: 'red' },
    { value: 'holiday', label: 'Holiday', color: 'yellow' }
  ]

  const audiences = [
    { value: 'all', label: 'All Students' },
    { value: 'class10a', label: 'Class 10A' },
    { value: 'class10b', label: 'Class 10B' },
    { value: 'class9a', label: 'Class 9A' },
    { value: 'parents', label: 'Parents' }
  ]

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = () => {
    const savedNotices = localStorage.getItem('schoolNotices')
    if (savedNotices) {
      setNotices(JSON.parse(savedNotices))
    } else {
      // Demo data
      const demoNotices = [
        {
          id: 1,
          title: 'Mid-Term Examination Schedule',
          content: 'Mid-term examinations will be conducted from March 15-25, 2024. Students are advised to prepare accordingly.',
          type: 'academic',
          targetAudience: 'all',
          priority: 'high',
          publishDate: new Date().toISOString().split('T')[0],
          expiryDate: '2024-03-25',
          status: 'published',
          createdAt: new Date().toISOString(),
          publishedBy: 'John Doe'
        },
        {
          id: 2,
          title: 'Sports Day Event',
          content: 'Annual Sports Day will be held on March 30, 2024. All students must participate in at least one event.',
          type: 'event',
          targetAudience: 'all',
          priority: 'normal',
          publishDate: '2024-03-20',
          expiryDate: '2024-03-30',
          status: 'draft',
          createdAt: new Date().toISOString(),
          publishedBy: 'John Doe'
        }
      ]
      setNotices(demoNotices)
      localStorage.setItem('schoolNotices', JSON.stringify(demoNotices))
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

  const saveNotices = (newNotices) => {
    localStorage.setItem('schoolNotices', JSON.stringify(newNotices))
    setNotices(newNotices)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const currentTeacher = JSON.parse(localStorage.getItem('currentTeacher'))
    
    if (editingNotice) {
      const updatedNotices = notices.map(notice =>
        notice.id === editingNotice.id
          ? { ...formData, id: editingNotice.id, createdAt: editingNotice.createdAt, updatedAt: new Date().toISOString(), publishedBy: currentTeacher?.name || 'Teacher' }
          : notice
      )
      saveNotices(updatedNotices)
      toast.success('Notice updated successfully!')
      setEditingNotice(null)
    } else {
      const newNotice = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        publishedBy: currentTeacher?.name || 'Teacher'
      }
      saveNotices([newNotice, ...notices])
      toast.success('Notice created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      targetAudience: 'all',
      priority: 'normal',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'draft',
      attachments: []
    })
    setSelectedFiles([])
    setShowAddForm(false)
    setEditingNotice(null)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
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

    const filePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(filePromises).then(fileData => {
      setSelectedFiles(prev => [...prev, ...fileData])
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileData]
      }))
    })
  }

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId))
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file.id !== fileId)
    }))
  }

  const downloadFile = (file) => {
    const link = document.createElement('a')
    link.href = file.data
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEdit = (notice) => {
    setFormData(notice)
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
      const updatedNotices = notices.filter(notice => notice.id !== id)
      saveNotices(updatedNotices)
      toast.success('Notice deleted successfully!')
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
      const updatedNotices = notices.map(notice =>
        notice.id === id
          ? { ...notice, status: 'published', publishedAt: new Date().toISOString() }
          : notice
      )
      saveNotices(updatedNotices)
      toast.success('Notice published successfully!')
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
      const updatedNotices = notices.map(notice =>
        notice.id === id
          ? { ...notice, status: 'draft' }
          : notice
      )
      saveNotices(updatedNotices)
      toast.success('Notice unpublished successfully!')
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
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || notice.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: notices.length,
    published: notices.filter(n => n.status === 'published').length,
    draft: notices.filter(n => n.status === 'draft').length,
    urgent: notices.filter(n => n.priority === 'high').length
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {audiences.map(audience => (
                    <option key={audience.value} value={audience.value}>{audience.label}</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
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
                  {selectedFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
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
                        onClick={() => removeFile(file.id)}
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
                onClick={() => setFormData({...formData, status: 'draft'})}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center space-x-2 cursor-pointer"
              >
                <FaSave />
                <span>Save as Draft</span>
              </button>
              <button
                type="submit"
                onClick={() => setFormData({...formData, status: 'published'})}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center space-x-2 cursor-pointer"
              >
                <FaBullhorn />
                <span>Publish Now</span>
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
            <div key={notice.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(notice.type)}-100 text-${getTypeColor(notice.type)}-800`}>
                      {noticeTypes.find(t => t.value === notice.type)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                      {notice.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>{new Date(notice.publishDate).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaUsers />
                      <span>{audiences.find(a => a.value === notice.targetAudience)?.label}</span>
                    </span>
                    <span>By: {notice.publishedBy}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {notice.status === 'draft' ? (
                    <button
                      onClick={() => handlePublish(notice.id)}
                      className="text-green-600 hover:text-green-800 p-2 cursor-pointer"
                      title="Publish"
                    >
                      <FaEye />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnpublish(notice.id)}
                      className="text-yellow-600 hover:text-yellow-800 p-2 cursor-pointer"
                      title="Unpublish"
                    >
                      <FaEyeSlash />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(notice)}
                    className="text-blue-600 hover:text-blue-800 p-2 cursor-pointer"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-3">{notice.content}</p>
              
              {/* Attachments */}
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {notice.attachments.map(file => (
                      <div key={file.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                        {file.type.startsWith('image/') ? (
                          <FaFileImage className="text-blue-500" />
                        ) : (
                          <FaFilePdf className="text-red-500" />
                        )}
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => downloadFile(file)}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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