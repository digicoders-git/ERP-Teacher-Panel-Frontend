import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://erp-backend-0ab5.onrender.com/api/teacher-panel';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teacherToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // If data is FormData, remove Content-Type header to let browser set it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('teacherToken');
      localStorage.removeItem('teacherAuth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getTeacherClasses = () => api.get('/dashboard/classes');
export const getStudentsByClass = (classId, sectionId) =>
  api.get('/dashboard/students', { params: { classId, sectionId } });

// Assignments
export const createAssignment = (data) => api.post('/assignment/create', data);
export const getAllAssignments = (page = 1, limit = 10, classId, sectionId) =>
  api.get('/assignment/all', { params: { page, limit, classId, sectionId } });
export const getAssignmentById = (id) => api.get(`/assignment/${id}`);
export const updateAssignment = (id, data) => api.put(`/assignment/${id}`, data);
export const deleteAssignment = (id) => api.delete(`/assignment/${id}`);

// Attendance
export const markAttendance = (data) => api.post('/attendance/mark', data);
export const getStudentsForAttendance = (classId, sectionId) =>
  api.get('/attendance/students', { params: { classId, sectionId } });
export const getAttendanceByClass = (classId, sectionId, date) =>
  api.get('/attendance/class', { params: { classId, sectionId, date } });
export const getAttendanceStats = (classId, sectionId, startDate, endDate) =>
  api.get('/attendance/stats', { params: { classId, sectionId, startDate, endDate } });
export const bulkUpdateAttendance = (data) => api.post('/attendance/bulk-update', data);
export const getAttendanceReport = (classId, sectionId, startDate, endDate) =>
  api.get('/attendance/report', { params: { classId, sectionId, startDate, endDate } });
export const getTeacherAttendance = (startDate, endDate) =>
  api.get('/attendance/teacher', { params: { startDate, endDate } });

// Timetable
export const addTimetable = (data) => api.post('/timetable/add', data);
export const getAllTimetables = () => api.get('/timetable/all');
export const getTimetableByDay = (day) => api.get(`/timetable/day/${day}`);
export const updateTimetable = (id, data) => api.put(`/timetable/${id}`, data);
export const deleteTimetable = (id) => api.delete(`/timetable/${id}`);

// Diary
export const addDiaryEntry = (data) => api.post('/diary', data);
export const getAllDiaryEntries = (page = 1, limit = 10, type, priority, classId) =>
  api.get('/diary', { params: { page, limit, type, priority, classId } });
export const getDiaryEntryById = (id) => api.get(`/diary/${id}`);
export const updateDiaryEntry = (id, data) => api.put(`/diary/${id}`, data);
export const deleteDiaryEntry = (id) => api.delete(`/diary/${id}`);

// Notices
export const createNotice = (data) => api.post('/notice/create', data);
export const publishNotice = (id) => api.put(`/notice/publish/${id}`);
export const getAllNotices = (page = 1, limit = 10, type, priority, isPublished) =>
  api.get('/notice/all', { params: { page, limit, type, priority, isPublished } });
export const getNoticeById = (id) => api.get(`/notice/${id}`);
export const updateNotice = (id, data) => api.put(`/notice/${id}`, data);
export const deleteNotice = (id) => api.delete(`/notice/${id}`);
export const unpublishNotice = (id) => api.put(`/notice/unpublish/${id}`);

// Parent Alerts
export const sendSMSAlert = (data) => api.post('/parent-alerts/send-sms', data);
export const sendEmailAlert = (data) => api.post('/parent-alerts/send-email', data);
export const sendBulkAlerts = (data) => api.post('/parent-alerts/bulk', data);
export const getAlertHistory = (limit = 10, type) =>
  api.get('/parent-alerts/history', { params: { limit, type } });
export const getAbsentStudents = (classId, sectionId, date) =>
  api.get('/parent-alerts/absent-students', { params: { classId, sectionId, date } });
export const getClassStudents = (classId, sectionId) =>
  api.get('/parent-alerts/class-students', { params: { classId, sectionId } });

// Quizzes
export const createQuiz = (data) => api.post('/quiz', data);
export const getAllQuizzes = (params) => api.get('/quiz', { params });
export const updateQuiz = (id, data) => api.put(`/quiz/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/quiz/${id}`);

// Videos
export const uploadVideo = (data) => api.post('/video-class', data);
export const getAllVideos = (params) => api.get('/video-class', { params });
export const updateVideo = (id, data) => api.put(`/video-class/${id}`, data);
export const deleteVideo = (id) => api.delete(`/video-class/${id}`);

// Resources
export const uploadResource = (data) => api.post('/resource', data);
export const getAllResources = (params) => api.get('/resource', { params });
export const updateResource = (id, data) => api.put(`/resource/${id}`, data);
export const deleteResource = (id) => api.delete(`/resource/${id}`);

// Live Classes
export const scheduleLiveClass = (data) => api.post('/live-class', data);
export const getAllLiveClasses = (params) => api.get('/live-class', { params });
export const updateLiveClass = (id, data) => api.put(`/live-class/${id}`, data);
export const deleteLiveClass = (id) => api.delete(`/live-class/${id}`);

// Reports
export const getAcademicReport = (classId, sectionId, startDate, endDate) =>
  api.get('/reports/academic', { params: { classId, sectionId, startDate, endDate } });
export const getAttendanceReportData = (classId, sectionId, period = 'monthly') =>
  api.get('/reports/attendance-analytics', { params: { classId, sectionId, period } });
export const getGradeDistribution = (classId, sectionId) =>
  api.get('/reports/grade-distribution', { params: { classId, sectionId } });
export const getStudentProgress = (studentId) =>
  api.get(`/reports/student-progress/${studentId}`);

// Salary
export const getTeacherSalaries = (month, status) =>
  api.get('/salary', { params: { month, status } });
export const getSalaryById = (id) => api.get(`/salary/${id}`);
export const getSalaryReport = () => api.get('/salary/report');

// Unified Staff Attendance (Cross-panel)
export const getStaffAttendanceHistory = () => api.get('../staff-panel/attendance-staff/my-history');

export default api;
