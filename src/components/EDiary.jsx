import { useState, useEffect, useRef } from 'react'
import { FaBook, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCalendarAlt, FaSearch, FaFilter, FaUser, FaExclamationTriangle, FaImage, FaDownload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const EDiary = () => {
  const [entries, setEntries] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    studentName: '',
    className: '',
    priority: 'normal',
    date: new Date().toISOString().split('T')[0],
    images: []
  })

  const entryTypes = [
    { value: 'general', label: 'General Note', color: 'blue' },
    { value: 'student', label: 'Student Observation', color: 'green' },
    { value: 'reminder', label: 'Reminder', color: 'yellow' },
    { value: 'important', label: 'Important', color: 'red' }
  ]

  const classes = ['Class 10A', 'Class 10B', 'Class 9A']

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    const savedEntries = localStorage.getItem('diaryEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    } else {
      // Demo data
      const demoEntries = [
        {
          id: 1,
          title: 'Math Class Progress',
          content: 'Students showed good understanding of quadratic equations. Need to focus more on word problems.',
          type: 'general',
          className: 'Class 10A',
          priority: 'normal',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Rahul - Improvement Needed',
          content: 'Rahul is struggling with algebra concepts. Recommend extra practice sessions.',
          type: 'student',
          studentName: 'Rahul Kumar',
          className: 'Class 10B',
          priority: 'high',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ]
      setEntries(demoEntries)
      localStorage.setItem('diaryEntries', JSON.stringify(demoEntries))
    }
  }

  const saveEntries = (newEntries) => {
    localStorage.setItem('diaryEntries', JSON.stringify(newEntries))
    setEntries(newEntries)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingEntry) {
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id
          ? { ...formData, id: editingEntry.id, createdAt: editingEntry.createdAt, updatedAt: new Date().toISOString() }
          : entry
      )
      saveEntries(updatedEntries)
      toast.success('Entry updated successfully!')
      setEditingEntry(null)
    } else {
      const newEntry = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      saveEntries([newEntry, ...entries])
      toast.success('Entry added successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      studentName: '',
      className: '',
      priority: 'normal',
      date: new Date().toISOString().split('T')[0],
      images: []
    })
    setShowAddForm(false)
    setEditingEntry(null)
  }

  const handleEdit = (entry) => {
    setFormData(entry)
    setEditingEntry(entry)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Entry?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      const updatedEntries = entries.filter(entry => entry.id !== id)
      saveEntries(updatedEntries)
      toast.success('Entry deleted successfully!')
    }
  }

  const getTypeColor = (type) => {
    const typeObj = entryTypes.find(t => t.value === type)
    return typeObj ? typeObj.color : 'gray'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.studentName && entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || entry.type === filterType
    const matchesDate = !selectedDate || entry.date === selectedDate

    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">E-Diary</h1>
            <p className="text-purple-100">Digital diary for daily notes and observations</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true)
              setTimeout(() => {
                if (formRef.current) {
                  formRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  })
                }
              }, 100)
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition flex items-center space-x-2 cursor-pointer"
          >
            <FaPlus />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {entryTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div ref={formRef} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingEntry ? 'Edit Entry' : 'New Entry'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {entryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {formData.type === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files)
                  const imagePromises = files.map(file => {
                    return new Promise((resolve) => {
                      const reader = new FileReader()
                      reader.onload = (e) => resolve({
                        name: file.name,
                        data: e.target.result,
                        size: file.size
                      })
                      reader.readAsDataURL(file)
                    })
                  })
                  Promise.all(imagePromises).then(images => {
                    setFormData({...formData, images: [...formData.images, ...images]})
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {formData.images.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image.data} alt={image.name} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index)
                          setFormData({...formData, images: newImages})
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2 cursor-pointer"
              >
                <FaSave />
                <span>{editingEntry ? 'Update' : 'Save'}</span>
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
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FaBook className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No diary entries found</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(entry.type)}-100 text-${getTypeColor(entry.type)}-800`}>
                      {entryTypes.find(t => t.value === entry.type)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(entry.priority)}`}>
                      {entry.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </span>
                    {entry.className && (
                      <span className="flex items-center space-x-1">
                        <FaBook />
                        <span>{entry.className}</span>
                      </span>
                    )}
                    {entry.studentName && (
                      <span className="flex items-center space-x-1">
                        <FaUser />
                        <span>{entry.studentName}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-800 p-2 cursor-pointer"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-800 p-2 cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{entry.content}</p>
              
              {entry.images && entry.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaImage className="mr-2" /> Attachments ({entry.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {entry.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image.data} 
                          alt={image.name} 
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80" 
                          onClick={() => window.open(image.data, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center">
                          <FaDownload className="text-white opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                Created: {new Date(entry.createdAt).toLocaleString()}
                {entry.updatedAt && (
                  <span className="ml-4">Updated: {new Date(entry.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EDiary