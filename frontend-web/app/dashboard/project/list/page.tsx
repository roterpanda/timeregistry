import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PlusCircleIcon } from "lucide-react";
import {ProjectList} from "@/components/data-components/project-list";


export default function ProjectListPage() {
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Your projects
      </h1>

      <div className="flex space-x-4">
        <Button  asChild>
          <Link href={"/dashboard/project/create"}>
            <PlusCircleIcon/>
            Create new project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <ProjectList limit={0} showSearchInput={true} />
      </div>

    </div>
  )
}