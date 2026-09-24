import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function WorkspaceLoading() {
  return (
    <main
      id="main-content"
      className="mx-auto min-h-[70vh] max-w-7xl space-y-8 px-5 py-12 sm:px-8"
      aria-busy="true"
      aria-label="Loading page"
    >
      <span className="sr-only" role="status">
        Loading…
      </span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
