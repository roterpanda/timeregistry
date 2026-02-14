"use client";

import {TimeRegistration} from "@/components/data-components/timereg-definitions";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, PenIcon, TrashIcon, X} from "lucide-react";

interface TimeregMobileListProps {
  data: TimeRegistration[];
  adding: boolean;
  editingRowId: number | null;
  deletingRow: number | null;
  onEdit: (row: TimeRegistration) => void;
  onStartDeleting: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDeleting: () => void;
}

export function TimeregMobileList({
  data,
  adding,
  editingRowId,
  deletingRow,
  onEdit,
  onStartDeleting,
  onConfirmDelete,
  onCancelDeleting,
}: TimeregMobileListProps) {
  // Filter out the placeholder row (id: 0) used for desktop inline adding
  const rows = data.filter((row) => row.id !== 0);

  if (rows.length === 0) {
    return <p className="text-muted-foreground text-sm">No time registrations found.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <Card key={row.id} className="py-4">
          <CardHeader>
            <CardTitle className="text-base">
              <span>{new Date(row.date).toLocaleDateString()}</span>
              <span className="text-muted-foreground font-normal"> — </span>
              <span>{row.project.name}</span>
            </CardTitle>
            <CardAction>
              {deletingRow === row.id ? (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onConfirmDelete(row.id)}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onCancelDeleting}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={adding || editingRowId !== null}
                    onClick={() => onEdit(row)}
                  >
                    <PenIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onStartDeleting(row.id)}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <span>{row.duration.toFixed(2)}h</span>
              </div>
              <div>
                <span className="text-muted-foreground">Km: </span>
                <span>{(row.kilometers ?? 0).toFixed(2)}</span>
              </div>
            </div>
            {row.notes && (
              <p className="text-sm text-muted-foreground mt-2">{row.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
