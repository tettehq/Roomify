import type { ReactNode } from "react"

export function AdminShell({
  title,
  description,
  children,
  action,
}: {
  title: string
  description: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Roomify workspace
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="mt-8 space-y-6">{children}</div>
    </main>
  )
}
