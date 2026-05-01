import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { 
  FaUserCheck, 
  FaUsers, 
  FaCalendarAlt,
  FaChartBar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaSave,
  FaSpinner,
  FaChalkboardTeacher,
  FaFingerprint,
  FaMobileAlt,
  FaRobot,
  FaSync,
  FaUserEdit,
  FaFileExcel
} from 'react-icons/fa'
import { getDashboardStats, markAttendance, getStudentsForAttendance, getAttendanceByClass } from '../api'
import api from '../api'

const StudentAttendance = () => {
  const [assignedClass, setAssignedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isClassTeacher, setIsClassTeacher] = useState(false)
  const [isSubstitute, setIsSubstitute] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [modifiedStudents, setModifiedStudents] = useState(new Set())
  const [sysSettings, setSysSettings] = useState(null)
  const studentListRef = useRef(null)
  const pollingRef = useRef(null)

  const [classesList, setClassesList] = useState([])

  useEffect(() => {
    fetchData()
    fetchSystemSettings()
    
    // Start real-time polling every 5 seconds
    startPolling()
    
    return () => stopPolling()
  }, [])

  useEffect(() => {
    if (assignedClass) {
      fetchStudentsAndAttendance()
    }
  }, [assignedClass, selectedDate])

  const startPolling = () => {
    if (pollingRef.current || !assignedClass) return
    pollingRef.current = setInterval(() => {
        if (assignedClass && !editMode) {
            silentUpdate()
        }
    }, 5000)
  }

  const stopPolling = () => {
    if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
    }
  }

  const fetchSystemSettings = async () => {
    try {
        const { data } = await api.get('/dashboard/attendance-settings')
        if (data.success) {
            setSysSettings(data.data)
        }
    } catch (e) {
        console.error('Settings fetch error', e)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const { getTeacherClasses } = await import('../api');
      const response = await getTeacherClasses()
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const classes = response.data.data;
        setClassesList(classes)
        
        const defaultClass = classes.find(c => c.isAssigned || c.isSubstitute) || classes[0];
        
        setAssignedClass({
          id: defaultClass.classId,
          sectionId: defaultClass.sectionId,
          name: defaultClass.class,
          code: defaultClass.code || '',
          stream: defaultClass.stream,
          isAssigned: defaultClass.isAssigned,
          isSubstitute: defaultClass.isSubstitute
        })
      } else {
        setError('No classes found for this teacher')
      }
    } catch (error) {
      setError(error.message)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const silentUpdate = async () => {
    try {
        const response = await getAttendanceByClass(assignedClass.id, assignedClass.sectionId, selectedDate)
        if (response.data.success) {
            const records = response.data.data || []
            const attMap = {}
            records.forEach(r => { attMap[r.studentId] = r.status })
            
            setStudents(prev => prev.map(s => {
                const r = records.find(rec => String(rec.studentId) === String(s.studentId))
                return { ...s, markedBy: r?.markedBy || s.markedBy, source: r?.source || s.source }
            }))
            
            // Only update attendanceData if we're NOT in edit mode
            if (!editMode) {
                setAttendanceData(prev => ({ ...prev, ...attMap }))
            }
        }
    } catch (e) { /* silent fail */ }
  }

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true)
      const studentsResponse = await getStudentsForAttendance(assignedClass.id, assignedClass.sectionId)
      
      if (studentsResponse.data.success) {
        const allStudents = studentsResponse.data.data || []
        const attendanceResponse = await getAttendanceByClass(assignedClass.id, assignedClass.sectionId, selectedDate)
        
        if (attendanceResponse.data.success) {
          const records = attendanceResponse.data.data || []
          const initData = {}
          allStudents.forEach(student => {
            const r = records.find(rec => String(rec.studentId) === String(student.studentId))
            initData[student.studentId] = r?.status || 'not_marked'
          })
          
          setStudents(allStudents.map(s => {
            const r = records.find(rec => String(rec.studentId) === String(s.studentId))
            return { ...s, markedBy: r?.markedBy, source: r?.source }
          }))
          setAttendanceData(initData)
          setIsAuthorized(attendanceResponse.data.isAuthorized)
          setIsClassTeacher(attendanceResponse.data.isClassTeacher)
          setIsSubstitute(attendanceResponse.data.isSubstitute)
        }
      }
    } catch (error) {
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData({ ...attendanceData, [studentId]: newStatus })
    setModifiedStudents(prev => new Set(prev).add(studentId))
  }

  const handleSaveAttendance = async () => {
    try {
      if (modifiedStudents.size === 0) {
        setEditMode(false)
        return
      }

      const records = Array.from(modifiedStudents).map(id => ({
        studentId: id,
        status: attendanceData[id]
      }))

      const response = await markAttendance({
        date: selectedDate,
        classId: assignedClass.id,
        sectionId: assignedClass.sectionId,
        attendanceData: records
      })

      if (response.data.success) {
        setEditMode(false)
        setModifiedStudents(new Set())
        toast.success('✅ Attendance saved successfully!')
        fetchStudentsAndAttendance()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source) => {
    if (source === 'biometric') return <FaFingerprint className="text-purple-500" title="Source: Biometric" />
    if (source === 'app') return <FaMobileAlt className="text-blue-500" title="Source: Mobile App" />
    if (source === 'excel') return <FaFileExcel className="text-green-600" title="Source: Excel Upload" />
    return <FaUserEdit className="text-gray-400" title="Source: Manual" />
  }

  const canMarkManually = () => {
    if (!sysSettings) return true // default allow
    if (sysSettings.studentMode === 'manual' || sysSettings.studentMode === 'hybrid') return true
    if (sysSettings.studentMode === 'biometric' && sysSettings.allowTeacherOverride) return true
    return false
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Mode Status */}
      <div className={`bg-gradient-to-r ${canMarkManually() ? 'from-indigo-500 to-indigo-700' : 'from-gray-600 to-gray-800'} text-white p-8 rounded-2xl shadow-lg relative overflow-hidden`}>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 backdrop-blur-sm">
                    {(sysSettings && sysSettings.studentMode) ? sysSettings.studentMode : 'Manual'} Mode Active
                </span>
                {sysSettings?.deviceMode === 'test' && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase border border-yellow-500">Simulation</span>
                )}
            </div>
            <h1 className="text-3xl font-bold">📋 Attendance Dashboard</h1>
            <p className="text-indigo-100 opacity-80 italic">Real-time biometric & manual sync enabled</p>
          </div>
          <div className="flex gap-3">
            {isAuthorized && canMarkManually() && (
              <button 
                onClick={() => setEditMode(!editMode)}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition shadow-xl active:scale-95"
              >
                {editMode ? 'Cancel Edit' : 'Edit Attendance'}
              </button>
            )}
            {editMode && (
              <button 
                onClick={handleSaveAttendance}
                className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-xl active:scale-95 flex items-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selective Filters */}
      {assignedClass && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Selected Class</label>
              <select
                value={`${assignedClass.id}-${assignedClass.sectionId}`}
                onChange={(e) => {
                  const s = classesList.find(c => `${c.classId}-${c.sectionId}` === e.target.value)
                  if (s) setAssignedClass({ ...assignedClass, id: s.classId, sectionId: s.sectionId, name: s.class, code: s.code, stream: s.stream })
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
              >
                {classesList.map(c => <option key={`${c.classId}-${c.sectionId}`} value={`${c.classId}-${c.sectionId}`}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class Code</label>
              <div className="bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100 font-bold text-indigo-700">{assignedClass.code || 'N/A'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attendance Date</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold" />
            </div>
            <div className="flex flex-col justify-end">
                <div className="flex items-center gap-2 text-sm font-bold text-green-600 animate-pulse">
                    <FaSync className="text-xs" />
                    <span>Live Monitoring Active</span>
                </div>
            </div>
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Roll No</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Source</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Marked By</th>
                    {editMode && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                    <tr key={s.studentId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <span className="block font-bold text-gray-900">{s.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.rollNo || '-'}</td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">{getSourceIcon(s.source)}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(attendanceData[s.studentId])}`}>
                                    {attendanceData[s.studentId] || 'Not Marked'}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-xs text-gray-500 font-medium italic">{s.markedBy || '-'}</span>
                        </td>
                        {editMode && (
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleStatusChange(s.studentId, 'present')} className={`p-2 rounded-lg transition ${attendanceData[s.studentId] === 'present' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-green-100'}`}><FaCheckCircle /></button>
                                    <button onClick={() => handleStatusChange(s.studentId, 'absent')} className={`p-2 rounded-lg transition ${attendanceData[s.studentId] === 'absent' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-red-100'}`}><FaTimesCircle /></button>
                                    <button onClick={() => handleStatusChange(s.studentId, 'late')} className={`p-2 rounded-lg transition ${attendanceData[s.studentId] === 'late' ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-yellow-100'}`}><FaClock /></button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentAttendance
