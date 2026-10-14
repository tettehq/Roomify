export function canManageAccount(actorId: string, targetId: string) {
  return actorId !== targetId
}

export function canEditReservation(status: string) {
  return status === "PENDING" || status === "CONFIRMED"
}
export class ManagementError extends Error {}
