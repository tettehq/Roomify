export function PageHeading({ eyebrow, title, intro, updated }: {
  eyebrow: string; title: string; intro?: string; updated?: string
}) {
  return (
    <header className="mb-12">
      <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-[-0.05em]">{title}</h1>
      {intro && <p className="mt-4 text-base leading-7 text-muted-foreground">{intro}</p>}
      {updated && <p className="mt-3 text-xs text-muted-foreground">Last updated {updated}</p>}
    </header>
  )
}