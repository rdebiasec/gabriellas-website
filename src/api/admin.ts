// Admin API client for video management

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://gaby-website-admin.vercel.app/api/admin'

export interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  youtubeId?: string
  date?: string
  category: string
  year: number
}

type ApiResponse<T> = {
  data?: T
  message?: string
  error?: string
  details?: Record<string, string[]>
}

type LoginResponse = {
  token: string
  expiresAt: number
}

// Get stored token from localStorage
function getToken(): string | null {
  return localStorage.getItem('admin_token')
}

// Store token in localStorage
function setToken(token: string): void {
  localStorage.setItem('admin_token', token)
}

// Remove token from localStorage
function removeToken(): void {
  localStorage.removeItem('admin_token')
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken()
  
  // Check if token is expired
  if (token && isTokenExpired(token)) {
    removeToken()
    throw new Error('Token expired. Please login again.')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> ?? {}),
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${ADMIN_API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = (await response.json()) as ApiResponse<T>
    throw new Error(error.error || `Request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as ApiResponse<T> | T
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data as T
  }

  return payload as T
}

// Login with password
export async function adminLogin(password: string): Promise<LoginResponse> {
  const response = await fetch(`${ADMIN_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    const error = (await response.json()) as ApiResponse<never>
    throw new Error(error.error || 'Login failed')
  }

  const data = (await response.json()) as LoginResponse
  setToken(data.token)
  return data
}

// Logout (clear token)
export function adminLogout(): void {
  removeToken()
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
}

// Get all videos
export async function fetchVideos(): Promise<Video[]> {
  return request<Video[]>('/videos')
}

// Add YouTube video
export async function addYouTubeVideo(
  url: string,
  category: string,
  date?: string
): Promise<Video> {
  return request<Video>('/videos', {
    method: 'POST',
    body: JSON.stringify({ url, category, date }),
  })
}

// Add local video
export async function addLocalVideo(video: Omit<Video, 'id'>): Promise<Video> {
  return request<Video>('/videos', {
    method: 'POST',
    body: JSON.stringify(video),
  })
}

// Update video
export async function updateVideo(
  id: number,
  updates: Partial<Omit<Video, 'id'>>
): Promise<Video> {
  return request<Video>(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// Delete video
export async function deleteVideo(id: number): Promise<void> {
  await request(`/videos/${id}`, {
    method: 'DELETE',
  })
}

