import apiClient from './client';

export async function getStudentProgress(studentId) {
  const response = await apiClient.get(`/progress/student/${studentId}`);
  return response.data;
}

export async function updateProgress(progress) {
  const response = await apiClient.post('/progress', progress);
  return response.data;
}
