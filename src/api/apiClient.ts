import axios from 'axios';
import { Api } from './generated/PropellantApi';

// Base Axios instance configuration
axios.defaults.withCredentials = true;
axios.defaults.timeout = 2500; // 2.5s timeout prevents hanging when backend is offline

// Instance of generated API client with Axios
export const propellantApi = new Api({
  baseURL: '', // Relative URL enables Vite reverse proxy (/api -> :3000, /propellants -> :9000)
  withCredentials: true,
  timeout: 2500,
});

// Helper for proxy image URL resolution (Silo / MinIO)
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  // If backend returns absolute MinIO URL (e.g. http://localhost:9000/propellants/...),
  // map it to proxy path /propellants/... so requests go through Vite proxy without CORS
  if (url.includes('9000/propellants/')) {
    return url.substring(url.indexOf('/propellants/'));
  }
  return url;
}
