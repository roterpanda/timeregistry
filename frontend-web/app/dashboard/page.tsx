"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PenIcon, PlusCircleIcon } from "lucide-react";
import {useAuth} from "@/lib/authContext";
import {ProjectList} from "@/components/data-components/project-list";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {TimeregistrationStats} from "@/lib/types";



export default function Dashboard() {
  const { user } = useAuth();

  const [timeRegStats, setTimeRegStats] = useState<TimeregistrationStats>({ count: 0, totalTime: 0 });

  useEffect( () => {
    api.get("/sanctum/csrf-cookie", { withCredentials: true }).then(
      () => {
        api.get("/api/v1/timeregistration/stats", { withCredentials: true }).then(
          (res) => {
            setTimeRegStats(res.data);
          }
        )
      }
    );
  }, [user]);

  return (
      <div className="w-full flex flex-col flex-1 mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-lg">Welcome, {user?.name ?? "User"}</p>

        <div className="flex space-x-4">
          <Button asChild={true}>
            <Link href={"/dashboard/timeregistration/list"}>
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
          <ProjectList limit={3} showSearchInput={false} onlyShowOwnProjects={true} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Latest stats</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Number of time registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold">
                  {timeRegStats.count}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total hours registered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold">
                  {timeRegStats.totalTime}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}