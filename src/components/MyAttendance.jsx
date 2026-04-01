import React, { useState, useEffect } from 'react';
import { FaCalendar, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

const MyAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get logged in teacher name from localStorage or context
  const teacherName = localStorage.getItem('teacherName') || 'Current Teacher';

  useEffect(() => {
    // Load attendance from localStorage (shared with Staff Panel)
    const allAttendance = JSON.parse(localStorage.getItem('teacherAttendance') || '[]');
    
    // If no data exists, add dummy data
    if (allAttendance.length === 0) {
      const dummyData = [
        { id: 1, teacherName: teacherName, date: '2024-01-15', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
        { id: 2, teacherName: teacherName, date: '2024-01-16', status: 'Present', checkIn: '09:15 AM', checkOut: '05:30 PM', workingHours: 8.25 },
        { id: 3, teacherName: teacherName, date: '2024-01-17', status: 'Late', checkIn: '09:45 AM', checkOut: '05:30 PM', workingHours: 7.75 },
        { id: 4, teacherName: teacherName, date: '2024-01-18', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
        { id: 5, teacherName: teacherName, date: '2024-01-19', status: 'Present', checkIn: '09:10 AM', checkOut: '05:30 PM', workingHours: 8.33 },
        { id: 6, teacherName: teacherName, date: '2024-01-22', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
        { id: 7, teacherName: teacherName, date: '2024-01-23', status: 'Absent', checkIn: '-', checkOut: '-', workingHours: 0 },
        { id: 8, teacherName: teacherName, date: '2024-01-24', status: 'Present', checkIn: '09:05 AM', checkOut: '05:30 PM', workingHours: 8.42 },
        { id: 9, teacherName: teacherName, date: '2024-01-25', status: 'Leave', checkIn: '-', checkOut: '-', workingHours: 0 },
        { id: 10, teacherName: teacherName, date: '2024-01-26', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
      ];
      localStorage.setItem('teacherAttendance', JSON.stringify(dummyData));
      setAttendanceRecords(dummyData);
    } else {
      // Filter only current teacher's attendance
      const myAttendance = allAttendance.filter(record => record.teacherName === teacherName);
      setAttendanceRecords(myAttendance);
    }
  }, [teacherName]);

  const filteredRecords = attendanceRecords.filter(r =>
    (r.date.includes(searchTerm)) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedData = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700';
      case 'Absent': return 'bg-red-100 text-red-700';
      case 'Late': return 'bg-yellow-100 text-yellow-700';
      case 'Leave': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <MdCheckCircle className="text-green-600" />;
      case 'Absent': return <MdCancel className="text-red-600" />;
      default: return <FaCalendar className="text-slate-600" />;
    }
  };

  const stats = {
    totalRecords: attendanceRecords.length,
    presentCount: attendanceRecords.filter(r => r.status === 'Present').length,
    absentCount: attendanceRecords.filter(r => r.status === 'Absent').length,
    lateCount: attendanceRecords.filter(r => r.status === 'Late').length,
    avgWorkingHours: attendanceRecords.length > 0 
      ? (attendanceRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0) / attendanceRecords.length).toFixed(1)
      : 0
  };

  const attendancePercentage = attendanceRecords.length > 0
    ? ((stats.presentCount / attendanceRecords.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">View your attendance records and working hours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Total Days</p>
          <p className="text-2xl font-black text-blue-900">{stats.totalRecords}</p>
          <p className="text-xs text-blue-600 mt-1">Recorded</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-4">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">Present</p>
          <p className="text-2xl font-black text-green-900">{stats.presentCount}</p>
          <p className="text-xs text-green-600 mt-1">Days</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200 p-4">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Absent</p>
          <p className="text-2xl font-black text-red-900">{stats.absentCount}</p>
          <p className="text-xs text-red-600 mt-1">Days</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-4">
          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Late</p>
          <p className="text-2xl font-black text-yellow-900">{stats.lateCount}</p>
          <p className="text-xs text-yellow-600 mt-1">Days</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-4">
          <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">Attendance %</p>
          <p className="text-2xl font-black text-purple-900">{attendancePercentage}%</p>
          <p className="text-xs text-purple-600 mt-1">Overall</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by date..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Check Out</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((record, idx) => (
                  <tr key={record.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{record.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{record.checkIn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{record.checkOut || '-'}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">{record.workingHours || 0}h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div className="text-sm text-slate-600 font-medium">
              Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} items
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="text-xs" /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-lg scale-110'
                          : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;
