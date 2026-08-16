import apiClient from './client';

export async function getExperiments() {
  const response = await apiClient.get('/experiments');
  return response.data;
}
