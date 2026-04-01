import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaChevronLeft, FaChevronRight, FaCalendar } from 'react-icons/fa';
import { MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';

const TeacherAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, teacherName: 'Rajesh Kumar', date: '2024-01-15', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
    { id: 2, teacherName: 'Rajesh Kumar', date: '2024-01-16', status: 'Present', checkIn: '09:15 AM', checkOut: '05:30 PM', workingHours: 8.25 },
    { id: 3, teacherName: 'Priya Singh', date: '2024-01-15', status: 'Absent', checkIn: '-', checkOut: '-', workingHours: 0 },
    { id: 4, teacherName: 'Priya Singh', date: '2024-01-16', status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workingHours: 8.5 },
    { id: 5, teacherName: 'Amit Patel', date: '2024-01-15', status: 'Late', checkIn: '09:45 AM', checkOut: '05:30 PM', workingHours: 7.75 }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    teacherName: '',
    date: '',
    status: 'Present',
    checkIn: '',
    checkOut: ''
  });

  const filteredRecords = attendanceRecords.filter(r =>
    (r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.date.includes(searchTerm)) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedData = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateWorkingHours = () => {
    if (formData.status === 'Absent' || !formData.checkIn || !formData.checkOut) return 0;
    
    const [inHour, inMin] = formData.checkIn.split(':').map(Number);
    const [outHour, outMin] = formData.checkOut.split(':').map(Number);
    
    const inTime = inHour + inMin / 60;
    const outTime = outHour + outMin / 60;
    
    return Math.max(0, outTime - inTime).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const workingHours = calculateWorkingHours();
    
    if (editingId) {
      setAttendanceRecords(attendanceRecords.map(r => 
        r.id === editingId ? { ...formData, id: editingId, workingHours } : r
      ));
      setEditingId(null);
    } else {
      setAttendanceRecords([...attendanceRecords, { ...formData, id: Date.now(), workingHours }]);
    }
    setFormData({ teacherName: '', date: '', status: 'Present', checkIn: '', checkOut: '' });
    setShowForm(false);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAttendanceRecords(attendanceRecords.filter(r => r.id !== id));
  };

  const handleAddNew = () => {
    setFormData({ teacherName: '', date: '', status: 'Present', checkIn: '', checkOut: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700';
      case 'Absent': return 'bg-red-100 text-red-700';
      case 'Late': return 'bg-yellow-100 text-yellow-700';
      case 'Leave': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <MdCheckCircle className="text-green-600" />;
      case 'Absent': return <MdCancel className="text-red-600" />;
      default: return <FaCalendar className="text-gray-600" />;
    }
  };

  const stats = {
    totalRecords: attendanceRecords.length,
    presentCount: attendanceRecords.filter(r => r.status === 'Present').length,
    absentCount: attendanceRecords.filter(r => r.status === 'Absent').length,
    lateCount: attendanceRecords.filter(r => r.status === 'Late').length,
    avgWorkingHours: (attendanceRecords.reduce((sum, r) => sum + r.workingHours, 0) / attendanceRecords.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Track daily attendance and working hours</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          <FaPlus /> Mark Attendance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Total Records</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalRecords}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-xs font-semibold text-green-700 uppercase mb-1">Present</p>
          <p className="text-2xl font-bold text-green-900">{stats.presentCount}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-xs font-semibold text-red-700 uppercase mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-900">{stats.absentCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <p className="text-xs font-semibold text-yellow-700 uppercase mb-1">Late</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.lateCount}</p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
          <p className="text-xs font-semibold text-purple-700 uppercase mb-1">Avg Hours</p>
          <p className="text-2xl font-bold text-purple-900">{stats.avgWorkingHours}h</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by teacher name or date..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-indigo-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingId ? 'Edit Attendance' : 'Mark Attendance'}</h2>
                <button onClick={() => setShowForm(false)} className="hover:bg-indigo-700 p-2 rounded-lg transition-all">
                  <MdClose size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher Name *</label>
                    <input
                      type="text"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter teacher name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>

                {formData.status !== 'Absent' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Check In Time</label>
                      <input
                        type="time"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Check Out Time</label>
                      <input
                        type="time"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900">Working Hours: {calculateWorkingHours()} hours</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    {editingId ? 'Update' : 'Mark'} Attendance
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Teacher Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Check In</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Check Out</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Working Hours</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record, idx) => (
                <tr key={record.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.teacherName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.checkOut}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{record.workingHours}h</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-medium">
            Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft className="text-xs" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
