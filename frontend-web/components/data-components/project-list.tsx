"use client";

import React, {useEffect, useState} from "react";
import {useAuth} from "@/lib/authContext";
import axios from "axios";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Project, ProjectListProps} from "@/lib/types";
import {Input} from "@/components/ui/input";


export function ProjectList({ limit = 10, showSearchInput = false, onlyShowOwnProjects = false } : ProjectListProps ) {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setFilteredProjects([]);
      setLoading(false);
      return;
    }
    axios.get(`/api/proxy/v1/project?limit=${limit}&onlyOwn=${onlyShowOwnProjects}`)
      .then((res) => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch(() => {
        setError("Could not fetch list of projects.");
      })
      .finally(() => setLoading(false))
  }, [user, limit, onlyShowOwnProjects]);

  const handleSearchFiltering = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredProjects(() => projects.filter((project) =>
      project.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  }

  return (
    <div className="flex flex-col gap-4">

      { showSearchInput && (
        <div className="w-full pr-0 sm:w-1/3 md:w-1/4 sm:pr-2 md:pr-2 ">
          <Input placeholder="Search projects..." onChange={handleSearchFiltering}/>
        </div>)
      }

      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-3 gap-4 items-stretch auto-rows-fr">
        {loading && <p>Fetching projects...</p>}
        {!loading && error.length > 0 && <p>{error}</p>}
        {!loading && error.length === 0 && filteredProjects.length === 0 && <p>No projects to show</p>}
        {filteredProjects.map((project, index) => (
          <Card key={index} className={!project.isOwnProject ? "bg-secondary" : ""}>
            <CardHeader>
              <CardTitle>
                <h4 className="font-semibold">
                  {project.name}
                </h4>
                <span className="text-xs font-normal">{project.project_code}</span>
              </CardTitle>
              <CardAction>

              </CardAction>
            </CardHeader>
            <CardContent>

              <CardDescription>
                <p className="text-sm">
                  {project.description}
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}