"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PlusCircleIcon } from "lucide-react";
import {ProjectList} from "@/components/data-components/project-list";
import {columns, TimeRegistration} from "@/components/data-components/timereg-definitions";
import {DataTable} from "@/components/data-components/data-table";
import api from "@/lib/axios";
import {useEffect, useMemo, useState} from "react";



export default function TimeRegistrationTablePage() {
  const [timeRegistrations, setTimeRegistrations] = useState<TimeRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    api.get("/sanctum/csrf-cookie", { withCredentials: true });
    api.get("/api/v1/timeregistration")
      .then((res) => {
        setTimeRegistrations(res.data);
      })
      .catch(() => {
        setError("Could not fetch list of projects.");
      })
      .finally(() => setLoading(false))
  }, []);

  const metaData = useMemo(() => ({
    updateData: (rowIndex: number, columnId: keyof TimeRegistration, value: unknown) => {
      setTimeRegistrations((old) => old.map((row, i) => i === rowIndex ? {...row, [columnId]: value as any } : row))
    },
  }), []);

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        All Time Registrations
      </h1>

      <div className="flex space-x-4">
        <Button  asChild>
          <Link href={"/"}>
            <PlusCircleIcon/>
            New Time Registration
          </Link>
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      <div className="mt-8">
        <DataTable columns={columns} data={timeRegistrations} metaData={metaData}/>
      </div>

    </div>
  )
}