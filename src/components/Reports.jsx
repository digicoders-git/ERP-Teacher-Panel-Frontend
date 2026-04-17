import { useState, useEffect } from 'react'
import { FaChartLine, FaChartBar, FaCalendarAlt, FaUsers, FaDownload, FaFilter, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getAcademicReport, getAttendanceReportData, getGradeDistribution, getDashboardStats, getTeacherClasses } from '../api'

const Reports = () => {
  const [activeReport, setActiveReport] = useState('academic')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [classes, setClasses] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [stats, setStats] = useState({
    avgPerformance: 0,
    topPerformers: 0,
    improvement: 0,
    avgAttendance: 0,
    totalStudents: 0,
    chronicAbsent: 0
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
      loadReportData()
    }
  }, [activeReport, selectedClass, selectedSection, selectedPeriod])


  const loadReportData = async () => {
    if (!selectedClass || !selectedSection) return

    setLoading(true)
    try {
      if (activeReport === 'academic') {
        const response = await getAcademicReport(selectedClass, selectedSection)
        if (response.data.success) {
          setReportData(response.data.data)
          updateAcademicStats(response.data.data)
          // Render charts after state update
          setTimeout(() => renderAcademicCharts(response.data.data), 100)
        }
      } else {
        const response = await getAttendanceReportData(selectedClass, selectedSection, selectedPeriod)
        if (response.data.success) {
          setReportData(response.data.data)
          updateAttendanceStats(response.data.data)
          // Render charts after state update
          setTimeout(() => renderAttendanceCharts(response.data.data), 100)
        }
      }
    } catch (error) {
      console.error('Error loading report data:', error)
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const updateAcademicStats = (data) => {
    setStats(prev => ({
      ...prev,
      avgPerformance: data?.avgSubmissionRate || 0,
      topPerformers: data?.totalStudents || 0,
      improvement: Math.round(Math.random() * 20),
      totalStudents: data?.totalStudents || 0
    }))
  }

  const updateAttendanceStats = (data) => {
    const stats_data = data?.stats || {}
    setStats(prev => ({
      ...prev,
      avgAttendance: stats_data.avgAttendance || 0,
      chronicAbsent: 0
    }))
  }

  const renderAcademicCharts = (data) => {
    if (!window.Highcharts) {
      loadHighcharts(() => renderAcademicCharts(data))
      return
    }

    // Check if containers exist
    const academicContainer = document.getElementById('academic-chart')
    const performanceContainer = document.getElementById('performance-chart')

    if (!academicContainer || !performanceContainer) {
      console.warn('Chart containers not found')
      return
    }

    try {
      // Assignment Submission Chart
      window.Highcharts.chart('academic-chart', {
        chart: { type: 'column', backgroundColor: '#f8fafc' },
        title: {
          text: 'Assignment Submission Rate',
          style: { color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }
        },
        xAxis: {
          categories: ['Submitted', 'Pending'],
          title: { text: 'Status' }
        },
        yAxis: {
          title: { text: 'Count' },
          min: 0
        },
        series: [{
          name: 'Assignments',
          data: [
            data?.totalSubmissions || 0,
            (data?.totalAssignments || 0) - (data?.totalSubmissions || 0)
          ],
          color: '#3b82f6'
        }],
        plotOptions: {
          column: { dataLabels: { enabled: true } }
        }
      })

      // Assignment Status Chart
      window.Highcharts.chart('performance-chart', {
        chart: { type: 'pie', backgroundColor: '#f8fafc' },
        title: {
          text: 'Assignment Status Distribution',
          style: { color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }
        },
        series: [{
          name: 'Assignments',
          data: [
            { name: 'Completed', y: data?.completedAssignments || 0, color: '#10b981' },
            { name: 'Pending', y: data?.pendingAssignments || 0, color: '#f59e0b' }
          ]
        }],
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y}'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error rendering academic charts:', error)
    }
  }

  const renderAttendanceCharts = (data) => {
    if (!window.Highcharts) {
      loadHighcharts(() => renderAttendanceCharts(data))
      return
    }

    // Check if containers exist
    const attendanceContainer = document.getElementById('attendance-chart')
    const pieContainer = document.getElementById('attendance-pie-chart')

    if (!attendanceContainer || !pieContainer) {
      console.warn('Chart containers not found')
      return
    }

    try {
      const trends = data?.trends || []
      const categories = trends.map(t => t.period)
      const rates = trends.map(t => t.rate)

      // Attendance Trend Chart
      window.Highcharts.chart('attendance-chart', {
        chart: { type: 'line', backgroundColor: '#f8fafc' },
        title: {
          text: 'Attendance Trend',
          style: { color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }
        },
        xAxis: {
          categories: categories.length > 0 ? categories : ['Period 1', 'Period 2', 'Period 3'],
          title: { text: 'Period' }
        },
        yAxis: {
          title: { text: 'Attendance (%)' },
          min: 0,
          max: 100
        },
        series: [{
          name: 'Attendance Rate',
          data: rates.length > 0 ? rates : [0, 0, 0],
          color: '#10b981',
          lineWidth: 2
        }],
        plotOptions: {
          line: {
            dataLabels: { enabled: false },
            enableMouseTracking: true
          }
        }
      })

      // Attendance Status Pie Chart
      const statusDist = data?.statusDistribution || {}
      const present = statusDist.present || 0
      const absent = statusDist.absent || 0
      const late = statusDist.late || 0
      const total = present + absent + late || 1

      window.Highcharts.chart('attendance-pie-chart', {
        chart: { type: 'pie', backgroundColor: '#f8fafc' },
        title: {
          text: 'Overall Attendance Status',
          style: { color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }
        },
        series: [{
          name: 'Students',
          data: [
            { name: 'Present', y: (present / total) * 100, color: '#10b981' },
            { name: 'Absent', y: (absent / total) * 100, color: '#ef4444' },
            { name: 'Late', y: (late / total) * 100, color: '#f59e0b' }
          ]
        }],
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.percentage:.1f}%'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error rendering attendance charts:', error)
    }
  }

  const loadHighcharts = (callback) => {
    if (!window.Highcharts) {
      const script = document.createElement('script')
      script.src = 'https://code.highcharts.com/highcharts.js'
      script.onload = callback
      script.onerror = () => {
        console.error('Failed to load Highcharts')
        toast.error('Failed to load chart library')
      }
      document.head.appendChild(script)
    } else {
      callback()
    }
  }

  const exportReport = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `${activeReport}-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Report exported successfully!')
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 mt-9 md:grid-cols-3 gap-6">
        {activeReport === 'academic' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Submission Rate</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgPerformance}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaChartBar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Assignments</h3>
                  <p className="text-2xl font-bold text-purple-600">{reportData?.totalAssignments || 0}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Avg Attendance</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.avgAttendance}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Present</h3>
                  <p className="text-2xl font-bold text-blue-600">{reportData?.stats?.totalPresent || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaFilter className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Absent</h3>
                  <p className="text-2xl font-bold text-red-600">{reportData?.stats?.totalAbsent || 0}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-500 mt-9 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-blue-100">Academic performance and attendance analysis</p>
          </div>
          <FaChartLine className="text-4xl opacity-80" />
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Report Type</h3>
          <button
            onClick={exportReport}
            disabled={loading || !reportData}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2 disabled:opacity-60"
          >
            <FaDownload />
            <span>Export JSON</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
            <select
              value={`${selectedClass}-${selectedSection}`}
              onChange={(e) => {
                const [cid, sid] = e.target.value.split('-')
                setSelectedClass(cid)
                setSelectedSection(sid)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {classes.map(cls => (
                <option key={`${cls.classId}-${cls.sectionId}`} value={`${cls.classId}-${cls.sectionId}`}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveReport('academic')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeReport === 'academic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Academic Reports
          </button>
          <button
            onClick={() => setActiveReport('attendance')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeReport === 'attendance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaUsers className="inline mr-2" />
            Attendance Reports
          </button>
        </div>

        {/* Filters */}
        {activeReport === 'attendance' && (
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refresh</label>
              <button
                onClick={loadReportData}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Load Report'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : activeReport === 'academic' ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="academic-chart" style={{ height: '400px', minHeight: '400px' }}></div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="performance-chart" style={{ height: '300px', minHeight: '300px' }}></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="attendance-chart" style={{ height: '400px', minHeight: '400px' }}></div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="attendance-pie-chart" style={{ height: '300px', minHeight: '300px' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
