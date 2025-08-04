"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PenIcon, PlusCircleIcon } from "lucide-react";
import {useAuth} from "@/lib/authContext";
import {ProjectList} from "@/components/data-components/project-list";


export default function Dashboard() {
  const { user } = useAuth();

  return (
      <div className="w-full mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-lg">Welcome, {user?.name ?? "User"}</p>

        <div className="flex space-x-4">
          <Button asChild={true}>
            <Link href={"/dashboard"}>
              <PenIcon/>
              Register time
            </Link>
          </Button>
          <Button variant={"secondary"} asChild={true}>
            <Link href={"/dashboard/project/create"}>
              <PlusCircleIcon/>
              Create new project
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
          <ProjectList limit={3} showSearchInput={true} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Time Registrations</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between">
              <span>Project Alpha</span>
              <span>2h - 2024-06-10</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Project Beta</span>
              <span>2h - 2024-06-10</span>
            </li>
          </ul>
        </div>
      </div>
  )
}