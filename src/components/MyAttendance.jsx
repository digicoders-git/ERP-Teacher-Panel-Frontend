import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaSpinner } from 'react-icons/fa';
import { getStaffAttendanceHistory } from '../api';
import { toast } from 'react-toastify';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMode, setActiveMode] = useState('manual');

    useEffect(() => {
        fetchAttendance();
        fetchActiveMode();
    }, []);

    const fetchActiveMode = async () => {
        try {
            const { data } = await api.get('../staff-panel/attendance-config/settings');
            if (data.success) {
                setActiveMode(data.data.staffMode || 'manual');
            }
        } catch (error) {
            console.error('Failed to fetch mode', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const { data } = await getStaffAttendanceHistory();
            if (data.success) {
                setAttendance(data.data || []);
            }
        } catch (error) {
            toast.error('Failed to load attendance history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'bg-green-100 text-green-700';
            case 'absent': return 'bg-red-100 text-red-700';
            case 'late': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filtered = attendance.filter(a => 
        new Date(a.date).toLocaleDateString('en-IN').includes(searchTerm)
    );

    if (loading) return (
        <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-gray-800">My Attendance History</h2>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                            activeMode === 'manual' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            activeMode === 'biometric' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            activeMode === 'hybrid' ? 'bg-green-50 text-green-600 border-green-100' :
                            'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                            <div className={`w-1 h-1 rounded-full animate-pulse ${
                                activeMode === 'manual' ? 'bg-blue-600' :
                                activeMode === 'biometric' ? 'bg-purple-600' :
                                activeMode === 'hybrid' ? 'bg-green-600' :
                                'bg-orange-600'
                            }`}></div>
                            {activeMode}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">Detailed log of your presence and check-ins</p>
                </div>
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        placeholder="Search by date..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">In Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Out Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mode</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered.length > 0 ? filtered.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-gray-700">
                                    {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.timeIn ? new Date(item.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{item.timeOut ? new Date(item.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {item.source || 'Manual'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No records found for the selected period.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAttendance;
