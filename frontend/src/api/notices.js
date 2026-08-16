import apiClient from './client';

export async function getNotices() {
  const response = await apiClient.get('/notices');
  return response.data;
}

export async function createNotice(notice) {
  const response = await apiClient.post('/notices', notice);
  return response.data;
}
