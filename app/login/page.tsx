import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/AuthShell"
import { LoginForm } from "@/components/auth/LoginForm"
import { getCurrentUser } from "@/lib/auth/authorization"
import { safeReturnTo } from "@/lib/auth/return-to"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const values = await searchParams
  const returnTo = safeReturnTo(values.returnTo)
  if (await getCurrentUser()) redirect(returnTo)
  const registerQuery = new URLSearchParams({ returnTo }).toString()

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Roomify"
      description="Continue your stay planning securely, with your selected room and dates waiting for you."
      alternateText="New to Roomify?"
      alternateHref={`/register?${registerQuery}`}
      alternateLabel="Create an account"
    >
      <LoginForm returnTo={returnTo} />
    </AuthShell>
  )
}
