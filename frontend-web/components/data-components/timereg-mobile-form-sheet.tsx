"use client";

import {TimeRegistrationFormData} from "@/components/data-components/timereg-definitions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import DataSelectbox from "@/components/data-components/data-selectbox";
import {Controller, UseFormReturn} from "react-hook-form";

interface TimeregMobileFormSheetProps {
  open: boolean;
  isEditing: boolean;
  form: UseFormReturn<TimeRegistrationFormData>;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TimeregMobileFormSheet({
  open,
  isEditing,
  form,
  onSubmit,
  onCancel,
}: TimeregMobileFormSheetProps) {
  const {register, control, formState: {errors}} = form;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Time Registration" : "New Time Registration"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update the fields below." : "Fill in the fields below to add a new entry."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mobile-date">Date</Label>
            <Input id="mobile-date" type="date" {...register("date")} />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message as string}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mobile-duration">Duration (hours)</Label>
            <Input
              id="mobile-duration"
              type="number"
              step="0.25"
              placeholder="0.00"
              {...register("duration", {valueAsNumber: true})}
            />
            {errors.duration && <p className="text-xs text-red-500">{errors.duration.message as string}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Project</Label>
            <Controller
              name="project"
              control={control}
              render={({field}) => (
                <DataSelectbox
                  dataUrl="/api/v1/project"
                  dataIdKey="id"
                  dataKey="name"
                  placeholder="Select project"
                  value={field.value}
                  onValueChange={(value) => field.onChange(Number(value))}
                />
              )}
            />
            {errors.project && <p className="text-xs text-red-500">{errors.project.message as string}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mobile-kilometers">Kilometers</Label>
            <Input
              id="mobile-kilometers"
              type="number"
              step="0.25"
              placeholder="0.00"
              {...register("kilometers", {valueAsNumber: true})}
            />
            {errors.kilometers && <p className="text-xs text-red-500">{errors.kilometers.message as string}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mobile-notes">Notes</Label>
            <Input
              id="mobile-notes"
              placeholder="Notes"
              {...register("notes")}
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes.message as string}</p>}
          </div>
        </div>

        <SheetFooter>
          <Button onClick={onSubmit} className="w-full">
            {isEditing ? "Save" : "Add"}
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
