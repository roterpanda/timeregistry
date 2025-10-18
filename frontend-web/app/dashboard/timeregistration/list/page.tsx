"use client";

import {Button} from "@/components/ui/button";
import {PlusCircleIcon } from "lucide-react";
import {
  columns,
  TimeRegistration,
  TimeRegistrationFormData,
  timeRegistrationSchema
} from "@/components/data-components/timereg-definitions";
import {DataTable} from "@/components/data-components/data-table";
import api from "@/lib/axios";
import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";



export default function TimeRegistrationTablePage() {
  const [timeRegistrations, setTimeRegistrations] = useState<TimeRegistration[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<TimeRegistration>>({});
  const [adding, setAdding] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingRow, setDeletingRow] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const form = useForm<TimeRegistrationFormData>({
    resolver: zodResolver(timeRegistrationSchema),
    defaultValues: {
      date: "",
      duration: 0,
      project: 0,
      kilometers: 0,
      notes: "",
    },
  });

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

  const startDeleting = (id: number) => {
    setDeletingRow(id);
  }

  const cancelDeleting = () => {
    setDeletingRow(null);
  }

  const deleteTimeRegistration = async (id: number) => {
    try {
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });
      await api.delete(`/api/v1/timeregistration/${id}`);
      setTimeRegistrations((prevState) => prevState.filter((timereg) => timereg.id !== id));
    } catch (error) {
      console.error("Error deleting time registration:", error);
      setError("Error deleting time registration");
    }
    finally {
      setDeletingRow(null);
    }
  }

  const submitAdding = async (data: TimeRegistrationFormData) => {
    try {
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });
      const response = await api.post("/api/v1/timeregistration", {
        date: data.date,
        duration: data.duration,
        project_id: data.project,
        kilometers: data.kilometers,
        notes: data.notes,
      });
      setTimeRegistrations((prevState) => [response.data, ...prevState.filter((timereg) => timereg.id !== 0)]);
      setAdding(false);
      form.reset();
    }
    catch (error) {
      console.error("Error adding time registration:", error);
      setError("Error adding time registration");
    }
    finally {
      setAdding(false);
    }
  }

  const cancelAdding = () => {
    setAdding(false);
    form.reset();
    setTimeRegistrations((prevState) => prevState.filter((timereg) => timereg.id !== 0));
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        All Time Registrations
      </h1>

      <div className="flex space-x-4">
        <Button onClick={() => {
          if (adding) return;
          cancelEdit();
          setAdding(true);
          setTimeRegistrations((prevState) => [{id: 0, date: new Date(), duration: 0, project: {id: 0, name: ""}, notes: "", kilometers: 0}, ...prevState]);
        }}>
            <PlusCircleIcon/>
            New Time Registration
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      <div className="mt-8">
        <DataTable
          columns={columns}
          data={timeRegistrations}
          metaData={{
            editingRowId,
            editValues,
            startEdit,
            cancelEdit,
            adding,
            deletingRow,
            cancelAdding,
            submitAdding: form.handleSubmit(submitAdding),
            form,
            startDeleting,
            cancelDeleting,
            deleteTimeRegistration}}/>
      </div>

    </div>
  )
}