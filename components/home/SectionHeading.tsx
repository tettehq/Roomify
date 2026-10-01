export function SectionHeading({eyebrow, title}: { eyebrow: string; title: string}) {
    return (
        <div className="mb-9">
            <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground">{title}</h2>  
        </div>
    )
}