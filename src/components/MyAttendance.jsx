import React, { useState, useEffect } from 'react';
import { FaCalendar, FaSearch, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getTeacherAttendance } from '../api';

const MyAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getTeacherAttendance(startDate, endDate);
      console.log('Teacher attendance response:', response.data);
      
      if (response.data.success) {
        const records = response.data.data || [];
        // Format the records
        const formattedRecords = records.map((record, index) => ({
          id: index + 1,
          date: new Date(record.date).toLocaleDateString('en-IN'),
          status: record.status?.charAt(0).toUpperCase() + record.status?.slice(1) || 'Not Marked',
          checkIn: record.checkIn || '-',
          checkOut: record.checkOut || '-',
          workingHours: record.workingHours || 0,
          remark: record.remark || ''
        }));
        setAttendanceRecords(formattedRecords);
      } else {
        toast.error(response.data.message || 'Failed to fetch attendance');
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance: ' + (error.response?.data?.message || error.message));
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    fetchAttendance();
  };

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
      case 'Half-day': return 'bg-purple-100 text-purple-700';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">📅 My Attendance</h1>
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

      {/* Date Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Filter
          </button>
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
            <option value="Half-day">Half Day</option>
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
                <th className="px-6 py-4 text-left text-sm font-bold">Remark</th>
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
                    <td className="px-6 py-4 text-sm text-slate-700">{record.remark || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
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
