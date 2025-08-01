"use client";

import React, {createContext, useContext, useState} from "react";

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

  const login = (userData: { name: string }) => {
    setUser(userData);
  }

  const logout = () => {
    setUser(null);
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

