"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

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
    const stored = sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true})
      .then(() => {
        axios.get("/api/proxy/v1/user", {withCredentials: true, withXSRFToken: true})
          .then((res) => {
            if (res.data) {
              setUser({name: res.data});
              sessionStorage.setItem("user", JSON.stringify({name: res.data.name}));
            } else {
              setUser(null);
              sessionStorage.removeItem("user");
            }
          })
          .catch(() => {
            setUser(null);
            sessionStorage.removeItem("user");
          })
          .finally(() => setLoading(false));
      })
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

