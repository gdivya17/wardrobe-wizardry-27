
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API base URL - use environment variable if available, but fallback to localhost for development
// In production, you should set this to your deployed backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("Using API URL:", API_URL);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            const user: User = {
              ...userData,
              createdAt: new Date(userData.createdAt)
            };
            setUser(user);
          } else {
            // Token invalid, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Could not connect to authentication server. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login to:", `${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      
      // Now get user data
      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }
      
      const userData = await userResponse.json();
      const user: User = {
        ...userData,
        createdAt: new Date(userData.createdAt)
      };
      
      setUser(user);
      toast.success("Successfully logged in");
    } catch (error) {
      console.error("Login failed:", error);
      
      // More detailed error message for connection issues
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Could not connect to the authentication server. Please check your internet connection or try again later.");
      } else {
        toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting registration to:", `${API_URL}/auth/register`);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      const userData = await response.json();
      const user: User = {
        ...userData,
        createdAt: new Date(userData.createdAt)
      };
      
      // Store token if available
      if (userData.access_token) {
        localStorage.setItem('token', userData.access_token);
      }
      
      setUser(user);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Registration failed:", error);
      
      // More descriptive error message for connection issues
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        toast.error("Could not connect to the registration server. Please check your internet connection or try again later.");
      } else {
        toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
