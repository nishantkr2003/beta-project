import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { API_URL } from "../config/constants";

interface User {
  id: string;
  email: string;
  role: "investor" | "borrower" | "admin";
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (userData: any, role: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on page load
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/api/auth/me`);
          setUser(response.data.user);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/${role}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any, role: string) => {
    setLoading(true);
    try {
      console.log(userData);
      await axios.post(`${API_URL}/api/auth/${role}/signup`, userData);
      // After signup, user needs to verify email before logging in
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const verifyEmail = async (email: string, otp: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-email`, { email, otp });
    } catch (error) {
      console.error("Email verification failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
    } catch (error) {
      console.error("OTP resend failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    } catch (error) {
      console.error("Forgot password request failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password,
      });
    } catch (error) {
      console.error("Password reset failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        verifyEmail,
        resendOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
