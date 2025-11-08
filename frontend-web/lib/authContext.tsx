"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import api, {setApiCallbacks} from "@/lib/axios";
import {toast} from "sonner";

type User = {
  name: string;
  verified: boolean;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: { name: string; verified: boolean }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isVerified: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setApiCallbacks({
      onUnauthorized: logout,
      onError: (msg) => toast.error(msg)
    });
  }, [])


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        api.get("/api/v1/user")
          .then((res) => setUser(res.data ? {name: res.data.name, verified: res.data.verified} : null))
          .catch(() => setUser(null))
          .finally(() => setLoading(false));
      })
  }, []);

  const login = (userData: { name: string; verified: boolean }) => {
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
      isVerified: user?.verified ?? false,
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

