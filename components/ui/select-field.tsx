"use client"

import { Children, isValidElement, type ReactNode } from "react"
import { cn } from "cn"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

type OptionProps = {
  value: string | number
  children: ReactNode
  disabled?: boolean
}
export function SelectFieldOption({ children }: OptionProps) {
  return <>{children}</>
}

/** Shared styled select; the root preserves native FormData submission via name. */
export function SelectField({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  wrapperClassName,
  id,
  "aria-label": ariaLabel,
  ...props
}: {
  children: ReactNode
  value?: string | number
  defaultValue?: string | number
  onValueChange?: (value: string) => void
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  className?: string
  wrapperClassName?: string
  "aria-label"?: string
}) {
  const options = Children.toArray(children)
    .filter(isValidElement<OptionProps>)
    .map((child) => ({
      value: String(child.props.value),
      label: child.props.children,
      disabled: child.props.disabled,
    }))
  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <Select
        {...props}
        items={options}
        value={value === undefined ? undefined : String(value)}
        defaultValue={String(defaultValue ?? options[0]?.value ?? "")}
        onValueChange={(next) => {
          if (next !== null) onValueChange?.(next)
        }}
      >
        <SelectTrigger
          id={id}
          aria-label={ariaLabel}
          className={cn("w-full px-3 data-[size=default]:h-10", className)}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="p-1"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="min-h-9 px-3 pr-8 data-highlighted:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
