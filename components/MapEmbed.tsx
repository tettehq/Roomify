export function MapEmbed({ address, className = "" }: { address: string; className?: string }) {
  return (
    <iframe
      src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      title={`Map showing Roomify at ${address}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`w-full rounded-2xl border-0 ${className}`}
    />
  )
}