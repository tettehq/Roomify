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
      <label htmlFor={id} className="text-sm font-semibold text-[#334155]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={errorId}
        className="mt-2 min-h-12 w-full rounded-lg border border-[#d7d9d5] bg-white px-3.5 text-sm text-[#0f172a] transition outline-none placeholder:text-[#94a3b8] focus:border-[#1b4332] focus:ring-3 focus:ring-[#1b4332]/12 aria-invalid:border-[#be123c] aria-invalid:ring-[#be123c]/10"
      />
      {errors?.length ? (
        <ul id={errorId} className="mt-2 space-y-1 text-sm text-[#a13d32]">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
