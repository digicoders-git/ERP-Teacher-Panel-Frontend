import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaBell, FaSms, FaEnvelope, FaUsers, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa'

const ParentAlerts = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [absentStudents, setAbsentStudents] = useState([])
  const [alertHistory, setAlertHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const classes = ['Class 10A', 'Class 10B', 'Class 9A']

  useEffect(() => {
    loadAbsentStudents()
    loadAlertHistory()
  }, [selectedClass])

  const loadAbsentStudents = () => {
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}')
    const classStudents = attendanceData[selectedClass] || []
    const absent = classStudents.filter(student => student.status === 'Absent')
    setAbsentStudents(absent)
  }

  const loadAlertHistory = () => {
    const history = JSON.parse(localStorage.getItem('alertHistory') || '[]')
    setAlertHistory(history.slice(0, 10)) // Show last 10 alerts
  }

  const sendAlert = async (student, type) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const alertRecord = {
      id: Date.now(),
      studentName: student.name,
      rollNo: student.rollNo,
      className: selectedClass,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    const updatedHistory = [alertRecord, ...alertHistory]
    setAlertHistory(updatedHistory.slice(0, 10))
    localStorage.setItem('alertHistory', JSON.stringify(updatedHistory))
    
    setLoading(false)
    toast.success(`${type.toUpperCase()} alert sent to ${student.name}'s parents!`)
  }

  const sendBulkAlerts = async (type) => {
    if (absentStudents.length === 0) {
      toast.warning('No absent students found!')
      return
    }

    setLoading(true)
    
    // Simulate bulk API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const bulkAlerts = absentStudents.map(student => ({
      id: Date.now() + Math.random(),
      studentName: student.name,
      rollNo: student.rollNo,
      className: selectedClass,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }))

    const updatedHistory = [...bulkAlerts, ...alertHistory]
    setAlertHistory(updatedHistory.slice(0, 10))
    localStorage.setItem('alertHistory', JSON.stringify(updatedHistory))
    
    setLoading(false)
    toast.success(`${type.toUpperCase()} alerts sent to ${absentStudents.length} parents!`)
  }

  const getAlertIcon = (type) => {
    return type === 'sms' ? <FaSms className="text-blue-600" /> : <FaEnvelope className="text-green-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Parent Alerts</h1>
            <p className="text-blue-100">Send SMS/Email alerts to parents for absent students</p>
          </div>
          <FaBell className="text-4xl opacity-80" />
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Class</h3>
        <div className="flex space-x-2">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedClass === className
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {className}
            </button>
          ))}
        </div>
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
                onClick={() => sendBulkAlerts('sms')}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSms />
                <span>Send All SMS</span>
              </button>
              <button
                onClick={() => sendBulkAlerts('email')}
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
            <p className="text-gray-500">No absent students in {selectedClass} today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {absentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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
              <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{alert.studentName}</h4>
                    <p className="text-sm text-gray-600">
                      {alert.className} • Roll No: {alert.rollNo}
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
              <span>Sending alerts...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParentAlerts