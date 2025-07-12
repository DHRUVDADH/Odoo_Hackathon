// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_VERSION = "v1";

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  isActive: boolean;
  points: number;
  preferences: {
    categories: string[];
    sizes: string[];
    notifications: {
      email: boolean;
      push: boolean;
      swapRequests: boolean;
      messages: boolean;
    };
  };
  stats: {
    itemsListed: number;
    itemsSold: number;
    swapsCompleted: number;
    positiveReviews: number;
    totalReviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  brand?: string;
  color?: string;
  material?: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  owner: User;
  status: string;
  tags: string[];
  views: number;
  likes: string[];
  location?: string;
  isSwapOnly: boolean;
  createdAt: string;
  updatedAt: string;
  measurements?: Record<string, string | number>;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/${API_VERSION}`;
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  // Set auth token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // Get auth headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request("/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>("/auth/profile");
  }

  async updateProfile(
    profileData: Partial<User>
  ): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>("/auth/refresh-token", {
      method: "POST",
    });
  }

  // Items Methods
  async getItems(params?: {
    page?: number;
    limit?: number;
    category?: string;
    size?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<
    ApiResponse<{ items: Item[]; total: number; page: number; limit: number }>
  > {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/items?${queryString}` : "/items";

    return this.request<{
      items: Item[];
      total: number;
      page: number;
      limit: number;
    }>(endpoint);
  }

  async getItem(id: string): Promise<ApiResponse<{ item: Item }>> {
    return this.request<{ item: Item }>(`/items/${id}`);
  }

  async createItem(itemData: FormData): Promise<ApiResponse<{ item: Item }>> {
    const headers = this.getHeaders();
    delete headers["Content-Type"]; // Let browser set content-type for FormData

    return this.request<{ item: Item }>("/items", {
      method: "POST",
      headers,
      body: itemData,
    });
  }

  async updateItem(
    id: string,
    itemData: Partial<Item>
  ): Promise<ApiResponse<{ item: Item }>> {
    return this.request<{ item: Item }>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id: string): Promise<ApiResponse> {
    return this.request(`/items/${id}`, {
      method: "DELETE",
    });
  }

  async likeItem(id: string): Promise<ApiResponse> {
    return this.request(`/items/${id}/like`, {
      method: "POST",
    });
  }

  async unlikeItem(id: string): Promise<ApiResponse> {
    return this.request(`/items/${id}/unlike`, {
      method: "DELETE",
    });
  }

  // ADMIN: Get all pending items
  async getPendingItems(page = 1, limit = 20) {
    const endpoint = `/items/admin/pending?page=${page}&limit=${limit}`;
    return this.request<{
      items: Item[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(endpoint);
  }

  // ADMIN: Approve item
  async approveItem(itemId: string) {
    return this.request<{ item: Item }>(`/items/admin/${itemId}/approve`, {
      method: "PATCH",
    });
  }

  // ADMIN: Reject item
  async rejectItem(itemId: string, reason: string) {
    return this.request<{ item: Item }>(`/items/admin/${itemId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  // User Methods
  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/users/${id}`);
  }

  async getUserItems(userId: string): Promise<ApiResponse<{ items: Item[] }>> {
    return this.request<{ items: Item[] }>(`/items/user/${userId}`);
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request("/health");
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, User, AuthResponse, Item };
