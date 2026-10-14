import { QueryProvider } from "@/components/query-provider"
import { requireRole } from "@/lib/auth/authorization"
import { WorkspaceFrame } from "@/components/admin/WorkspaceFrame"
export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["STAFF", "ADMIN"], "/staff")
  return (
    <WorkspaceFrame user={user}>
      <QueryProvider key={user.id}>{children}</QueryProvider>
    </WorkspaceFrame>
  )
}
