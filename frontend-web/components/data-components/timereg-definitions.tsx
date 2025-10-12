"use client"

import {ColumnDef} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {BadgeX, Check, Cross, MoreHorizontal, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {RowData} from "@tanstack/table-core";
import React, {useEffect} from "react";
import DataSelectbox from "@/components/data-components/data-selectbox";


declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editingRowId?: number | null;
    editValues: Partial<TimeRegistration>;
    startEdit: (row: TimeRegistration) => void;
    cancelEdit: () => void;
    cancelAdding: () => void;
    adding: boolean;
  }
}

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
    cell: ({row, table}) => {
      const date: Date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString();

      {if (table.options.meta?.adding && row.original.id === 0) {
        return (<Input type={"date"} placeholder={"Date"} name={"date"}/>);
      }
      }

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({row, table}) => {
      const duration = parseFloat(row.getValue("duration"));
      const formattedDuration = duration.toFixed(2);

      {if (table.options.meta?.adding && row.original.id === 0) {
        return (<Input type={"number"} step={"0.25"} placeholder={"Duration"} name={"duration"}/>);
      }}

      return <div>{formattedDuration}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({row, table}) => {
      {if (table.options.meta?.adding && row.original.id === 0) {
        return (<DataSelectbox dataUrl={"/api/v1/project"} dataIdKey={"id"} dataKey={"name"} placeholder={"Project"} />);
      }}
      const projectName = row.original.project.name;
      return <div>{projectName}</div>;
    },
  },
  {
    accessorKey: "kilometers",
    header: "Kilometers",
    cell: ({row, table}) => {
      const kilometers = parseFloat(row.getValue("kilometers"));
      const formattedKilometers = kilometers.toFixed(2);

      {if (table.options.meta?.adding && row.original.id === 0) {
        return (<Input type={"number"} step={"0.25"} placeholder={"Kilometers"} name={"kilometers"}/>);
      }}
      return <div>{formattedKilometers}</div>;
    }
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({row, table}) => {
      const notes = row.getValue("notes") as string;

      {if (table.options.meta?.adding && row.original.id === 0) {
        return (<Input type={"text"} placeholder={"Notes"} name={"notes"}/>);
      }}
      return <div>{notes}</div>;

    }
  },
  {
    id: "actions",
    cell: ({row, table}) => {
      return (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.options.meta?.startEdit(row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {table.options.meta?.editingRowId === row.original.id && (<Button variant="ghost" onClick={(e) => {
            table.options.meta?.cancelEdit();
          }} size={"icon"} className="pointer-events-auto"><X className="h4 w-4"/></Button>)}
          {table.options.meta?.adding && row.original.id === 0 && (<Button variant="ghost" onClick={(e) => {
            table.options.meta?.cancelAdding();
          }} size={"icon"} className="pointer-events-auto"><X className="h4 w-4"/></Button>)}
        </div>

      )
    }
  }
]