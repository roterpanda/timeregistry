"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

export type ProjectShortened = {
  id: number
  name: string
}


export type TimeRegistration = {
  id: number
  date: Date
  duration: number
  project: ProjectShortened
  notes: string
  kilometers: number | null | undefined
}

export const columns: ColumnDef<TimeRegistration>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({row}) => {
      const date: Date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString();

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({row}) => {
      const duration = parseFloat(row.getValue("duration"));
      const formattedDuration = duration.toFixed(2);

      return <div>{formattedDuration}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({row}) => {
      const projectName = row.original.project.name;
      return <div>{projectName}</div>;
    },
  },
  {
    accessorKey: "kilometers",
    header: "Kilometers",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({row}) => {
      const timeregistration = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      )
    }
  }
]