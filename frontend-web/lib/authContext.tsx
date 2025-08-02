"use client";

import React, {createContext, useContext, useEffect, useState} from "react";

type User = {
  name: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: { name: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const storedUser: string | null = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from sessionStorage:", e);
        setUser(null);
      }
    }
  }, []);

  const login = (userData: { name: string }) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
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
}

