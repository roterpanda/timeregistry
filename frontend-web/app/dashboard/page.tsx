"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";

export default function Dashboard() {
  const [protectedMsg, setProtectedMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/user", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setProtectedMsg(response.data.message);
      setIsAuthenticated(true);
      setError("");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setIsAuthenticated(false);
          setError("Not authenticated. Please log in");
          window.location.href = "/login";
        } else {
          console.log(err);
          setError("Error fetching resource");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <div>Please log in to access the dashboard</div>;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Protected Data: {protectedMsg}</p>
    </main>
  );
}
