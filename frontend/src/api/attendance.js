import apiClient from './client';

export async function getAllAttendance() {
  const response = await apiClient.get('/attendance');
  return response.data;
}

export async function getStudentAttendance(studentId) {
  const response = await apiClient.get(`/attendance/student/${studentId}`);
  return response.data;
}

export async function markAttendance(studentId) {
  const response = await apiClient.post('/attendance', { studentId, status: 'PRESENT' });
  return response.data;
}
