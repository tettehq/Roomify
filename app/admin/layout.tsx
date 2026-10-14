import { requireRole } from "@/lib/auth/authorization"
import { WorkspaceFrame } from "@/components/admin/WorkspaceFrame"
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireRole(["ADMIN"], "/admin")
  return <WorkspaceFrame user={user}>{children}</WorkspaceFrame>
}
