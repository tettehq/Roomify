"use client"

import { useFormStatus } from "react-dom"
import { Plus, Pencil, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
export function EditorDialog({
  title,
  description,
  create = false,
  children,
}: {
  title: string
  description: string
  create?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={create ? "default" : "outline"}
            size={create ? "default" : "sm"}
          />
        }
      >
        {create ? <Plus /> : <Pencil />}
        {create ? title : "Edit"}
        {!create && <span className="sr-only"> {title}</span>}
      </DialogTrigger>
      <DialogContent className="workspace-editor max-h-[90dvh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b bg-muted/40 px-6 py-5 pr-12">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
export function SaveButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="mt-6 w-full sm:w-auto">
      {pending && <LoaderCircle className="animate-spin" />}
      {pending ? "Saving…" : children}
    </Button>
  )
}
