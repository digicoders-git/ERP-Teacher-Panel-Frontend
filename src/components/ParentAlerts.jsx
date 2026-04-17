import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaBell, FaSms, FaEnvelope, FaUsers, FaCheck, FaClock, FaExclamationTriangle, FaSpinner, FaPlus, FaTimes } from 'react-icons/fa'
import { sendSMSAlert, sendEmailAlert, sendBulkAlerts, getAlertHistory, getAbsentStudents, getDashboardStats, getClassStudents, getTeacherClasses } from '../api'

const ParentAlerts = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [absentStudents, setAbsentStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [alertHistory, setAlertHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const [customMessage, setCustomMessage] = useState({
    studentId: '',
    type: 'sms',
    message: '',
    subject: 'Message from School'
  })

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
      setPageLoading(false)
    } catch (err) {
      toast.error('Failed to load classes')
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadAbsentStudents()
      loadAllStudents()
      loadAlertHistory()
    }
  }, [selectedClass, selectedSection])


  const loadAbsentStudents = async () => {
    try {
      const response = await getAbsentStudents(selectedClass, selectedSection)
      if (response.data.success) {
        setAbsentStudents(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading absent students:', error)
    }
  }

  const loadAllStudents = async () => {
    try {
      const response = await getClassStudents(selectedClass, selectedSection)
      if (response.data.success) {
        setAllStudents(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading all students:', error)
    }
  }

  const loadAlertHistory = async () => {
    try {
      const response = await getAlertHistory(10)
      if (response.data.success) {
        setAlertHistory(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading alert history:', error)
    }
  }

  const sendAlert = async (student, type) => {
    setLoading(true)
    try {
      const payload = {
        studentId: student.studentId || student.id,
        message: `Dear Parent, Your child ${student.name} was marked absent today.`
      }

      if (type === 'email') {
        payload.subject = 'Student Absence Notification'
        await sendEmailAlert(payload)
      } else {
        await sendSMSAlert(payload)
      }

      toast.success(`${type.toUpperCase()} alert sent to ${student.name}'s parents!`)
      loadAlertHistory()
    } catch (error) {
      console.error('Error sending alert:', error)
      toast.error(error.response?.data?.message || `Failed to send ${type} alert`)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkAlertsToAll = async (type) => {
    if (absentStudents.length === 0) {
      toast.warning('No absent students found!')
      return
    }

    setLoading(true)
    try {
      const payload = {
        classId: selectedClass,
        sectionId: selectedSection,
        type: type,
        message: 'Your child was marked absent today. Please contact the school for more information.',
        subject: 'Student Absence Notification'
      }

      const response = await sendBulkAlerts(payload)
      toast.success(`${type.toUpperCase()} alerts sent to ${response.data.count} parents!`)
      loadAlertHistory()
    } catch (error) {
      console.error('Error sending bulk alerts:', error)
      toast.error(error.response?.data?.message || `Failed to send bulk ${type} alerts`)
    } finally {
      setLoading(false)
    }
  }

  const sendCustomAlert = async () => {
    if (!customMessage.studentId) {
      toast.error('Please select a student')
      return
    }
    if (!customMessage.message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setLoading(true)
    try {
      const payload = {
        studentId: customMessage.studentId,
        message: customMessage.message
      }

      if (customMessage.type === 'email') {
        payload.subject = customMessage.subject
        await sendEmailAlert(payload)
      } else {
        await sendSMSAlert(payload)
      }

      toast.success(`${customMessage.type.toUpperCase()} sent successfully!`)
      resetCustomForm()
      loadAlertHistory()
    } catch (error) {
      console.error('Error sending custom alert:', error)
      toast.error(error.response?.data?.message || 'Failed to send alert')
    } finally {
      setLoading(false)
    }
  }

  const resetCustomForm = () => {
    setCustomMessage({
      studentId: '',
      type: 'sms',
      message: '',
      subject: 'Message from School'
    })
    setSelectedStudent(null)
    setShowCustomForm(false)
  }

  const getAlertIcon = (type) => {
    return type === 'sms' ? <FaSms className="text-blue-600" /> : <FaEnvelope className="text-green-600" />
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
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
            <h1 className="text-2xl font-bold mb-2">Parent Alerts</h1>
            <p className="text-blue-100">Send SMS/Email alerts to parents regarding students</p>
          </div>
          <FaBell className="text-4xl opacity-80" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <select
          value={`${selectedClass}-${selectedSection}`}
          onChange={(e) => {
            const [cid, sid] = e.target.value.split('-')
            setSelectedClass(cid)
            setSelectedSection(sid)
          }}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {classes.map(cls => (
            <option key={`${cls.classId}-${cls.sectionId}`} value={`${cls.classId}-${cls.sectionId}`}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Message Form */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        showCustomForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Send Custom Message</h3>
            <button
              onClick={resetCustomForm}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
              <select
                value={customMessage.studentId}
                onChange={(e) => {
                  const student = allStudents.find(s => s.studentId === e.target.value)
                  setCustomMessage({ ...customMessage, studentId: e.target.value })
                  setSelectedStudent(student)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose a student...</option>
                {allStudents.map(student => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.name} (Roll No: {student.rollNo})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Info */}
            {selectedStudent && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Student Details</p>
                <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                <p className="text-sm text-gray-600">Roll No: {selectedStudent.rollNo}</p>
                {selectedStudent.phone && <p className="text-sm text-gray-600">Phone: {selectedStudent.phone}</p>}
                {selectedStudent.email && <p className="text-sm text-gray-600">Email: {selectedStudent.email}</p>}
              </div>
            )}

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="sms"
                    checked={customMessage.type === 'sms'}
                    onChange={(e) => setCustomMessage({ ...customMessage, type: e.target.value })}
                    className="mr-2"
                  />
                  <FaSms className="mr-2 text-blue-600" />
                  <span>SMS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={customMessage.type === 'email'}
                    onChange={(e) => setCustomMessage({ ...customMessage, type: e.target.value })}
                    className="mr-2"
                  />
                  <FaEnvelope className="mr-2 text-green-600" />
                  <span>Email</span>
                </label>
              </div>
            </div>

            {/* Email Subject (only for email) */}
            {customMessage.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={customMessage.subject}
                  onChange={(e) => setCustomMessage({ ...customMessage, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Email subject"
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={customMessage.message}
                onChange={(e) => setCustomMessage({ ...customMessage, message: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your message here..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {customMessage.message.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={sendCustomAlert}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaBell />}
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
              <button
                onClick={resetCustomForm}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-semibold"
        >
          <FaPlus />
          <span>Send Custom Message to Parent</span>
        </button>
      </div>

      {/* Absent Students */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            Absent Students ({absentStudents.length})
          </h3>
          {absentStudents.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => sendBulkAlertsToAll('sms')}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSms />
                <span>Send All SMS</span>
              </button>
              <button
                onClick={() => sendBulkAlertsToAll('email')}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <FaEnvelope />
                <span>Send All Email</span>
              </button>
            </div>
          )}
        </div>

        {absentStudents.length === 0 ? (
          <div className="text-center py-8">
            <FaCheck className="mx-auto text-4xl text-green-400 mb-4" />
            <p className="text-gray-500">No absent students today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absentStudents.map((student) => (
              <div key={student.id || student.studentId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-red-600">{student.rollNo}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{student.name}</h4>
                    <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => sendAlert(student, 'sms')}
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                    title="Send SMS"
                  >
                    <FaSms />
                  </button>
                  <button
                    onClick={() => sendAlert(student, 'email')}
                    disabled={loading}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                    title="Send Email"
                  >
                    <FaEnvelope />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert History */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaClock className="text-blue-500 mr-2" />
          Recent Alerts
        </h3>
        
        {alertHistory.length === 0 ? (
          <div className="text-center py-8">
            <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">No alerts sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertHistory.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{alert.studentName}</h4>
                    <p className="text-sm text-gray-600">
                      Roll No: {alert.rollNo}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {alert.status}
                    </span>
                    <span className="text-xs text-gray-500 uppercase font-medium">
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Sending alert...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParentAlerts
