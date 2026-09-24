"use client"

import { Button } from "@/components/ui/button"

import { useFormStatus } from "react-dom"

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Please wait…" : children}
    </Button>
  )
}
