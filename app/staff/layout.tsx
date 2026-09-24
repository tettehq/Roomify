import { QueryProvider } from "@/components/query-provider"
import { requireRole } from "@/lib/auth/authorization"

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["STAFF", "ADMIN"], "/staff")
  return <QueryProvider key={user.id}>{children}</QueryProvider>
}
