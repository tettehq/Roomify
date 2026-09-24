"use client"
import { Card } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import type { getStaffBookings } from "@/data/bookings"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

type Booking = Awaited<ReturnType<typeof getStaffBookings>>[number]
const date = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))
const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => (
      <>
        <p className="font-semibold">{row.original.guestName}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.guestEmail}
        </p>
      </>
    ),
  },
  { accessorKey: "roomNumber", header: "Room" },
  {
    accessorKey: "checkIn",
    header: "Stay",
    cell: ({ row }) => (
      <>
        {date(row.original.checkIn)} – {date(row.original.checkOut)}
      </>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => (
      <Link
        className="font-semibold text-primary"
        href={`/staff/bookings/${row.original.id}`}
      >
        Open
        <span className="sr-only"> booking for {row.original.guestName}</span>
      </Link>
    ),
  },
]

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  // TanStack Table manages mutable table state and is intentionally not compiler-memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: bookings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    initialState: { pagination: { pageSize: 10 } },
  })
  return (
    <Card className="mt-7 gap-0 py-0">
      <Table className="min-w-[760px]">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {header.column.getCanSort() ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown aria-hidden="true" />
                    </Button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="p-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No bookings match this filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {bookings.length} bookings · Page{" "}
          {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </p>
        <div className="flex items-center gap-2">
          <SelectField
            aria-label="Bookings per page"
            value={table.getState().pagination.pageSize}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            {[10, 20, 50].map((size) => (
              <SelectFieldOption key={size} value={size}>
                {size} per page
              </SelectFieldOption>
            ))}
          </SelectField>
          <Button
            type="button"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}
