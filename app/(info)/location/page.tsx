import type { Metadata } from "next"
import { MapPin, Train, Car, Plane } from "lucide-react"
import { PageHeading } from "@/components/info/PageHeading"
import { MapEmbed } from "@/components/MapEmbed"
import { hotel } from "@/lib/hotel-info"

export const metadata: Metadata = {
  title: "Location & Directions",
  description: `Find Roomify at ${hotel.address}.`,
}

const directions = [
  { icon: Plane, title: "From the airport", text: "About 25 minutes by taxi or rideshare." },
  { icon: Train, title: "By transit", text: "Nearest station is a 5-minute walk." },
  { icon: Car, title: "By car", text: "On-site parking available for a daily fee." },
]

export default function LocationPage() {
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hotel.address)}`

  return (
    <>
      <PageHeading eyebrow="Getting here" title="Location & directions" />
      <p className="flex items-center gap-2 font-semibold">
        <MapPin size={18} className="text-primary" aria-hidden /> {hotel.address}
      </p>
      <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
        Get directions in Google Maps
      </a>
      <MapEmbed address={hotel.address} className="mt-8 aspect-[4/3]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {directions.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-card p-5">
            <Icon size={20} className="text-primary" aria-hidden />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </>
  )
}