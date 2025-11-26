export type WallEntry = {
  id: string
  fullName: string
  message: string
  createdAt: string
}

type ApiResponse<T> = {
  data?: T
  message?: string
  error?: string
}

const COMMENTS_API_URL = 'https://gaby-wall-comments-api.vercel.app/api/comments'
const API_KEY = 'gabyy1717gabyyy#'

async function request<T>(options?: RequestInit): Promise<T> {
  const response = await fetch(COMMENTS_API_URL, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...(options?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const message = `Request failed with status ${response.status}`
    throw new Error(message)
  }

  const payload = (await response.json()) as ApiResponse<T> | T
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data as T
  }

  return payload as T
}

export async function fetchWallEntries(): Promise<WallEntry[]> {
  const entries = await request<WallEntry[]>()
  return entries.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
}

export async function createWallEntry(entry: Pick<WallEntry, 'fullName' | 'message'>): Promise<WallEntry> {
  return request<WallEntry>({
    method: 'POST',
    body: JSON.stringify(entry),
  })
}




