import {ProjectForm} from "@/components/forms/project-form";


export default function CreateProject() {
  return (
    <div className="w-5/6 md:w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Add a new project.
      </h1>
      <ProjectForm />
    </div>


  )
}