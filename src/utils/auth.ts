export interface AuthSession {
  token: string;
  refreshToken: string;
  tokenExpiry: string;
  userCode: string;
  firstName: string;
  lastName: string;
}

const SESSION_KEY = 'maitriser_admin_session';

/**
 * Persists the authentication session details
 */
export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Retrieves the current persisted authentication session
 */
export function getSession(): AuthSession | null {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AuthSession;
  } catch {
    return null;
  }
}

/**
 * Deletes the active session from storage (Logout)
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Checks if a session exists and has NOT expired.
 * Compares current system time against the tokenExpiry timestamp.
 */
export function isTokenValid(): boolean {
  const session = getSession();
  if (!session || !session.token) return false;
  
  const expiryStr = session.tokenExpiry;
  if (!expiryStr) return false;
  
  try {
    const expiryDate = new Date(expiryStr);
    const currentDate = new Date();
    
    // Returns true if current date is before expiry date
    return currentDate < expiryDate;
  } catch {
    return false;
  }
}

/**
 * Formats token expiry ISO string to local human-readable time
 */
export function formatExpiry(expiryStr: string): string {
  try {
    const date = new Date(expiryStr);
    return date.toLocaleString();
  } catch {
    return 'Unknown';
  }
}
