"use client"

import { useActionState, useState } from "react"
import { loginAction } from "@/app/actions/auth"
import type { AuthActionState } from "@/lib/auth/validation"
import { AuthField } from "./AuthField"
import { SubmitButton } from "./SubmitButton"
import { Checkbox } from "@/components/ui/checkbox"

const initialState: AuthActionState = {}

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [state, action] = useActionState(loginAction, initialState)

  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      <AuthField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        errors={state.errors?.email}
      />

      <AuthField
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        errors={state.errors?.password}
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id="show-password"
          checked={showPassword}
          onCheckedChange={(checked) => setShowPassword(!!checked)}
        />
        <label
          htmlFor="show-password"
          className="cursor-pointer text-sm font-medium text-gray-900 select-none dark:text-gray-100"
        >
          Show password
        </label>
      </div>

      {state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton>Sign in</SubmitButton>
    </form>
  )
}
