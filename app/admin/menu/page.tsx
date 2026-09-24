import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { saveMenuItemAction } from "@/app/actions/admin"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getAdminMenuItems } from "@/data/admin"
import { requireRole } from "@/lib/auth/authorization"

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

const categories = [
  "BREAKFAST",
  "MAIN_MEALS",
  "DRINKS",
  "SNACKS",
  "AMENITIES",
] as const
export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await requireRole(["ADMIN"], "/admin/menu")
  const items = await getAdminMenuItems()
  const { error } = await searchParams
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8"
      >
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Administration / Menu
        </Link>
        <div className="my-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Room-service menu
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Curate your menu, pricing, and availability.
            </p>
          </div>
          <EditorDialog
            title="Add menu item"
            description="Add a new item for guests to order."
            create
          >
            <MenuForm />
          </EditorDialog>
        </div>
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
        <Card className="gap-0 py-0">
          <CardContent className="overflow-hidden px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Menu item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="pr-6 text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-72 pl-6 whitespace-normal">
                      <p className="font-semibold">{item.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize">
                      {item.category.toLowerCase().replaceAll("_", " ")}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      ${item.price}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={item.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                      />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <EditorDialog
                        title={item.name}
                        description="Update details below, then save your changes."
                      >
                        <MenuForm item={item} />
                      </EditorDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="border-t bg-muted/40 px-6 py-4 text-xs text-muted-foreground">
            {items.length} menu items · Select Edit to manage an entry.
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
function MenuForm({
  item,
}: {
  item?: Awaited<ReturnType<typeof getAdminMenuItems>>[number]
}) {
  return (
    <form action={saveMenuItemAction} className="space-y-2">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Label className="block text-sm text-foreground sm:col-span-2">
          Name
          <Input
            required
            name="name"
            defaultValue={item?.name}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground sm:col-span-2">
          Description
          <Textarea
            required
            name="description"
            defaultValue={item?.description}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground">
          Category
          <SelectField
            name="category"
            defaultValue={item?.category ?? categories[0]}
            className="mt-1 w-full"
          >
            {categories.map((category) => (
              <SelectFieldOption key={category} value={category}>
                {category.replaceAll("_", " ")}
              </SelectFieldOption>
            ))}
          </SelectField>
        </Label>
        <Label className="block text-sm text-foreground">
          Price
          <Input
            required
            name="price"
            inputMode="decimal"
            defaultValue={item?.price}
            className="mt-1"
          />
        </Label>
        <Label className="block text-sm text-foreground sm:col-span-2">
          Image URL
          <Input
            name="imageUrl"
            defaultValue={item?.imageUrl ?? ""}
            className="mt-1"
          />
        </Label>
        <Label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
          <Checkbox
            name="isAvailable"
            value="true"
            defaultChecked={item?.isAvailable ?? true}
          />{" "}
          Available to guests
        </Label>
      </div>
      <SaveButton>{item ? "Save changes" : "Create item"}</SaveButton>
    </form>
  )
}
