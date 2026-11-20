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

interface Tokens {
  access: string
  refresh: string
}

const TOKEN_KEY = 'auth'

// 이 경로들만 로그인 없이 쓰는 익명 사용자의 토큰이 필요하다
const needsAuth = (path: string) => /^\/(mission-sessions|rest\/records|settings|statistics)/.test(path)

function readTokens(): Tokens | null {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? 'null')
  } catch {
    return null
  }
}

const saveTokens = (tokens: Tokens) => {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  } catch {
    // 저장소를 쓸 수 없으면 이번 접속에서만 유지된다
  }
  return tokens
}

async function send<T>(method: string, path: string, opts: { query?: Query; body?: unknown; token?: string } = {}) {
  if (!BASE) throw new ApiError(0, 'VITE_API_BASE_URL is not set')

  const url = new URL(BASE + path, window.location.origin)
  for (const [key, value] of Object.entries(opts.query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`

  const res = await fetch(url, {
    method,
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) {
    const detail = await res.json().then((j) => j.detail).catch(() => res.statusText)
    throw new ApiError(res.status, String(detail))
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}

// 동시에 여러 요청이 401을 받아도 게스트 생성·토큰 갱신은 한 번만 한다
let pending: Promise<string> | null = null

async function createGuest() {
  const r = await send<{ accessToken: string; refreshToken: string }>('POST', '/auth/guest')
  return saveTokens({ access: r.accessToken, refresh: r.refreshToken }).access
}

async function renewAccess(current: Tokens) {
  try {
    const r = await send<{ access: string }>('POST', '/auth/refresh', { body: { refresh: current.refresh } })
    return saveTokens({ ...current, access: r.access }).access
  } catch {
    // 리프레시 토큰까지 만료됐으면 새 익명 사용자로 시작한다 (이전 기록은 이어지지 않는다)
    return createGuest()
  }
}

const accessToken = () => readTokens()?.access

function refreshAccess() {
  pending ??= (async () => {
    const tokens = readTokens()
    return tokens ? renewAccess(tokens) : createGuest()
  })().finally(() => {
    pending = null
  })
  return pending
}

async function request<T>(method: string, path: string, query?: Query, body?: unknown) {
  if (!needsAuth(path)) return send<T>(method, path, { query, body })

  const token = accessToken() ?? (await refreshAccess())
  try {
    return await send<T>(method, path, { query, body, token })
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401) throw e
    // 만료된 토큰이면 갱신 후 한 번만 다시 보낸다
    return send<T>(method, path, { query, body, token: await refreshAccess() })
  }
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>('GET', path, query),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, undefined, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, undefined, body),
  del: (path: string) => request<void>('DELETE', path),
}
