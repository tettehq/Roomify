import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"

import { ArrowLeft, BedDouble } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function RoomNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8"
      >
        <Card className="w-full gap-0 p-8 py-0 text-center">
          <BedDouble className="mx-auto text-muted-foreground" size={34} />
          <p className="mt-5 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Room not found
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
            This room isn&apos;t available to view.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            The room link may be incorrect, or the room may no longer be listed.
          </p>
          <LinkButton href="/rooms" variant="default" className="mt-6">
            <ArrowLeft size={16} /> View available rooms
          </LinkButton>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
