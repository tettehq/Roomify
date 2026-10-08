export function PageSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="mx-auto max-w-7xl animate-pulse px-5 py-16 sm:px-8" aria-busy="true" aria-label="Loading">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="mt-3 h-9 w-72 rounded bg-muted" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
                    {Array.from({ length: rows * 3 }, (_, i) => (
                        <div key={i} className="h-40 rounded-2x1 bg-muted" />
                    ))}
            </div>
    )
}