import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  errors,
}: {
  id: string
  label: string
  type?: "text" | "email" | "password"
  autoComplete: string
  errors?: string[]
}) {
  const errorId = errors?.length ? `${id}-error` : undefined
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={errorId}
        className="mt-2"
      />
      {errors?.length ? (
        <ul id={errorId} className="mt-2 space-y-1 text-sm text-destructive">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
