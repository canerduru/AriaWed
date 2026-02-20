/**
 * API client for AriaWed backend.
 * Uses VITE_API_URL when set; otherwise falls back to mock (services use their own mocks).
 */

const BASE = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL
  ? (import.meta as any).env.VITE_API_URL
  : '';

function getToken(): string | null {
  return localStorage.getItem('ariawed_token');
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE}${path}`;
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || res.statusText);
  return data as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isApiConfigured(): boolean {
  return !!BASE;
}

// --- Auth ---
export const authApi = {
  async login(email: string, password: string) {
    const data = await apiFetch<{ user: ApiUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },
  async register(body: { email: string; password: string; name: string; role?: string }) {
    const data = await apiFetch<{ user: ApiUser; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return data;
  },
};

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
  weddingId?: string;
  vendorId?: string;
  status?: string;
}

// --- Weddings ---
export const weddingsApi = {
  list: () => apiFetch<ApiWedding[]>('/api/weddings'),
  get: (id: string) => apiFetch<ApiWedding>(`/api/weddings/${id}`),
  create: (body: Partial<ApiWedding>) => apiFetch<ApiWedding>('/api/weddings', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<ApiWedding>) => apiFetch<ApiWedding>(`/api/weddings/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};

export interface ApiWedding {
  id: string;
  userId: string;
  date?: string;
  location?: string;
  guestCount?: number;
  budget?: number;
  priorities?: string[];
  styles?: string[];
  culture?: string;
  partnerEmail?: string;
}

// --- Guests ---
export const guestsApi = {
  list: (weddingId: string) => apiFetch<unknown[]>(`/api/guests/wedding/${weddingId}`),
  create: (weddingId: string, body: unknown) =>
    apiFetch<unknown>(`/api/guests/wedding/${weddingId}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: unknown) => apiFetch<unknown>(`/api/guests/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch(`/api/guests/${id}`, { method: 'DELETE' }),
  getByToken: (token: string) => apiFetch<unknown>(`/api/guests/rsvp/${token}`),
  updateRsvp: (token: string, body: unknown) =>
    apiFetch<unknown>(`/api/guests/rsvp/${token}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// --- Budget ---
export const budgetApi = {
  list: (weddingId: string) => apiFetch<unknown[]>(`/api/budget/wedding/${weddingId}`),
  create: (weddingId: string, body: unknown) =>
    apiFetch<unknown>(`/api/budget/wedding/${weddingId}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: unknown) => apiFetch<unknown>(`/api/budget/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch(`/api/budget/${id}`, { method: 'DELETE' }),
};

// --- Tasks ---
export const tasksApi = {
  list: (weddingId: string) => apiFetch<unknown[]>(`/api/tasks/wedding/${weddingId}`),
  create: (weddingId: string, body: unknown) =>
    apiFetch<unknown>(`/api/tasks/wedding/${weddingId}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: unknown) => apiFetch<unknown>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch(`/api/tasks/${id}`, { method: 'DELETE' }),
};

// --- Website ---
export const websiteApi = {
  get: (weddingId: string) => apiFetch<unknown>(`/api/website/wedding/${weddingId}`),
  save: (weddingId: string, data: unknown) =>
    apiFetch<unknown>(`/api/website/wedding/${weddingId}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// --- Aria (Gemini proxy) ---
export const ariaApi = {
  chat: (message: string, context?: string) =>
    apiFetch<{ text: string }>('/api/aria/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};
