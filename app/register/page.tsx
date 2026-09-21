import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/AuthShell"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { getCurrentUser } from "@/lib/auth/authorization"
import { safeReturnTo } from "@/lib/auth/return-to"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const values = await searchParams
  const returnTo = safeReturnTo(values.returnTo)
  if (await getCurrentUser()) redirect(returnTo)
  const loginQuery = new URLSearchParams({ returnTo }).toString()

  return (
    <AuthShell
      eyebrow="Join Roomify"
      title="Create your guest account"
      description="Save your details securely and continue toward reservation review without losing your selected stay."
      alternateText="Already have an account?"
      alternateHref={`/login?${loginQuery}`}
      alternateLabel="Sign in"
    >
      <RegisterForm returnTo={returnTo} />
    </AuthShell>
  )
}
