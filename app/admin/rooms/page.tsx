import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import { Label } from "@/components/ui/label"
import { AdminShell } from "@/components/admin/AdminShell"
import { saveRoomAction } from "@/app/actions/admin"

import { getAdminRooms } from "@/data/admin"
import { requireRole } from "@/lib/auth/authorization"
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/lib/room-types"

import { EditorDialog, SaveButton } from "@/components/admin/EditorDialog"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const statuses = ["AVAILABLE", "OCCUPIED", "NEEDS_CLEANING"] as const
export default async function AdminRoomsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await requireRole(["ADMIN"], "/admin/rooms")
  const inventory = await getAdminRooms()
  const { error, q, status: selectedStatus } = await searchParams
  const query = typeof q === "string" ? q : ""
  const status = typeof selectedStatus === "string" ? selectedStatus : ""
  const rooms = inventory.filter(
    (room) =>
      `${room.roomNumber} ${ROOM_TYPE_LABELS[room.type]}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || room.status === status)
  )
  return (
    <AdminShell
      title="Rooms"
      description="Keep your room inventory, nightly rates, and availability up to date."
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          {inventory.length} rooms ·{" "}
          {inventory.filter((room) => room.status === "AVAILABLE").length}{" "}
          available
        </p>
        <EditorDialog
          title="Add room"
          description="Set up room details, pricing, and capacity."
          create
        >
          <RoomForm />
        </EditorDialog>
      </div>
      <form className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
        <Input
          name="q"
          aria-label="Search rooms"
          placeholder="Search room number or type"
          defaultValue={query}
          className="sm:max-w-sm"
        />
        <select
          name="status"
          aria-label="Room status"
          defaultValue={status}
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        >
          <option value="">All room statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value.toLowerCase().replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Search rooms
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Changes could not be saved</AlertTitle>
          <AlertDescription>
            {error === "invalid"
              ? "Check all required fields and try again."
              : "Please check the details and try again."}
          </AlertDescription>
        </Alert>
      )}
      <Card className="gap-0 overflow-hidden py-0 shadow-none">
        <CardContent className="overflow-hidden px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Nightly rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="pl-6 font-semibold">
                    Room {room.roomNumber}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{ROOM_TYPE_LABELS[room.type]}</p>
                    <p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">
                      {room.description}
                    </p>
                  </TableCell>
                  <TableCell>{room.capacity} guests</TableCell>
                  <TableCell className="tabular-nums">
                    ${room.baseRate}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={room.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <EditorDialog
                      title={`Room ${room.roomNumber}`}
                      description="Update details below, then save your changes."
                    >
                      <RoomForm room={room} />
                    </EditorDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {!rooms.length && (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No rooms match these filters. Try another room number or status.
          </p>
        )}
        <div className="border-t bg-muted/40 px-6 py-4 text-xs text-muted-foreground">
          {rooms.length} of {inventory.length} rooms · Select Edit to manage an
          entry.
        </div>
      </Card>
    </AdminShell>
  )
}
function RoomForm({
  room,
}: {
  room?: Awaited<ReturnType<typeof getAdminRooms>>[number]
}) {
  return (
    <form action={saveRoomAction} className="space-y-2">
      <input type="hidden" name="id" value={room?.id ?? ""} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Label className="block text-sm text-foreground">
          Room number
          <Input
            required
            name="roomNumber"
            defaultValue={room?.roomNumber}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground">
          Type
          <SelectField
            name="type"
            defaultValue={room?.type ?? ROOM_TYPES[0]}
            className="mt-1 w-full"
          >
            {ROOM_TYPES.map((type) => (
              <SelectFieldOption key={type} value={type}>
                {ROOM_TYPE_LABELS[type]}
              </SelectFieldOption>
            ))}
          </SelectField>
        </Label>
        <Label className="block text-sm text-foreground">
          Capacity
          <Input
            required
            type="number"
            min="1"
            max="20"
            name="capacity"
            defaultValue={room?.capacity ?? 2}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground">
          Base rate
          <Input
            required
            inputMode="decimal"
            name="baseRate"
            defaultValue={room?.baseRate}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground sm:col-span-2">
          Description
          <Textarea
            required
            name="description"
            defaultValue={room?.description}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground">
          Status
          <SelectField
            name="status"
            defaultValue={room?.status ?? "AVAILABLE"}
            className="mt-1 w-full"
          >
            {statuses.map((status) => (
              <SelectFieldOption key={status} value={status}>
                {status.replaceAll("_", " ")}
              </SelectFieldOption>
            ))}
          </SelectField>
        </Label>
        <Label className="block text-sm text-foreground">
          Image URL
          <Input
            name="imageUrl"
            defaultValue={room?.imageUrl ?? ""}
            className="mt-1"
          />
        </Label>
      </div>
      <SaveButton>{room ? "Save changes" : "Create room"}</SaveButton>
    </form>
  )
}
