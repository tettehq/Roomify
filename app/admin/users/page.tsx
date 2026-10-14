import { requireRole } from "@/lib/auth/authorization"
import { getAdminUsers } from "@/data/admin-management"
import { AdminShell } from "@/components/admin/AdminShell"
import { EditorDialog } from "@/components/admin/EditorDialog"
import { UserManagementForm } from "@/components/admin/ManagementForms"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const actor = await requireRole(["ADMIN"], "/admin/users")
  const params = await searchParams
  const query =
    typeof params.q === "string" ? params.q.trim().toLowerCase() : ""
  const users = (await getAdminUsers()).filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query)
  )
  return (
    <AdminShell
      title="People & access"
      description="Manage your team and guest accounts, with the right access for every person."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <form className="flex w-full gap-2 sm:max-w-md">
          <Input
            aria-label="Search users"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, or role"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <EditorDialog
          create
          title="Add user"
          description="Create an account with the appropriate access."
        >
          <UserManagementForm />
        </EditorDialog>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              {["Name", "Email", "Role", "Access", "Manage"].map((label) => (
                <th key={label} className="p-4">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="whitespace-nowrap">{user.name}</span>
                  </div>
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className="rounded-md border bg-muted/50 px-2 py-1 text-xs font-medium capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${user.isActive ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {user.isActive ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="p-4">
                  {user.id === actor.id ? (
                    <span className="text-muted-foreground">Your account</span>
                  ) : (
                    <EditorDialog
                      title={`Manage ${user.name}`}
                      description="Changing roles changes available pages. Deactivated users lose access immediately."
                    >
                      <UserManagementForm user={user} />
                    </EditorDialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
          {users.length} {users.length === 1 ? "account" : "accounts"}
          {query ? " matching your search" : " in your workspace"}
        </div>
        {!users.length && (
          <p className="p-6 text-sm text-muted-foreground">
            No users match your search.
          </p>
        )}
      </div>
    </AdminShell>
  )
}
