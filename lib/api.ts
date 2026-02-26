import { getToken } from './auth'

const PHP_API = process.env.NEXT_PUBLIC_PHP_API_URL ?? 'http://localhost/zentivora-api'

/**
 * Fetch a PHP endpoint with automatic auth header injection.
 * Throws an Error (with PHP's error message) on non-2xx responses.
 */
export async function phpFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${PHP_API}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`)
  }
  return data as T
}
