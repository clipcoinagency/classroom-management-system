import apiClient from './client';

export async function getStudents() {
  const response = await apiClient.get('/users/students');
  return response.data;
}
