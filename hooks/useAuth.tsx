"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { apiClient, User, AuthResponse } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    profileData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await apiClient.getProfile();
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          // Token is invalid, clear it
          apiClient.clearToken();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login({ email, password });

      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        setLoading(true);
        const response = await apiClient.register(userData);

        if (response.success && response.data) {
          apiClient.setToken(response.data.token);
          setUser(response.data.user);
          return { success: true, message: response.message };
        } else {
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Registration failed",
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      apiClient.clearToken();
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setLoading(true);
      const response = await apiClient.updateProfile(profileData);

      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Profile update failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
