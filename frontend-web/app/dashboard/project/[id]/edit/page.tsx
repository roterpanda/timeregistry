"use client";

import {useParams} from "next/navigation";
import {ProjectForm} from "@/components/forms/project-form";
import {useEffect, useState} from "react";
import {Project} from "@/lib/types";
import api from "@/lib/axios";


export default function EditProjectPage() {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<Project>(null);
  const [error, setError] = useState<string>("");

  const projectId = parseInt(params?.id as string) || 0;



  useEffect(() => {
    api.get(`/api/v1/project/${projectId}`)
      .then((res) => {
        setProject({
          name: res.data.name,
          description: res.data.description,
          project_code: res.data.project_code,
          is_public: res.data.is_public === 1,
          isOwnProject: res.data.isOwnProject,
          id: res.data.id,
        });

      })
      .catch(() => {
        setError("Could not fetch the project information");
      })
      .finally(() => {
        setLoading(false);
      })
  }, [projectId]);

  if (projectId < 1) return (
    <div>
      Invalid project id.
    </div>
  );

  if (loading) return (<div>Loading...</div>);
  if (error.length > 0) return (<div>{error}</div>);

  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Edit a project
      </h1>
      <ProjectForm isEdit={true} project={project}/>
    </div>
  )

}