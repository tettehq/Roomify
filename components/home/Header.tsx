import { getCurrentUser } from "@/lib/auth/authorization"
import { HeaderClient } from "./HeaderClient"

export async function Header() {
  const user = await getCurrentUser()
  return (
    <HeaderClient user={user ? { name: user.name, role: user.role } : null} />
  )
}
