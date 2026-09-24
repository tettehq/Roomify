"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth"
import type { AuthActionState } from "@/lib/auth/validation"
import { AuthField } from "./AuthField"
import { SubmitButton } from "./SubmitButton"

const initialState: AuthActionState = {}

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [state, action] = useActionState(loginAction, initialState)
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
        type="password"
        autoComplete="current-password"
        errors={state.errors?.password}
      />
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
