import { useState, useEffect } from 'react'
import { FaChartLine, FaChartBar, FaCalendarAlt, FaUsers, FaDownload, FaFilter } from 'react-icons/fa'

const Reports = () => {
  const [activeReport, setActiveReport] = useState('academic')
  const [selectedClass, setSelectedClass] = useState('Class 10A')
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const classes = ['Class 10A', 'Class 10B', 'Class 9A']

  useEffect(() => {
    // Load Highcharts dynamically
    const loadHighcharts = async () => {
      if (!window.Highcharts) {
        const script = document.createElement('script')
        script.src = 'https://code.highcharts.com/highcharts.js'
        script.onload = () => {
          renderCharts()
        }
        document.head.appendChild(script)
      } else {
        renderCharts()
      }
    }
    loadHighcharts()
  }, [activeReport, selectedClass, selectedPeriod])

  const renderCharts = () => {
    if (!window.Highcharts) return

    if (activeReport === 'academic') {
      renderAcademicChart()
    } else {
      renderAttendanceChart()
    }
  }

  const renderAcademicChart = () => {
    window.Highcharts.chart('academic-chart', {
      chart: {
        type: 'line',
        backgroundColor: '#f8fafc'
      },
      title: {
        text: `Academic Performance Trends - ${selectedClass}`,
        style: { color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: { text: 'Months' }
      },
      yAxis: {
        title: { text: 'Average Marks (%)' },
        min: 0,
        max: 100
      },
      series: [{
        name: 'Mathematics',
        data: [75, 78, 82, 85, 88, 90, 87, 89, 92, 94, 91, 95],
        color: '#3b82f6'
      }, {
        name: 'Science',
        data: [70, 72, 75, 78, 80, 82, 85, 87, 89, 88, 90, 92],
        color: '#10b981'
      }, {
        name: 'English',
        data: [68, 70, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91],
        color: '#f59e0b'
      }],
      plotOptions: {
        line: {
          dataLabels: { enabled: false },
          enableMouseTracking: true
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      }
    })

    // Performance Distribution Chart
    window.Highcharts.chart('performance-chart', {
      chart: {
        type: 'column',
        backgroundColor: '#f8fafc'
      },
      title: {
        text: 'Grade Distribution',
        style: { color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
      },
      yAxis: {
        title: { text: 'Number of Students' }
      },
      series: [{
        name: 'Students',
        data: [8, 12, 15, 18, 12, 8, 3, 1],
        color: '#8b5cf6'
      }],
      plotOptions: {
        column: {
          dataLabels: { enabled: true }
        }
      }
    })
  }

  const renderAttendanceChart = () => {
    const attendanceData = selectedPeriod === 'monthly' 
      ? [92, 89, 94, 91, 88, 93, 90, 87, 95, 89, 91, 94]
      : [90, 88, 92, 89, 91, 93, 87, 90, 94, 88, 92, 91]

    window.Highcharts.chart('attendance-chart', {
      chart: {
        type: 'area',
        backgroundColor: '#f8fafc'
      },
      title: {
        text: `Attendance Analysis - ${selectedClass} (${selectedPeriod})`,
        style: { color: '#1f2937', fontSize: '18px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: selectedPeriod === 'monthly' 
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
      },
      yAxis: {
        title: { text: 'Attendance (%)' },
        min: 0,
        max: 100
      },
      series: [{
        name: 'Attendance Rate',
        data: attendanceData,
        color: '#10b981',
        fillOpacity: 0.3
      }],
      plotOptions: {
        area: {
          marker: { enabled: false },
          lineWidth: 2
        }
      }
    })

    // Attendance Status Pie Chart
    window.Highcharts.chart('attendance-pie-chart', {
      chart: {
        type: 'pie',
        backgroundColor: '#f8fafc'
      },
      title: {
        text: 'Overall Attendance Status',
        style: { color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }
      },
      series: [{
        name: 'Students',
        data: [
          { name: 'Present', y: 85, color: '#10b981' },
          { name: 'Absent', y: 10, color: '#ef4444' },
          { name: 'Late', y: 5, color: '#f59e0b' }
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
  }

  const exportReport = () => {
    const chart = window.Highcharts.charts[0]
    if (chart) {
      chart.exportChart({
        type: 'application/pdf',
        filename: `${activeReport}-report-${selectedClass}`
      })
    }
  }

  return (
    <div className="space-y-6">
      {/*states*/}
        <div className="grid grid-cols-1 mt-9 md:grid-cols-3 gap-6">
        {activeReport === 'academic' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Avg Performance</h3>
                  <p className="text-2xl font-bold text-blue-600">87.5%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
                  <p className="text-2xl font-bold text-green-600">23</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaChartBar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Improvement</h3>
                  <p className="text-2xl font-bold text-purple-600">+12%</p>
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
                  <p className="text-2xl font-bold text-green-600">91.2%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Best Month</h3>
                  <p className="text-2xl font-bold text-blue-600">Sep</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaFilter className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Chronic Absent</h3>
                  <p className="text-2xl font-bold text-red-600">3</p>
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
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
          >
            <FaDownload />
            <span>Export PDF</span>
          </button>
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
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
          
          {activeReport === 'attendance' && (
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
          )}
        </div>
      </div>

      {/* Charts Section */}
      {activeReport === 'academic' ? (
        <div className="space-y-6">
          {/* Academic Performance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="academic-chart" style={{ height: '400px' }}></div>
          </div>
          
          {/* Grade Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="performance-chart" style={{ height: '300px' }}></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Attendance Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="attendance-chart" style={{ height: '400px' }}></div>
          </div>
          
          {/* Attendance Status Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div id="attendance-pie-chart" style={{ height: '300px' }}></div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
    
    </div>
  )
}

export default Reports