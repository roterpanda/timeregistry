"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import api from "@/lib/axios";

type User = {
  name: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: { name: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        api.get("/api/v1/user")
          .then((res) => {
            if (res.data) {
              setUser({name: res.data});
            } else {
              setUser(null);
            }
          })
          .catch(() => {
            setUser(null);
          })
          .finally(() => setLoading(false));
      })
  }, []);

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
      isAuthenticated: !!user,
      loading
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

