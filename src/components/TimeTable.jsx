import { useState, useEffect } from 'react'
import { FaClock, FaCalendarAlt, FaChalkboardTeacher, FaMapMarkerAlt, FaUsers, FaTable, FaThLarge, FaPrint, FaSpinner } from 'react-icons/fa'
import { getAllTimetables } from '../api'

const TimeTable = () => {
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : 'Monday')

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:30 - 01:30', '01:30 - 02:30', '02:30 - 03:30', '03:30 - 04:30'
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getAllTimetables()
      if (response.data.success) {
        setTimetable(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSlot = (day, time) => {
    return timetable.find(t => t.day === day && (t.startTime + ' - ' + t.endTime === time || time.startsWith(t.startTime)))
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FaSpinner className="animate-spin text-indigo-600 text-4xl mb-4" />
      <p className="text-slate-500 font-bold">Loading Academic Schedule...</p>
    </div>
  )

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <FaCalendarAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Teaching Schedule</h1>
            <p className="text-slate-500 text-sm font-medium">Weekly academic workplan and class assignments</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button 
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaTable /> Weekly Table
          </button>
          <button 
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaThLarge /> Daily Cards
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Weekly Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-r border-slate-100 w-32 sticky left-0 bg-slate-50 z-10">Day / Time</th>
                  {timeSlots.map((time, idx) => (
                    <th key={idx} className="p-4 text-center border-b border-r border-slate-100 min-w-[180px]">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Period {idx + 1}</div>
                      <div className="text-sm font-bold text-slate-700">{time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 border-b border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col">
                        <span>{day}</span>
                        {day === today && <span className="text-[9px] text-indigo-600 font-black tracking-widest mt-0.5">TODAY</span>}
                      </div>
                    </td>
                    {timeSlots.map((time, idx) => {
                      const slot = getSlot(day, time)
                      return (
                        <td key={idx} className="p-3 border-b border-r border-slate-100 min-h-[100px]">
                          {slot ? (
                            <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all group/slot cursor-default h-full">
                              <div className="font-bold text-sm mb-1 leading-tight">{slot.subject}</div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70 mb-1.5">
                                <FaUsers className="text-[10px]" />
                                <span>
                                  {slot.classId?.className || slot.className}
                                  {slot.classId?.stream && slot.classId.stream.length > 0 && ` (${slot.classId.stream.join(', ')})`}
                                  {' • '}
                                  {slot.sectionId?.sectionName || 'N/A'}
                                </span>
                              </div>
                              {slot.room && (
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase opacity-60">
                                  <FaMapMarkerAlt size={8} /> Room {slot.room}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-slate-200 text-xs font-medium text-center py-4">—</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Daily Cards View */
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {days.map(day => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedDay === day ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-400'}`}
              >
                {day} {day === today && '• Today'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timetable.filter(t => t.day === selectedDay).length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
                <FaChalkboardTeacher className="text-slate-200 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No Classes Scheduled</h3>
                <p className="text-slate-400 text-sm italic">You don't have any classes assigned for {selectedDay}.</p>
              </div>
            ) : (
              timetable
                .filter(t => t.day === selectedDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(slot => (
                  <div key={slot._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FaClock />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Slot</p>
                        <p className="text-sm font-black text-slate-700">{slot.startTime} - {slot.endTime}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{slot.subject}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <FaUsers className="text-indigo-400" />
                        <span>
                          {slot.classId?.className || slot.className}
                          {slot.classId?.stream && slot.classId.stream.length > 0 && ` (${slot.classId.stream.join(', ')})`}
                          {' • '}
                          {slot.sectionId?.sectionName || 'N/A'}
                        </span>
                      </div>
                      {slot.room && (
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <FaMapMarkerAlt className="text-indigo-400" />
                          <span>Room {slot.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
      
      {/* Footer / Help */}
      <div className="text-center pb-10">
        <p className="text-xs text-slate-400 font-medium">Contact administration if you notice any discrepancies in your schedule.</p>
      </div>
    </div>
  )
}

export default TimeTable;
