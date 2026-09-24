import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"

import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function BookingConfirmationNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8"
      >
        <Card className="w-full gap-0 p-8 py-0 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Reservation not found
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            This reservation does not exist or is not associated with your guest
            account.
          </p>
          <LinkButton href="/rooms" variant="default" className="mt-6">
            Browse rooms
          </LinkButton>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
