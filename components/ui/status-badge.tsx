import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
export function StatusBadge({ status }: { status: string }) {
  const tone = ["CONFIRMED", "AVAILABLE", "COMPLETED"].includes(status)
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : ["PENDING", "NEEDS_CLEANING"].includes(status)
      ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
      : ["CHECKED_IN", "IN_PROGRESS", "OCCUPIED"].includes(status)
        ? "bg-sky-500/10 text-sky-700 dark:text-sky-300"
        : "bg-muted text-muted-foreground"
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 font-medium whitespace-nowrap", tone)}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/^./, (s) => s.toUpperCase())}
    </Badge>
  )
}
