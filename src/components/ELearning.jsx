import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { FaPlay, FaQuestionCircle, FaBook, FaPlus, FaEye, FaEdit, FaTrash, FaUpload, FaDownload, FaVideo, FaClock, FaUsers, FaCalendarAlt, FaSpinner } from 'react-icons/fa'
import { 
  getTeacherClasses, 
  getAllQuizzes, createQuiz, updateQuiz, deleteQuiz,
  getAllVideos, uploadVideo as apiUploadVideo, updateVideo, deleteVideo,
  getAllResources, uploadResource as apiUploadResource, updateResource, deleteResource,
  getAllLiveClasses, scheduleLiveClass, updateLiveClass, deleteLiveClass
} from '../api'

// Helper for local file URL if needed
const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}/${path.replace(/\\/g, '/')}`;
};

const ELearning = ({ subTab }) => {
  const [activeTab, setActiveTab] = useState(subTab || 'live')
  const [teacherClasses, setTeacherClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null) // This will be the class object
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)

  const [videoClasses, setVideoClasses] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [resources, setResources] = useState([])
  const [liveClasses, setLiveClasses] = useState([])

  // Modal states
  const [showModal, setShowModal] = useState({ type: null, data: null }) // type: 'video', 'quiz', 'resource', 'live'
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickLink, setQuickLink] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab)
    }
  }, [subTab])

  useEffect(() => {
    if (selectedClass) {
      fetchTabData()
    }
  }, [selectedClass, activeTab])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await getTeacherClasses()
      if (response.data.success) {
        setTeacherClasses(response.data.data)
        if (response.data.data.length > 0) {
          setSelectedClass(response.data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const fetchTabData = async () => {
    if (!selectedClass) return
    try {
      setDataLoading(true)
      const params = { 
        classId: selectedClass.classId, 
        sectionId: selectedClass.sectionId 
      }

      if (activeTab === 'live') {
        const res = await getAllLiveClasses(params)
        setLiveClasses(res.data.liveClasses || [])
      } else if (activeTab === 'videos') {
        const res = await getAllVideos(params)
        setVideoClasses(res.data.videoClasses || [])
      } else if (activeTab === 'quizzes') {
        const res = await getAllQuizzes(params)
        setQuizzes(res.data.quizzes || [])
      } else if (activeTab === 'resources') {
        const res = await getAllResources(params)
        setResources(res.data.resources || [])
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
      toast.error(`Failed to load ${activeTab} data`)
    } finally {
      setDataLoading(false)
    }
  }

  const handleOpenModal = (type, data = null) => {
    setShowModal({ type, data })
    if (data) {
      // Pre-fill form for edit
      if (type === 'live' && data.date) {
        const d = new Date(data.date)
        const dateStr = d.toISOString().slice(0, 16) // For datetime-local
        setFormData({ ...data, scheduledTime: dateStr, meetingLink: data.meetLink })
      } else {
        setFormData(data)
      }
    } else {
      setFormData({})
    }
  }

  const handleCloseModal = () => {
    setShowModal({ type: null, data: null })
    setFormData({})
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!selectedClass) {
      toast.error('Please select a class first')
      return
    }
    
    setIsSubmitting(true)
    const { type, data } = showModal

    try {
      const commonPayload = {
        title: formData.title,
        subject: formData.subject,
        classId: selectedClass.classId,
        sectionId: selectedClass.sectionId
      }

      let res;
      if (type === 'video') {
        const videoPayload = {
          ...commonPayload,
          duration: formData.duration,
          thumbnailUrl: formData.thumbnailUrl || formData.thumbnail, // Handle both for safety
          videoUrl: formData.videoUrl
        }
        if (data) res = await updateVideo(data._id, videoPayload)
        else res = await apiUploadVideo(videoPayload)
      } else if (type === 'quiz') {
        const quizPayload = {
          ...commonPayload,
          numberOfQuestions: formData.questions || formData.numberOfQuestions,
          timeLimit: formData.duration || formData.timeLimit
        }
        if (data) res = await updateQuiz(data._id, quizPayload)
        else res = await createQuiz(quizPayload)
      } else if (type === 'resource') {
        const resourceFormData = new FormData()
        resourceFormData.append('title', formData.title)
        resourceFormData.append('subject', formData.subject)
        resourceFormData.append('fileType', formData.type || formData.fileType || 'PDF')
        resourceFormData.append('classId', selectedClass.classId)
        resourceFormData.append('sectionId', selectedClass.sectionId)
        if (formData.file) resourceFormData.append('file', formData.file)

        if (data) res = await updateResource(data._id, resourceFormData)
        else res = await apiUploadResource(resourceFormData)
      } else if (type === 'live') {
        const livePayload = {
          ...commonPayload,
          meetLink: formData.meetingLink || formData.meetLink,
          date: formData.scheduledTime || formData.date,
          duration: formData.duration || '45 min'
        }
        if (data) res = await updateLiveClass(data._id, livePayload)
        else res = await scheduleLiveClass(livePayload)
      }

      toast.success(data ? 'Updated successfully!' : 'Created successfully!')
      fetchTabData()
      handleCloseModal()
    } catch (error) {
      console.error('Save error:', error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to save item'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (type, id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === 'video') await deleteVideo(id)
          else if (type === 'quiz') await deleteQuiz(id)
          else if (type === 'resource') await deleteResource(id)
          else if (type === 'live') await deleteLiveClass(id)

          toast.success('Deleted successfully')
          fetchTabData()
        } catch (error) {
          console.error('Delete error:', error)
          toast.error('Failed to delete item')
        }
      }
    })
  }

  const handleJoinClass = (meetingLink) => {
    if (!meetingLink) {
      toast.error('No meeting link available');
      return;
    }
    
    let url = meetingLink;
    if (!url.startsWith('http')) {
      url = `https://meet.jit.si/${url}`;
    }
    window.open(url, '_blank');
    toast.success('Opening meeting...');
  }

  const handleScheduleClass = () => {
    handleOpenModal('live')
  }

  const renderVideoClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Video Classes</h3>
        <button
          onClick={() => handleOpenModal('video')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 shadow-md"
        >
          <FaUpload />
          <span>Upload Video</span>
        </button>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : videoClasses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No video classes found for this class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoClasses.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="relative">
                <img 
                  src={getFileUrl(video.thumbnailUrl || video.thumbnail) || 'https://via.placeholder.com/400x250?text=No+Thumbnail'} 
                  alt={video.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <button 
                    onClick={() => window.open(video.videoUrl, '_blank')}
                    className="bg-white text-blue-600 p-3 rounded-full hover:bg-blue-50 transition shadow-lg"
                  >
                    <FaPlay className="text-xl" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2 truncate" title={video.title}>{video.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{video.subject}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.views || 0} views</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2 mt-3 pt-3 border-t">
                  <button 
                    onClick={() => window.open(video.videoUrl, '_blank')}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition font-medium"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleOpenModal('video', video)}
                    className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete('video', video._id)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Quizzes & Assessments</h3>
        <button
          onClick={() => handleOpenModal('quiz')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2 shadow-md"
        >
          <FaPlus />
          <span>Create Quiz</span>
        </button>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-green-500" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No quizzes found for this class.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{quiz.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {quiz.status || 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium text-gray-500">Questions:</span> {quiz.numberOfQuestions}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Duration:</span> {quiz.timeLimit}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Attempts:</span> {quiz.attempts || 0}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Avg Score:</span> {quiz.avgScore || 0}%
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition font-medium">
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleOpenModal('quiz', quiz)}
                    className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete('quiz', quiz._id)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Learning Resources</h3>
        <button
          onClick={() => handleOpenModal('resource')}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2 shadow-md"
        >
          <FaUpload />
          <span>Upload Resource</span>
        </button>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-purple-500" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No resources found for this class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaBook className="text-purple-600 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate" title={resource.title}>{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.fileType} • {resource.fileSize}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{resource.downloads || 0} downloads</span>
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <button 
                  onClick={() => window.open(getFileUrl(resource.fileUrl), '_blank')}
                  className="flex-1 bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaDownload /> Download
                </button>
                <button
                  onClick={() => handleOpenModal('resource', resource)}
                  className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete('resource', resource._id)}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderLiveClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Live Video Classes</h3>
        <button
          onClick={handleScheduleClass}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2 shadow-md"
        >
          <FaPlus />
          <span>Schedule Class</span>
        </button>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-red-500" />
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No live classes scheduled for this class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((liveClass) => (
            <div key={liveClass._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className={`p-4 ${liveClass.status === 'Active' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white ${liveClass.status === 'Active' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                    {liveClass.status || 'Scheduled'}
                  </span>
                  <FaVideo className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-white text-lg truncate" title={liveClass.title}>{liveClass.title}</h4>
                <p className="text-white text-sm opacity-90">{liveClass.subject}</p>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{liveClass.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2 text-gray-400" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-1">{new Date(liveClass.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span className="font-medium">Duration:</span>
                    <span className="ml-1">{liveClass.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-gray-400" />
                    <span className="font-medium">Participants:</span>
                    <span className="ml-1">{liveClass.participants || 0} students</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleJoinClass(liveClass.meetLink)}
                    className={`flex-1 text-white py-2 px-3 rounded text-sm font-bold transition shadow-md flex items-center justify-center gap-2 ${liveClass.status === 'Active'
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    <FaVideo />
                    {liveClass.status === 'Active' ? 'Join Now' : 'Start Class'}
                  </button>
                  <button
                    onClick={() => handleOpenModal('live', liveClass)}
                    className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete('live', liveClass._id)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Join Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaVideo className="mr-2 text-indigo-600" />
          Quick Join Meeting
        </h4>
        <p className="text-sm text-gray-600 mb-4">Enter a meeting link or room name to join instantly</p>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter meeting link or room name..."
            value={quickLink}
            onChange={(e) => setQuickLink(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinClass(quickLink); } }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={() => handleJoinClass(quickLink)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
            Join
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">E-Learning Platform</h1>
            <p className="text-blue-100">Live classes, video lectures, quizzes, and learning resources</p>
          </div>
          <FaVideo className="text-4xl opacity-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaPlay className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Videos</h3>
              <p className="text-2xl font-bold text-blue-600">{videoClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaQuestionCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Active Quizzes</h3>
              <p className="text-2xl font-bold text-green-600">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaBook className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
              <p className="text-2xl font-bold text-purple-600">{resources.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaVideo className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Live Classes</h3>
              <p className="text-2xl font-bold text-red-600">{liveClasses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 font-display">Manage Your Classes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {teacherClasses.map((cls) => (
            <button
              key={`${cls.classId}-${cls.sectionId}`}
              onClick={() => setSelectedClass(cls)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm ${selectedClass?.classId === cls.classId && selectedClass?.sectionId === cls.sectionId
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cls.className} - {cls.sectionName}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

        {/* Tab Content */}
        {activeTab === 'live' && renderLiveClasses()}
        {activeTab === 'videos' && renderVideoClasses()}
        {activeTab === 'quizzes' && renderQuizzes()}
        {activeTab === 'resources' && renderResources()}
      </div>

      {/* Stats */}

      {/* Modal Overlay */}
      {showModal.type && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`p-4 text-white font-bold flex justify-between items-center ${showModal.type === 'video' ? 'bg-blue-600' :
              showModal.type === 'quiz' ? 'bg-green-600' :
                showModal.type === 'resource' ? 'bg-purple-600' : 'bg-red-600'
              }`}>
              <span>{showModal.data ? 'Edit' : 'Add New'} {showModal.type.charAt(0).toUpperCase() + showModal.type.slice(1)}</span>
              <button onClick={handleCloseModal} className="hover:text-gray-200 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-indigo-500"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Category</label>
                <input
                  required
                  type="text"
                  value={formData.subject || ''}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-indigo-500"
                  placeholder="e.g. Mathematics"
                />
              </div>
               {showModal.type === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo)</label>
                    <input
                      required
                      type="text"
                      value={formData.videoUrl || ''}
                      onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 45 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                    <input
                      required
                      type="text"
                      value={formData.thumbnailUrl || ''}
                      onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </>
              )}


              {showModal.type === 'quiz' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                    <input
                      type="number"
                      value={formData.questions || ''}
                      onChange={e => setFormData({ ...formData, questions: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. 30 min"
                    />
                  </div>
                </>
              )}

              {showModal.type === 'resource' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                    <select
                      value={formData.type || 'PDF'}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Link">External Link</option>
                      <option value="Video">Video File</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                    <input
                      type="file"
                      onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {showModal.type === 'live' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link / Room Name</label>
                    <input
                      required
                      type="text"
                      value={formData.meetingLink || ''}
                      onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. math-class-101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.scheduledTime || ''}
                      onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition shadow-md font-bold flex items-center justify-center gap-2 ${showModal.type === 'video' ? 'bg-blue-600 hover:bg-blue-700' :
                    showModal.type === 'quiz' ? 'bg-green-600 hover:bg-green-700' :
                      showModal.type === 'resource' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
                    } disabled:opacity-70`}
                >
                  {isSubmitting ? <FaSpinner className="animate-spin text-lg" /> : null}
                  {showModal.data ? 'Update' : 'Save'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ELearning