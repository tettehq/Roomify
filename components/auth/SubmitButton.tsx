"use client"

import { useFormStatus } from "react-dom"

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1b4332] px-5 text-sm font-semibold text-white transition hover:bg-[#2d6a4f] focus-visible:ring-4 focus-visible:ring-[#1b4332]/20 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  )
}
