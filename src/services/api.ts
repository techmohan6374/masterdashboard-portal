// API Configuration and services for Maitriser Zone Super Admin Portal

let apiVersion = 'v1';

/**
 * Sets the API version dynamically (e.g., 'v1', 'v2', etc.)
 */
export const setApiVersion = (version: string) => {
  apiVersion = version;
};

/**
 * Gets the current active API version
 */
export const getApiVersion = () => {
  return apiVersion;
};

/**
 * Constructs the full API URL based on base endpoint and dynamic version
 */
export const getApiUrl = (endpoint: string) => {
  const base = 'https://cqrsca.masterid.in/api';
  // Strip leading slash if present in endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}/${apiVersion}/${cleanEndpoint}`;
};

export interface TokenData {
  token: string;
  refreshToken: string;
  tokenExpiry: string;
}

export interface LoginResponse {
  isTwoFactorRequired: boolean;
  twoFactorType: string | null;
  pendingLoginId: string | null;
  pendingLoginExpiresOnUtc: string | null;
  tokenData: TokenData;
  userCode: string;
  firstName: string;
  lastName: string;
}

/**
 * Authenticates the super admin using EmailOrUserCode and password
 */
export async function loginSuperAdmin(EmailOrUserCode: string, password: string): Promise<LoginResponse> {
  const url = getApiUrl('auth/superadmin-login');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ EmailOrUserCode, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Login failed. Please check your credentials.';
    try {
      const errorData = await response.json();
      if (errorData && typeof errorData === 'object') {
        errorMessage = errorData.message || JSON.stringify(errorData);
      }
    } catch {
      // JSON parsing failed, fallback to status text
      errorMessage = `HTTP error! Status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Attempts to call a dashboard endpoint using the authorization token
 */
export async function fetchDashboardData(token: string): Promise<any> {
  const url = getApiUrl('dashboard/stats'); // hypothetical endpoint inside the API
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API error! Status: ${response.status}`);
  }

  return response.json();
}
