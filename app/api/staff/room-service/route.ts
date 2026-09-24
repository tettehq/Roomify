import { getCurrentUser } from "@/lib/auth/authorization"
import { getStaffOrders } from "@/data/room-service"

export async function GET() {
  const user = await getCurrentUser()
  const headers = { "Cache-Control": "private, no-store" }
  if (!user)
    return Response.json(
      { message: "Please sign in again." },
      { status: 401, headers }
    )
  if (user.role !== "STAFF" && user.role !== "ADMIN") {
    return Response.json(
      { message: "Staff access is required." },
      { status: 403, headers }
    )
  }
  try {
    return Response.json(await getStaffOrders(), { headers })
  } catch {
    return Response.json(
      { message: "Unable to load orders. Please try again." },
      { status: 500, headers }
    )
  }
}
