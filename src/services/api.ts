import { User, mockUsers, defaultUser } from '@/mocks/users';
import { Role } from '@/configs/roleConfig';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  status: number;
  message: string;
}

// Typed API client
export const api = {
  // GET /api/me - Get current user
  async getMe(role?: Role): Promise<ApiResponse<User>> {
    await delay(200); // Simulate network
    
    const user = role ? mockUsers[role] : defaultUser;
    
    return {
      data: user,
      status: 200,
    };
  },

  // Placeholder endpoints for future implementation
  async getWorkOrders(): Promise<ApiResponse<unknown[]>> {
    await delay(300);
    return { data: [], status: 200 };
  },

  async getInventory(): Promise<ApiResponse<unknown[]>> {
    await delay(300);
    return { data: [], status: 200 };
  },

  async getTestResults(): Promise<ApiResponse<unknown[]>> {
    await delay(300);
    return { data: [], status: 200 };
  },

  async getSparesAging(): Promise<ApiResponse<unknown[]>> {
    await delay(300);
    return { data: [], status: 200 };
  },
};

// Error handler utility
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}
