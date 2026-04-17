import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaClock, 
  FaCalendarAlt,
  FaUserGraduate,
  FaEye,
  FaSpinner,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFilter
} from 'react-icons/fa'
import { getTeacherClasses } from '../api'

const MyClasses = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filterStream, setFilterStream] = useState('all')
  const [streams, setStreams] = useState([])

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [classes, searchTerm, filterStream])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getTeacherClasses()
      if (response.data.success) {
        const classesData = response.data.data || []
        setClasses(classesData)
        
        // Extract unique streams
        const uniqueStreams = [...new Set(classesData.flatMap(c => c.stream || []))]
        setStreams(uniqueStreams)
      } else {
        setError(response.data.message || 'Failed to load classes')
        toast.error('Failed to load classes')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setError(error.message)
      toast.error('Failed to load classes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = classes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cls => 
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Stream filter
    if (filterStream !== 'all') {
      filtered = filtered.filter(cls => 
        cls.stream && cls.stream.includes(filterStream)
      )
    }

    setFilteredClasses(filtered)
    setCurrentPage(1)
  }

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchClasses}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const totalStudents = classes.reduce((sum, cls) => sum + (cls.students || 0), 0)
  const avgAttendance = classes.length > 0 ? Math.round(classes.reduce((sum, cls) => sum + (cls.attendance || 0), 0) / classes.length) : 0

  const handleViewClass = (classItem) => {
    navigate(`/dashboard/class-detail/${classItem.id}`)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Classes</h1>
            <p className="text-indigo-100">Manage and monitor your assigned classes</p>
          </div>
          <FaChalkboardTeacher className="text-5xl opacity-30" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <FaChalkboardTeacher className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Classes</h3>
              <p className="text-3xl font-bold text-blue-600">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <FaUsers className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Students</h3>
              <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-4 rounded-lg">
              <FaUserGraduate className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Avg Attendance</h3>
              <p className="text-3xl font-bold text-purple-600">{avgAttendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by class, section, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Stream Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-600" />
            <select
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Streams</option>
              {streams.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Section</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Stream</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Students</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Attendance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClasses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <p className="text-lg">No classes found</p>
                  </td>
                </tr>
              ) : (
                paginatedClasses.map((classItem, index) => (
                  <tr key={classItem.id || index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {classItem.class && classItem.class.trim() ? classItem.class : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {classItem.section && classItem.section.trim() ? classItem.section : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {classItem.subject && classItem.subject.trim() ? classItem.subject : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {classItem.stream && classItem.stream.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {classItem.stream.map((s, i) => (
                            <span key={i} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {classItem.students || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              classItem.attendance >= 80 ? 'bg-green-500' :
                              classItem.attendance >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${classItem.attendance || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-10">
                          {classItem.attendance || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {classItem.isAssigned ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Assigned
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Timetable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => handleViewClass(classItem)}
                        className="inline-flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                      >
                        <FaEye className="text-sm" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredClasses.length)}</span> of <span className="font-semibold">{filteredClasses.length}</span> classes
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyClasses
