import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaPlay, FaQuestionCircle, FaBook, FaPlus, FaEye, FaEdit, FaTrash, FaUpload, FaDownload, FaVideo, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa'

const ELearning = () => {
  const [activeTab, setActiveTab] = useState('live')
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [quickLink, setQuickLink] = useState('')

  const classes = ['Class 10A', 'Class 10B', 'Class 9A']

  // Sample data
  const videoClasses = [
    {
      id: 1,
      title: 'Algebra Basics',
      subject: 'Mathematics',
      duration: '45 min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Algebra+Basics',
      views: 125,
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Quadratic Equations',
      subject: 'Mathematics',
      duration: '38 min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Quadratic+Equations',
      views: 98,
      uploadDate: '2024-01-12'
    },
    {
      id: 3,
      title: 'Geometry Fundamentals',
      subject: 'Mathematics',
      duration: '52 min',
      thumbnail: 'https://via.placeholder.com/300x200?text=Geometry+Fundamentals',
      views: 87,
      uploadDate: '2024-01-10'
    }
  ]

  const quizzes = [
    {
      id: 1,
      title: 'Algebra Quiz - Chapter 1',
      subject: 'Mathematics',
      questions: 15,
      duration: '30 min',
      attempts: 45,
      avgScore: 78,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Geometry Assessment',
      subject: 'Mathematics',
      questions: 20,
      duration: '45 min',
      attempts: 32,
      avgScore: 82,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Mid-term Practice Test',
      subject: 'Mathematics',
      questions: 25,
      duration: '60 min',
      attempts: 28,
      avgScore: 75,
      status: 'Draft'
    }
  ]

  const resources = [
    {
      id: 1,
      title: 'Mathematics Formula Sheet',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 156,
      uploadDate: '2024-01-14'
    },
    {
      id: 2,
      title: 'Practice Problems Set 1',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 134,
      uploadDate: '2024-01-12'
    },
    {
      id: 3,
      title: 'Interactive Graphs Tool',
      type: 'Link',
      size: '-',
      downloads: 89,
      uploadDate: '2024-01-10'
    }
  ]

  const liveClasses = [
    {
      id: 1,
      title: 'Demo Class - Er Mayank Pandey',
      subject: 'General',
      meetingLink: 'https://meet.jit.si/demo-class',
      scheduledTime: 'Ongoing',
      duration: 'Open Session',
      participants: 0,
      status: 'Active',
      instructor: 'Er Mayank Pandey',
      description: 'Join the demo class session'
    },
    {
      id: 2,
      title: 'Advanced Mathematics',
      subject: 'Mathematics',
      meetingLink: 'https://meet.jit.si/math-class-10a',
      scheduledTime: '2024-01-25 10:00 AM',
      duration: '45 min',
      participants: 28,
      status: 'Scheduled',
      instructor: 'You',
      description: 'Calculus and derivatives introduction'
    },
    {
      id: 3,
      title: 'Physics Lab Session',
      subject: 'Physics',
      meetingLink: 'https://meet.jit.si/physics-lab-10a',
      scheduledTime: '2024-01-25 02:00 PM',
      duration: '60 min',
      participants: 25,
      status: 'Scheduled',
      instructor: 'You',
      description: 'Practical experiments on electricity'
    }
  ]

  const handleUploadVideo = () => {
    toast.info('Video upload feature coming soon!')
  }

  const handleCreateQuiz = () => {
    toast.info('Quiz creation feature coming soon!')
  }

  const handleUploadResource = () => {
    toast.info('Resource upload feature coming soon!')
  }

  const handleJoinClass = (meetingLink) => {
    window.open(meetingLink, '_blank')
    toast.success('Opening live class in new window...')
  }

  const handleScheduleClass = () => {
    toast.info('Schedule new class feature coming soon!')
  }

  const renderVideoClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Video Classes</h3>
        <button
          onClick={handleUploadVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
        >
          <FaUpload />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoClasses.map((video) => (
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
                <button className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition">
                  <FaEdit />
                </button>
                <button className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition">
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
          onClick={handleCreateQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Quiz</span>
        </button>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
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
                <button className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition">
                  <FaEdit />
                </button>
                <button className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition">
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
          onClick={handleUploadResource}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition flex items-center space-x-2"
        >
          <FaUpload />
          <span>Upload Resource</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
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
              <button className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition">
                <FaEdit />
              </button>
              <button className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition">
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
        {liveClasses.map((liveClass) => (
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
                <button className="bg-gray-100 text-gray-600 p-2 rounded hover:bg-gray-200 transition">
                  <FaEdit />
                </button>
                <button className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition">
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
              <p className="text-2xl font-bold text-green-600">{quizzes.filter(q => q.status === 'Active').length}</p>
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
              <p className="text-2xl font-bold text-red-600">{liveClasses.filter(c => c.status === 'Active').length}</p>
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

    </div>
  )
}

export default ELearning