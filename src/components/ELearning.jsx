import { useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { FaPlay, FaQuestionCircle, FaBook, FaPlus, FaEye, FaEdit, FaTrash, FaUpload, FaDownload, FaVideo, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { JitsiMeeting } from '@jitsi/react-sdk'

const ELearning = () => {
  const [activeTab, setActiveTab] = useState('live')
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [quickLink, setQuickLink] = useState('')
  const [jitsiRoom, setJitsiRoom] = useState('')
  const [showJitsi, setShowJitsi] = useState(false)

  const classes = ['Class 10A', 'Class 10B', 'Class 9A']

  const [videoClasses, setVideoClasses] = useState([
    {
      id: 1,
      title: 'Algebra Basics',
      subject: 'Mathematics',
      className: 'Class 10A',
      duration: '45 min',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd48a5811?w=400&h=250&fit=crop',
      views: 125,
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Literature Review',
      subject: 'English',
      className: 'Class 10B',
      duration: '30 min',
      thumbnail: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=250&fit=crop',
      views: 45,
      uploadDate: '2024-01-20'
    }
  ])

  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'Algebra Quiz - Chapter 1',
      subject: 'Mathematics',
      className: 'Class 10A',
      questions: 15,
      duration: '30 min',
      attempts: 45,
      avgScore: 78,
      status: 'Active'
    }
  ])

  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Mathematics Formula Sheet',
      type: 'PDF',
      className: 'Class 10A',
      size: '2.5 MB',
      downloads: 156,
      uploadDate: '2024-01-14'
    }
  ])

  const [liveClasses, setLiveClasses] = useState([
    {
      id: 1,
      title: 'Algebra Live Session',
      subject: 'Mathematics',
      className: 'Class 10A',
      meetingLink: 'https://meet.jit.si/algebra-live-10a',
      scheduledTime: 'Ongoing',
      duration: '45 min',
      participants: 12,
      status: 'Active',
      instructor: 'You',
      description: 'Live discussion on Algebra basics'
    }
  ])

  // Modal states
  const [showModal, setShowModal] = useState({ type: null, data: null }) // type: 'video', 'quiz', 'resource', 'live'
  const [formData, setFormData] = useState({})

  const handleOpenModal = (type, data = null) => {
    setShowModal({ type, data })
    setFormData(data || {})
  }

  const handleCloseModal = () => {
    setShowModal({ type: null, data: null })
    setFormData({})
  }

  const handleSave = (e) => {
    e.preventDefault()
    const { type, data } = showModal
    const newItem = {
      ...formData,
      id: data ? data.id : Date.now(),
      className: selectedClass, // Automatically assign the current selected class
      uploadDate: new Date().toISOString().split('T')[0]
    }

    if (type === 'video') {
      if (data) setVideoClasses(v => v.map(item => item.id === data.id ? newItem : item))
      else setVideoClasses(v => [...v, { ...newItem, views: 0 }])
      toast.success(data ? 'Video updated!' : 'Video uploaded!')
    } else if (type === 'quiz') {
      if (data) setQuizzes(q => q.map(item => item.id === data.id ? newItem : item))
      else setQuizzes(q => [...q, { ...newItem, attempts: 0, avgScore: 0, status: 'Active' }])
      toast.success(data ? 'Quiz updated!' : 'Quiz created!')
    } else if (type === 'resource') {
      if (data) setResources(r => r.map(item => item.id === data.id ? newItem : item))
      else setResources(r => [...r, { ...newItem, downloads: 0 }])
      toast.success(data ? 'Resource updated!' : 'Resource uploaded!')
    } else if (type === 'live') {
      if (data) setLiveClasses(l => l.map(item => item.id === data.id ? newItem : item))
      else setLiveClasses(l => [...l, { ...newItem, participants: 0, status: 'Scheduled', instructor: 'You' }])
      toast.success(data ? 'Class updated!' : 'Class scheduled!')
    }
    handleCloseModal()
  }

  const handleDelete = (type, id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'video') setVideoClasses(v => v.filter(i => i.id !== id))
        else if (type === 'quiz') setQuizzes(q => q.filter(i => i.id !== id))
        else if (type === 'resource') setResources(r => r.filter(i => i.id !== id))
        else if (type === 'live') setLiveClasses(l => l.filter(i => i.id !== id))

        Swal.fire(
          'Deleted!',
          'Your item has been deleted.',
          'success'
        )
      }
    })
  }

  const handleJoinClass = (meetingLink) => {
    // Extract room name from Jitsi URL (e.g., https://meet.jit.si/roomName)
    try {
      const url = new URL(meetingLink)
      const room = url.pathname.replace(/^\//, '')
      setJitsiRoom(room)
      setShowJitsi(true)
      toast.success('Joining Jitsi meeting...')
    } catch (error) {
      // If it's not a valid URL, treat it as a room name directly
      setJitsiRoom(meetingLink)
      setShowJitsi(true)
      toast.success('Joining Jitsi meeting...')
    }
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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
        >
          <FaUpload />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoClasses.filter(v => v.className === selectedClass).map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div className="relative">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <button className="bg-white text-blue-600 p-3 rounded-full hover:bg-blue-50 transition">
                  <FaPlay className="text-xl" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{video.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{video.subject}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{video.views} views</span>
                <span>{video.uploadDate}</span>
              </div>

              <div className="flex space-x-2 mt-3">
                <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition">
                  <FaEye className="inline mr-1" /> View
                </button>
                <button
                  onClick={() => handleOpenModal('video', video)}
                  className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete('video', video.id)}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Quizzes & Assessments</h3>
        <button
          onClick={() => handleOpenModal('quiz')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Quiz</span>
        </button>
      </div>

      <div className="space-y-4">
        {quizzes.filter(q => q.className === selectedClass).map((quiz) => (
          <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{quiz.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {quiz.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Questions:</span> {quiz.questions}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {quiz.duration}
                  </div>
                  <div>
                    <span className="font-medium">Attempts:</span> {quiz.attempts}
                  </div>
                  <div>
                    <span className="font-medium">Avg Score:</span> {quiz.avgScore}%
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition">
                  <FaEye className="inline mr-1" /> View
                </button>
                <button
                  onClick={() => handleOpenModal('quiz', quiz)}
                  className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete('quiz', quiz.id)}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderResources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Learning Resources</h3>
        <button
          onClick={() => handleOpenModal('resource')}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2"
        >
          <FaUpload />
          <span>Upload Resource</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.filter(r => r.className === selectedClass).map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaBook className="text-purple-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{resource.downloads} downloads</span>
              <span>{resource.uploadDate}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition">
                <FaDownload className="inline mr-1" /> Download
              </button>
              <button
                onClick={() => handleOpenModal('resource', resource)}
                className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete('resource', resource.id)}
                className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLiveClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Live Video Classes</h3>
        <button
          onClick={handleScheduleClass}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Schedule Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveClasses.filter(l => l.className === selectedClass).map((liveClass) => (
          <div key={liveClass.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div className={`p-4 ${liveClass.status === 'Active' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${liveClass.status === 'Active' ? 'bg-white text-red-600' : 'bg-white text-blue-600'
                  }`}>
                  {liveClass.status}
                </span>
                <FaVideo className="text-white text-xl" />
              </div>
              <h4 className="font-bold text-white text-lg">{liveClass.title}</h4>
              <p className="text-white text-sm opacity-90">{liveClass.subject}</p>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{liveClass.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaUsers className="mr-2 text-gray-400" />
                  <span className="font-medium">Instructor:</span>
                  <span className="ml-1">{liveClass.instructor}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaClock className="mr-2 text-gray-400" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-1">{liveClass.scheduledTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1">{liveClass.duration}</span>
                </div>
                {liveClass.status === 'Scheduled' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-gray-400" />
                    <span className="font-medium">Expected:</span>
                    <span className="ml-1">{liveClass.participants} students</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleJoinClass(liveClass.meetingLink)}
                  className={`flex-1 text-white py-2 px-3 rounded text-sm font-medium transition ${liveClass.status === 'Active'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                  <FaVideo className="inline mr-1" />
                  {liveClass.status === 'Active' ? 'Join Now' : 'Start Class'}
                </button>
                <button
                  onClick={() => handleOpenModal('live', liveClass)}
                  className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete('live', liveClass.id)}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {showJitsi && jitsiRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" id="jitsi-container">
          <div className="w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl relative">
            <button
              onClick={() => setShowJitsi(false)}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 z-10"
            >
              X
            </button>
            <JitsiMeeting
              roomName={jitsiRoom}
              configOverwrite={{
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                prejoinPageEnabled: false, // Skip the "Ready to join?" screen
                disableDeepLinking: true, // Prevent mobile app redirect prompts
                enableEmailInStats: false
              }}
              interfaceConfigOverwrite={{
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_BACKGROUND: '#1a1a1a',
                TOOLBAR_BUTTONS: [
                  'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                  'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                  'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                  'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                  'security'
                ],
              }}
              userInfo={{
                displayName: 'Teacher' // Default name to skip name prompt
              }}
              onApiReady={(externalApi) => {
                // You can add event listeners here if needed
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = '100%';
                iframeRef.style.width = '100%';
              }}
            />
          </div>
        </div>
      )}
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
              <p className="text-2xl font-bold text-blue-600">{videoClasses.filter(v => v.className === selectedClass).length}</p>
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
              <p className="text-2xl font-bold text-green-600">{quizzes.filter(q => q.status === 'Active' && q.className === selectedClass).length}</p>
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
              <p className="text-2xl font-bold text-purple-600">{resources.filter(r => r.className === selectedClass).length}</p>
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
              <p className="text-2xl font-bold text-red-600">{liveClasses.filter(c => c.status === 'Active' && c.className === selectedClass).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Select Class</h3>
        </div>
        <div className="flex space-x-2">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-lg font-medium transition ${selectedClass === className
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'live'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FaVideo className="inline mr-2" />
            Live Classes
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'videos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FaPlay className="inline mr-2" />
            Video Classes
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'quizzes'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FaQuestionCircle className="inline mr-2" />
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'resources'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FaBook className="inline mr-2" />
            Resources
          </button>
        </div>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. 45 min"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                    <input
                      type="text"
                      value={formData.thumbnail || ''}
                      onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://..."
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size / Info</label>
                    <input
                      type="text"
                      value={formData.size || ''}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g. 2.5 MB"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                    <input
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
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition ${showModal.type === 'video' ? 'bg-blue-600 hover:bg-blue-700' :
                    showModal.type === 'quiz' ? 'bg-green-600 hover:bg-green-700' :
                      showModal.type === 'resource' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
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