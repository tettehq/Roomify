"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover"

export function DatePicker({
  id,
  name,
  label,
  value,
  min,
  onValueChange,
}: {
  id: string
  name: string
  label: string
  value: string
  min: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const parsed = parseISO(value)
  const selected = isValid(parsed) ? parsed : undefined
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              className="w-full justify-between px-3 font-normal"
            />
          }
          aria-label={`${label}: ${selected ? format(selected, "MMM d, yyyy") : "Choose date"}`}
        >
          <span className={selected ? "" : "text-muted-foreground"}>
            {selected ? format(selected, "MMM d, yyyy") : "Choose date"}
          </span>
          <CalendarDays className="text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="max-h-(--available-height) w-auto overflow-y-auto p-2"
        >
          <PopoverTitle className="sr-only">{label}</PopoverTitle>
          <Calendar
            autoFocus
            mode="single"
            selected={selected}
            defaultMonth={selected ?? parseISO(min)}
            disabled={{ before: parseISO(min) }}
            className="[--cell-size:--spacing(9)]"
            onSelect={(date) => {
              onValueChange(date ? format(date, "yyyy-MM-dd") : "")
              setOpen(false)
            }}
          />
          <div className="border-t pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={!value}
              onClick={() => {
                onValueChange("")
                setOpen(false)
              }}
            >
              Clear date
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
