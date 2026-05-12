const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const authApi = {
  getProfile: () => apiFetch('/auth/profile'),
  updateProfile: (profileData: any) => apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

export const dashboardApi = {
  getGrades: () => apiFetch('/grades'),
  getAvailableCourses: (level: string, semester: string) => apiFetch(`/grades/available-courses?level=${level}&semester=${semester}`),
  addGrade: (gradeData: any) => apiFetch('/grades', {
    method: 'POST',
    body: JSON.stringify(gradeData),
  }),
  deleteGrade: (id: number) => apiFetch(`/grades/${id}`, {
    method: 'DELETE',
  }),
  getTasks: () => apiFetch('/tasks'),
  addTask: (taskData: any) => apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  toggleTask: (id: number) => apiFetch(`/tasks/${id}/toggle`, {
    method: 'PATCH',
  }),
  deleteTask: (id: number) => apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  getResources: () => apiFetch('/resources'),
  getNews: () => apiFetch('/news'),
};

export const adminApi = {
  getStats: () => apiFetch('/admin/stats'),
  getUsers: () => apiFetch('/admin/users'),
  getUserInsights: (id: number) => apiFetch(`/admin/users/${id}/insights`),
  deleteResource: (id: number) => apiFetch(`/admin/resources/${id}`, { method: 'DELETE' }),
  createNews: (newsData: any) => apiFetch('/admin/news', { method: 'POST', body: JSON.stringify(newsData) }),
  deleteNews: (id: number) => apiFetch(`/admin/news/${id}`, { method: 'DELETE' }),
};
