"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.userEmail,
          username: response.data.userName,
          role: response.data.userRole,
        });
        setIsAuthenticated(true);
      } catch (error) {
        // No hacer nada si no está autenticado
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await api.post("/auth/login", {
        userName: username,
        userPassword: password,
      });
      const response = await api.get("/auth/me");
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.userEmail,
        username: response.data.userName,
        role: response.data.userRole,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error(
            "Contraseña incorrecta. Por favor, inténtalo de nuevo."
          );
        }
        if (error.response?.status === 404) {
          throw new Error(
            "Usuario no encontrado. Por favor, verifica tu nombre de usuario."
          );
        }
        throw new Error(
          error.response?.data.message || "Inicio de sesión fallido"
        );
      }
      throw new Error(
        "Ocurrió un error inesperado. Por favor, inténtalo más tarde."
      );
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const signup = async (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    try {
      await api.post("/auth/signup", {
        name,
        email,
        userName: username,
        userPassword: password,
      });
      const response = await api.get("/auth/me");
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.userEmail,
        username: response.data.userName,
        role: response.data.userRole,
      });
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          throw new Error(
            "El nombre de usuario o el correo electrónico ya están en uso. Por favor, elige otro."
          );
        }
        throw new Error(error.response?.data.message || "Registro fallido");
      }
      throw new Error(
        "Ocurrió un error inesperado. Por favor, inténtalo más tarde."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, signup, isLoading: loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
