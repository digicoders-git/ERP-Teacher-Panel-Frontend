import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const MyPerformance = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const teacherName = localStorage.getItem('teacherName') || 'Current Teacher';

  useEffect(() => {
    const allEvaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    
    // If no data exists, add dummy data
    if (allEvaluations.length === 0) {
      const dummyData = [
        { id: 1, teacherName: teacherName, evaluationPeriod: 'Q4 2023', teachingQuality: 4.5, studentEngagement: 4.2, punctuality: 4.8, professionalism: 4.6, overallRating: 4.5, feedback: 'Excellent performance throughout the quarter. Students show great engagement in classes.', evaluatedBy: 'Principal', evaluationDate: '2023-12-31' },
        { id: 2, teacherName: teacherName, evaluationPeriod: 'Q3 2023', teachingQuality: 4.3, studentEngagement: 4.5, punctuality: 4.7, professionalism: 4.4, overallRating: 4.5, feedback: 'Good work. Keep maintaining the quality of teaching.', evaluatedBy: 'Principal', evaluationDate: '2023-09-30' },
        { id: 3, teacherName: teacherName, evaluationPeriod: 'Q2 2023', teachingQuality: 4.2, studentEngagement: 4.0, punctuality: 4.5, professionalism: 4.3, overallRating: 4.3, feedback: 'Consistent performance. Focus more on student engagement activities.', evaluatedBy: 'HOD', evaluationDate: '2023-06-30' },
        { id: 4, teacherName: teacherName, evaluationPeriod: 'Q1 2023', teachingQuality: 4.0, studentEngagement: 3.8, punctuality: 4.6, professionalism: 4.2, overallRating: 4.2, feedback: 'Good start to the year. Work on interactive teaching methods.', evaluatedBy: 'Principal', evaluationDate: '2023-03-31' },
      ];
      localStorage.setItem('evaluations', JSON.stringify(dummyData));
      setEvaluations(dummyData);
    } else {
      const myEvaluations = allEvaluations.filter(e => e.teacherName === teacherName);
      setEvaluations(myEvaluations);
    }
  }, [teacherName]);

  const filteredEvaluations = evaluations.filter(e =>
    e.evaluationPeriod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const paginatedData = filteredEvaluations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBgColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-50';
    if (rating >= 3.5) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const averageRating = evaluations.length > 0
    ? (evaluations.reduce((sum, e) => sum + e.overallRating, 0) / evaluations.length).toFixed(1)
    : 0;

  const latestEvaluation = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Performance</h1>
        <p className="text-sm text-slate-500 mt-1">View your performance evaluations and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-2">Total Evaluations</p>
          <p className="text-3xl font-black text-blue-900">{evaluations.length}</p>
          <p className="text-xs text-blue-600 mt-2">Performance reviews</p>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < evaluations.length ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-2">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-green-900">{averageRating}</p>
            <FaStar className="text-yellow-500 text-xl" />
          </div>
          <p className="text-xs text-green-600 mt-2">Out of 5.0</p>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`${i < Math.floor(averageRating) ? 'text-yellow-500' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
          <p className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-2">Latest Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black text-purple-900">{latestEvaluation ? latestEvaluation.overallRating : '-'}</p>
            {latestEvaluation && <FaStar className="text-yellow-500 text-xl" />}
          </div>
          <p className="text-xs text-purple-600 mt-2">{latestEvaluation ? latestEvaluation.evaluationPeriod : 'No evaluations yet'}</p>
          {latestEvaluation && (
            <div className="mt-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`${i < Math.floor(latestEvaluation.overallRating) ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {latestEvaluation && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">Latest Evaluation Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-indigo-700 font-medium mb-1">Teaching Quality</p>
              <p className="text-2xl font-black text-indigo-900">{latestEvaluation.teachingQuality}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-700 font-medium mb-1">Student Engagement</p>
              <p className="text-2xl font-black text-indigo-900">{latestEvaluation.studentEngagement}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-700 font-medium mb-1">Punctuality</p>
              <p className="text-2xl font-black text-indigo-900">{latestEvaluation.punctuality}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-700 font-medium mb-1">Professionalism</p>
              <p className="text-2xl font-black text-indigo-900">{latestEvaluation.professionalism}</p>
            </div>
          </div>
          {latestEvaluation.feedback && (
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm font-bold text-slate-700 mb-2">Feedback:</p>
              <p className="text-sm text-slate-600">{latestEvaluation.feedback}</p>
              <p className="text-xs text-slate-500 mt-2">- {latestEvaluation.evaluatedBy}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by evaluation period..."
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
                <th className="px-6 py-4 text-left text-sm font-bold">Period</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Teaching</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Engagement</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Punctuality</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Professionalism</th>
                <th className="px-6 py-4 text-center text-sm font-bold">Overall</th>
                <th className="px-6 py-4 text-left text-sm font-bold">Evaluated By</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((evaluation, idx) => (
                  <tr key={evaluation.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{evaluation.evaluationPeriod}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRatingBgColor(evaluation.teachingQuality)} ${getRatingColor(evaluation.teachingQuality)}`}>
                        {evaluation.teachingQuality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRatingBgColor(evaluation.studentEngagement)} ${getRatingColor(evaluation.studentEngagement)}`}>
                        {evaluation.studentEngagement}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRatingBgColor(evaluation.punctuality)} ${getRatingColor(evaluation.punctuality)}`}>
                        {evaluation.punctuality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRatingBgColor(evaluation.professionalism)} ${getRatingColor(evaluation.professionalism)}`}>
                        {evaluation.professionalism}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getRatingBgColor(evaluation.overallRating)} ${getRatingColor(evaluation.overallRating)}`}>
                        <FaStar className="text-yellow-500" /> {evaluation.overallRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{evaluation.evaluatedBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No performance evaluations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div className="text-sm text-slate-600 font-medium">
              Showing {filteredEvaluations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEvaluations.length)} of {filteredEvaluations.length} items
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

export default MyPerformance;
