"use client";

import React, {useEffect, useState} from "react";
import {useAuth} from "@/lib/authContext";
import axios from "axios";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Project, ProjectListProps} from "@/lib/types";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {PenIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export function ProjectList({limit = 10, showSearchInput = false, onlyShowOwnProjects = false}: ProjectListProps) {
  const {user} = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [onlyOwnProjectsFilter, setOnlyOwnProjectsFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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

  const applyFilters = () => {
    setFilteredProjects(
      projects.filter(project => (!onlyOwnProjectsFilter || project?.isOwnProject) &&
        project?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  useEffect(() => {
    applyFilters();
  }, [searchTerm, onlyOwnProjectsFilter, projects]);

  const handleSearchFiltering = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleOnlyOwnProjectsFilter = (checked: boolean) => {
    setOnlyOwnProjectsFilter(checked);
  }

  const handleDeleteProject = async (projectId: number) => {
    try {
      await axios.delete(`/api/proxy/v1/project/${projectId}`)
      setProjects((oldProjectList) => [...oldProjectList.filter(project => project?.id !== projectId)]);
    } catch (error) {
      setError("Could not delete the project.");
    } finally {
      setDeleteDialogOpen(false)
      setSelectedProjectId(null)
      setOpenMenuId(null)
    }
  }
  return (
    <div className="flex flex-col gap-4">
      {showSearchInput && (
        <div className="w-full lg:w-1/2 flex sm:flex-row flex-col gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search projects..." onChange={handleSearchFiltering}/>
            <Checkbox onCheckedChange={handleOnlyOwnProjectsFilter}/>
            <span className="text-xs text-muted-foreground">Only show own projects</span>
          </div>
          <span className="text-xs text-muted-foreground text-right">
            {filteredProjects.length} of {projects.length} projects
          </span>
        </div>)
      }
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-4 items-stretch auto-rows-fr">
        {loading && <p>Fetching projects...</p>}
        {!loading && error.length > 0 && <p>{error}</p>}
        {!loading && error.length === 0 && filteredProjects.length === 0 && <p>No projects to show</p>}
        {filteredProjects.map((project, index) => (
          <Card key={index} className={!project?.isOwnProject ? "bg-secondary" : ""}>
            <CardHeader>
              <CardTitle>
                <h4 className="font-semibold">
                  {project?.name}
                </h4>
                <span className="text-xs font-normal">{project?.project_code}</span>
              </CardTitle>
              <CardAction className="flex gap-2">
                {project?.isOwnProject && (
                  <DropdownMenu open={openMenuId === project.id}
                                onOpenChange={(isOpen) => setOpenMenuId(isOpen ? project.id : null)}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline"><PenIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/project/${project?.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                        setOpenMenuId(null);
                        setSelectedProjectId(project?.id);
                        setDeleteDialogOpen(true);
                      }}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="text-sm">
                  {project?.description}
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you really want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project and time registrations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if (selectedProjectId) await handleDeleteProject(selectedProjectId);
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}