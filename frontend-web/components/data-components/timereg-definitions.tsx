"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Button} from "@/components/ui/button";
import {Check, PenIcon, TrashIcon, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {RowData} from "@tanstack/table-core";
import React from "react";
import DataSelectbox from "@/components/data-components/data-selectbox";
import {z} from "zod";
import {Controller, UseFormReturn} from "react-hook-form";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";


declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    editingRowId?: number | null;
    startEdit: (row: TimeRegistration) => void;
    cancelEdit: () => void;
    cancelAdding: () => void;
    submitAdding: () => void;
    adding: boolean;
    deletingRow: number | null;
    form?: UseFormReturn<TimeRegistrationFormData>;
    deleteTimeRegistration: (id: number) => void;
    startDeleting: (id: number) => void;
    cancelDeleting: () => void;
    updateTimeRegistration: () => void;
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

export const timeRegistrationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  duration: z.number().positive("Duration must be positive"),
  project: z.number().min(1, "Project is required"),
  kilometers: z.number().min(0, "Kilometers must be positive or zero"),
  notes: z.string().optional(),
});

export type TimeRegistrationFormData = z.infer<typeof timeRegistrationSchema>;

export const columns: ColumnDef<TimeRegistration>[] = [
  {
    accessorKey: "date",
    header: "Date",
    sortingFn: "datetime",
    cell: ({row, table}) => {
      if (table.options.meta?.adding && row.original.id === 0 || table.options.meta?.editingRowId === row.original.id) {
        const {register, formState: {errors}} = table.options.meta.form!;
        return (<div>
          <Input type={"date"} {...register("date")} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message as string}</p>}
        </div>);
      }

      const date: Date = new Date(row.getValue("date"));
      const formattedDate = date.toLocaleDateString();
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({row, table}) => {
      if (table.options.meta?.adding && row.original.id === 0 || table.options.meta?.editingRowId === row.original.id) {
        const {register, formState: {errors}} = table.options.meta.form!;
        return (
          <div>
            <Input
              type="number"
              step="0.25"
              placeholder="0.00"
              {...register("duration", { valueAsNumber: true })}
            />
            {errors.duration && <p className="text-xs text-red-500">{errors.duration.message as string}</p>}
          </div>);
      }

      const duration = parseFloat(row.getValue("duration"));
      const formattedDuration = duration.toFixed(2);
      return <div>{formattedDuration}</div>;
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({row, table}) => {
      if (table.options.meta?.adding && row.original.id === 0 || table.options.meta?.editingRowId === row.original.id) {
        const {control, formState: {errors}} = table.options.meta.form!;
        return (
          <div>
            <Controller
              name="project"
              control={control}
              render={({field}) => (
                <DataSelectbox
                  dataUrl="/api/v1/project"
                  dataIdKey="id"
                  dataKey="name"
                  placeholder="Project"
                  value={field.value}
                  onValueChange={(value) => field.onChange(Number(value))} />
              )}
            />
            {errors.project && <p className="text-xs text-red-500">{errors.project.message as string}</p>}
          </div>
        )
      }
      const projectName = row.original.project.name;
      return <div>{projectName}</div>;
    },
  },
  {
    accessorKey: "kilometers",
    header: "Kilometers",
    cell: ({row, table}) => {
      if (table.options.meta?.adding && row.original.id === 0 || table.options.meta?.editingRowId === row.original.id) {
        const {register, formState: {errors}} = table.options.meta.form!;
        return (
          <div>
            <Input
              type="number"
              step="0.25"
              placeholder="0.00"
              {...register("kilometers", { valueAsNumber: true })}
            />
            {errors.kilometers && <p className="text-xs text-red-500">{errors.kilometers.message as string}</p>}
          </div>);
      }

      const kilometers = parseFloat(row.getValue("kilometers"));
      const formattedKilometers = kilometers.toFixed(2);
      return <div>{formattedKilometers}</div>;
    }
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({row, table}) => {
      if (table.options.meta?.adding && row.original.id === 0 || table.options.meta?.editingRowId === row.original.id) {
        const {register, formState: {errors}} = table.options.meta.form!;
        return (
          <div>
            <Input
              placeholder="Notes"
              {...register("notes")}
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes.message as string}</p>}
          </div>);
      }
      const notes = row.getValue("notes") as string;
      return <div>{notes}</div>;
    }
  },
  {
    id: "actions",
    cell: ({row, table}) => {
      return (
        <div className="flex gap-2">
          {row.original.id !== 0 && table.options.meta?.deletingRow !== row.original.id && table.options.meta?.editingRowId !== row.original.id && (
            <div>
              {table.options.meta?.adding ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (!table.options.meta?.adding) {
                          table.options.meta?.startEdit(row.original);
                        }
                      }}
                    >
                      <PenIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First finish adding.</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => table.options.meta?.startEdit(row.original)}
                >
                  <PenIcon />
                </Button>)}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.options.meta?.startDeleting(row.original.id)}
              >
                <TrashIcon />
              </Button>
            </div>
          )}
          {((table.options.meta?.adding && row.original.id === 0) || (table.options.meta?.editingRowId === row.original.id)) && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={
                table.options.meta?.adding && row.original.id === 0 ?
                table.options.meta?.submitAdding :
                table.options.meta?.updateTimeRegistration }
              >
                <Check />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={ table.options.meta?.adding && row.original.id === 0 ?
                () => table.options.meta?.cancelAdding()
                : () => table.options.meta?.cancelEdit()}>
                <X />
              </Button>
            </>)}
          {table.options.meta?.deletingRow === row.original.id && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.options.meta?.deleteTimeRegistration(row.original.id)}
              >
                <Check />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => table.options.meta?.cancelDeleting()}>
                <X />
              </Button>
            </>)}
        </div>

      )
    }
  }
]