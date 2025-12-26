import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("mfe-auth-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("mfe-auth-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation - in real app, call your API
    if (email && password.length >= 6) {
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      };

      setUser(userData);
      localStorage.setItem("mfe-auth-user", JSON.stringify(userData));

      // Dispatch custom event for other MFEs
      window.dispatchEvent(
        new CustomEvent("mfe:auth:login", { detail: userData })
      );

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock validation
    if (email && password.length >= 6 && name) {
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };

      setUser(userData);
      localStorage.setItem("mfe-auth-user", JSON.stringify(userData));

      window.dispatchEvent(
        new CustomEvent("mfe:auth:signup", { detail: userData })
      );

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mfe-auth-user");
    window.dispatchEvent(new CustomEvent("mfe:auth:logout"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
