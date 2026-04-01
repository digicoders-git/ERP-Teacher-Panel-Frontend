import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';

const MySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const teacherName = localStorage.getItem('teacherName') || 'Current Teacher';

  useEffect(() => {
    const allSalaries = JSON.parse(localStorage.getItem('salaries') || '[]');
    
    // If no data exists, add dummy data
    if (allSalaries.length === 0) {
      const dummyData = [
        { id: 1, teacherName: teacherName, month: 'January 2024', baseSalary: 50000, allowances: 5000, deductions: 2000, netSalary: 53000, status: 'Paid', paymentDate: '2024-01-31' },
        { id: 2, teacherName: teacherName, month: 'December 2023', baseSalary: 50000, allowances: 5000, deductions: 2000, netSalary: 53000, status: 'Paid', paymentDate: '2023-12-31' },
        { id: 3, teacherName: teacherName, month: 'November 2023', baseSalary: 50000, allowances: 4500, deductions: 1800, netSalary: 52700, status: 'Paid', paymentDate: '2023-11-30' },
        { id: 4, teacherName: teacherName, month: 'October 2023', baseSalary: 50000, allowances: 5000, deductions: 2000, netSalary: 53000, status: 'Paid', paymentDate: '2023-10-31' },
        { id: 5, teacherName: teacherName, month: 'September 2023', baseSalary: 50000, allowances: 5000, deductions: 2500, netSalary: 52500, status: 'Paid', paymentDate: '2023-09-30' },
        { id: 6, teacherName: teacherName, month: 'February 2024', baseSalary: 50000, allowances: 5000, deductions: 2000, netSalary: 53000, status: 'Pending', paymentDate: '' },
      ];
      localStorage.setItem('salaries', JSON.stringify(dummyData));
      setSalaries(dummyData);
    } else {
      const mySalaries = allSalaries.filter(s => s.teacherName === teacherName);
      setSalaries(mySalaries);
    }
  }, [teacherName]);

  const filteredSalaries = salaries.filter(s =>
    s.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
  const paginatedData = filteredSalaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalEarned = salaries.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.netSalary, 0);
  const totalPending = salaries.filter(s => s.status === 'Pending').reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Salary</h1>
        <p className="text-sm text-slate-500 mt-1">View your salary records and payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-2">Total Earned</p>
          <p className="text-3xl font-black text-green-900">₹{totalEarned.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">{salaries.filter(s => s.status === 'Paid').length} payments received</p>
          <div className="mt-3 bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-2">Pending</p>
          <p className="text-3xl font-black text-amber-900">₹{totalPending.toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-2">{salaries.filter(s => s.status === 'Pending').length} payments pending</p>
          <div className="mt-3 bg-amber-200 rounded-full h-2">
            <div className="bg-amber-600 h-2 rounded-full" style={{width: '15%'}}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by month..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold">Month</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Base Salary</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Allowances</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Deductions</th>
                <th className="px-6 py-4 text-right text-sm font-bold">Net Salary</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((salary, idx) => (
                  <tr key={salary.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{salary.month}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-700">₹{salary.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-600">+₹{salary.allowances.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-red-600">-₹{salary.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">₹{salary.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        salary.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{salary.paymentDate || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No salary records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div className="text-sm text-slate-600 font-medium">
              Showing {filteredSalaries.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSalaries.length)} of {filteredSalaries.length} items
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

export default MySalary;
