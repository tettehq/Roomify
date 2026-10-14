import { Skeleton } from "@/components/ui/skeleton"
export function WorkspaceLoading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading workspace"
      className="mx-auto max-w-[1500px] space-y-7 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
    >
      <span className="sr-only" role="status">
        Loading workspace…
      </span>
      <div className="space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4 rounded-xl border bg-card p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-14" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b p-5">
          <Skeleton className="h-6 w-48" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b p-5 last:border-0"
          >
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="ml-auto h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </main>
  )
}
