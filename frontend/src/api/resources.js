import apiClient from './client';

export async function getResources() {
  const response = await apiClient.get('/resources');
  return response.data;
}

export async function uploadResource({ file, title, uploadedBy }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('uploadedBy', uploadedBy);

  const response = await apiClient.post('/resources', formData);
  return response.data;
}

export async function downloadResource(id, fileName) {
  const response = await apiClient.get(`/resources/${id}/download`, { responseType: 'blob' });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
