const TOKEN_KEY = 'asif_glass_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unexpected error occurred' }));
    throw new Error(errorData.error || `HTTP Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    request<{ token: string; user: { id: number; username: string; role: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request<{ user: any }>('/api/auth/me'),

  // Projects
  getProjects: () => request<any[]>('/api/projects'),
  getProject: (id: number) => request<any>(`/api/projects/${id}`),
  createProject: (data: any) =>
    request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: any) =>
    request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  // Services
  getServices: () => request<any[]>('/api/services'),
  getService: (id: number) => request<any>(`/api/services/${id}`),
  createService: (data: any) =>
    request<any>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: number, data: any) =>
    request<any>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteService: (id: number) =>
    request<{ message: string }>(`/api/services/${id}`, {
      method: 'DELETE',
    }),

  // Testimonials
  getTestimonials: () => request<any[]>('/api/testimonials'),
  createTestimonial: (data: any) =>
    request<any>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: number, data: any) =>
    request<any>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: number) =>
    request<{ message: string }>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // Inquiries
  getInquiries: () => request<any[]>('/api/inquiries'),
  createInquiry: (data: any) =>
    request<any>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInquiryStatus: (id: number, status: string) =>
    request<any>(`/api/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id: number) =>
    request<{ message: string }>(`/api/inquiries/${id}`, {
      method: 'DELETE',
    }),

  // Customers
  getCustomers: () => request<any[]>('/api/customers'),
  createCustomer: (data: any) =>
    request<any>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id: number, data: any) =>
    request<any>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id: number) =>
    request<{ message: string }>(`/api/customers/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => request<any>('/api/settings'),
  updateSettings: (data: any) =>
    request<any>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Upload
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
