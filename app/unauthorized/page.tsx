import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"

import { ShieldX } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8"
      >
        <Card className="w-full gap-0 p-8 py-0 text-center">
          <ShieldX className="mx-auto text-muted-foreground" size={36} />
          <h1 className="mt-5 font-heading text-3xl font-bold text-foreground">
            This area isn&apos;t available for your role.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Your account is signed in, but it does not have permission to use
            this part of Roomify.
          </p>
          <LinkButton href="/" variant="default" className="mt-6">
            Return home
          </LinkButton>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
