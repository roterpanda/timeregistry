"use client";

import {useEffect, useState} from "react";
import {useAuth} from "@/lib/authContext";
import axios from "axios";
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";


export function ProjectList({ limit = 10 }) {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios.get(`/api/proxy/v1/project?limit=${limit}`)
      .then((res) => {
        setProjects(res.data);
      })
      .catch(() => {
        setError("Could not fetch list of projects.");
      })
      .finally(() => setLoading(false))
  }, [user, limit]);

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-3 gap-4">
      {loading && <p>Fetching projects...</p>}
      {!loading && error.length > 0 && <p>{error}</p>}
      {!loading && error.length === 0 && projects.length === 0 && <p>No projects to show</p>}
      {projects.map((project, index) => (
        <Card key={index}>
          <CardContent>
            <CardTitle>
              <h4 className="font-semibold">
                {project.name}
              </h4>
            </CardTitle>
            <CardDescription>
              <p className="text-sm">
                {project.description}
              </p>
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}