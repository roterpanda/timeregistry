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
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<TimeRegistration>>({});
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

  const startEdit = (row: TimeRegistration) => {
    setEditingRowId(row.id);
    setEditValues(row);
  }

  const cancelEdit = () => {
    setEditingRowId(null);
    setEditValues({});
  }

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
        <DataTable columns={columns} data={timeRegistrations} metaData={{editingRowId, editValues, startEdit, cancelEdit}}/>
      </div>

    </div>
  )
}