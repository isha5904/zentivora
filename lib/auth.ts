// Client-side auth helpers — localStorage-based session management

export type AuthUser = {
  id: string
  email: string
  full_name: string
  phone?: string
}

const TOKEN_KEY = 'zentivora_token'
const USER_KEY  = 'zentivora_user'

/** Save token + user after successful login/register */
export function saveAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  // Notify Navbar and other listeners across the same tab
  window.dispatchEvent(new Event('zentivora-auth'))
}

/** Get the stored Bearer token */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/** Get the stored user object */
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** Clear everything — call on logout */
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.dispatchEvent(new Event('zentivora-auth'))
}

/** Quick check — returns true if a token is present */
export function isLoggedIn(): boolean {
  return !!getToken()
}
