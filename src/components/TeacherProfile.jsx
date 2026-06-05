import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBook, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const TeacherProfile = () => {
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://erp-backend-0ab5.onrender.com/api/teacher-panel'
  const IMAGE_BASE_URL = BASE_URL.replace('/api/teacher-panel', '')

  useEffect(() => {
    fetchTeacherProfile()
  }, [])

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile')
      console.log('Profile response:', response.data)
      if (response.data.success && response.data.data) {
        // Response structure: { success: true, data: { _id, name, email, ... } }
        setTeacher(response.data.data)
      } else {
        console.error('Failed to fetch profile:', response.data.message)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!teacher || !teacher.name || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6 font-semibold transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {teacher.profileImage ? (
                  <img
                    src={teacher.profileImage.startsWith('http')
                      ? teacher.profileImage
                      : `${IMAGE_BASE_URL}/${teacher.profileImage.replace(/\\/g, '/').replace(/^\//, '')}`}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  teacher.name?.charAt(0).toUpperCase() || 'T'
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacher.name || 'N/A'}</h1>
                <p className="text-indigo-600 font-semibold text-lg">Teacher</p>
                <p className="text-gray-600 mt-1">ID: {teacher._id || 'N/A'}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                
                <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg">
                  <FaEnvelope className="text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-semibold">{teacher.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <FaPhone className="text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="text-gray-900 font-semibold">{teacher.mobile || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-pink-50 rounded-lg">
                  <FaMapMarkerAlt className="text-pink-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900 font-semibold text-sm">{teacher.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h2>
                
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <FaGraduationCap className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="text-gray-900 font-semibold uppercase">{teacher.qualification || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <FaBriefcase className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="text-gray-900 font-semibold">{teacher.experience || 'N/A'} years</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                  <FaMoneyBillWave className="text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="text-gray-900 font-semibold">₹{teacher.salary ? teacher.salary.toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Teaching Subjects</h2>
                <div className="flex flex-wrap gap-3">
                  {teacher.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm capitalize"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Class Assignment */}
            {(teacher.assignedClass || teacher.assignedSection) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Class Assignment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacher.assignedClass && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-sm text-gray-600 mb-1">Assigned Class</p>
                      <p className="text-lg font-bold text-indigo-600">{teacher.assignedClass.className || 'N/A'}</p>
                    </div>
                  )}
                  {teacher.assignedSection && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Assigned Section</p>
                      <p className="text-lg font-bold text-purple-600">Section {teacher.assignedSection.sectionName || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Branch Information */}
            {teacher.branch && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Branch Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Branch Name</p>
                    <p className="font-semibold text-gray-900">{teacher.branch.branchName || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Branch Code</p>
                    <p className="font-semibold text-gray-900">{teacher.branch.branchCode || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Branch Address</p>
                    <p className="font-semibold text-gray-900 text-sm">{teacher.branch.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherProfile
