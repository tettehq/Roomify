import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import { Label } from "@/components/ui/label"
import { AdminShell } from "@/components/admin/AdminShell"
import { saveMenuItemAction } from "@/app/actions/admin"

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
  const inventory = await getAdminMenuItems()
  const { error, q, category: selectedCategory } = await searchParams
  const query = typeof q === "string" ? q : ""
  const category = typeof selectedCategory === "string" ? selectedCategory : ""
  const items = inventory.filter(
    (item) =>
      `${item.name} ${item.description}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!category || item.category === category)
  )
  return (
    <AdminShell
      title="Service menu"
      description="Curate the food, drinks, and amenities available to your guests."
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          {inventory.length} menu items ·{" "}
          {inventory.filter((item) => item.isAvailable).length} available to
          order
        </p>
        <EditorDialog
          title="Add menu item"
          description="Add a new item for guests to order."
          create
        >
          <MenuForm />
        </EditorDialog>
      </div>
      <form className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
        <Input
          name="q"
          aria-label="Search menu"
          placeholder="Search dishes, drinks, or amenities"
          defaultValue={query}
          className="sm:max-w-sm"
        />
        <select
          name="category"
          aria-label="Menu category"
          defaultValue={category}
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value.toLowerCase().replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Search menu
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
                  <TableCell className="tabular-nums">${item.price}</TableCell>
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
        {!items.length && (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No menu items match these filters. Try another name or category.
          </p>
        )}
        <div className="border-t bg-muted/40 px-6 py-4 text-xs text-muted-foreground">
          {items.length} of {inventory.length} menu items · Select Edit to
          manage an entry.
        </div>
      </Card>
    </AdminShell>
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
