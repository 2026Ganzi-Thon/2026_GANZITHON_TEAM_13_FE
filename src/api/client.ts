const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined

export const apiEnabled = Boolean(BASE)

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

type Query = Record<string, string | number | undefined>

async function request<T>(method: string, path: string, query?: Query, body?: unknown) {
  if (!BASE) throw new ApiError(0, 'VITE_API_BASE_URL is not set')

  const url = new URL(BASE + path, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) {
    const detail = await res.json().then((j) => j.detail).catch(() => res.statusText)
    throw new ApiError(res.status, String(detail))
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>('GET', path, query),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, undefined, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, undefined, body),
  del: (path: string) => request<void>('DELETE', path),
}
