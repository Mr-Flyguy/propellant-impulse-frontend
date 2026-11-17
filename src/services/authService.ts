import axios from 'axios';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface LoginResponse {
  message: string;
  user: UserInfo;
  sessionId: string;
}

export interface RegisterResponse {
  message: string;
  user: UserInfo;
}

// Direct Axios requests for authentication (manual Redux dispatch without thunk/codegen)
export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      '/api/auth/login',
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await axios.post<RegisterResponse>(
      '/api/auth/register',
      { username, email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(
      '/api/auth/logout',
      {},
      { withCredentials: true }
    );
  },

  async getMe(): Promise<UserInfo> {
    const response = await axios.get<UserInfo>(
      '/api/auth/me',
      { withCredentials: true }
    );
    return response.data;
  },
};
