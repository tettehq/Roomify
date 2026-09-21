"use client"

import { useActionState } from "react"
import { registerAction } from "@/app/actions/auth"
import type { AuthActionState } from "@/lib/auth/validation"
import { AuthField } from "./AuthField"
import { SubmitButton } from "./SubmitButton"

const initialState: AuthActionState = {}

export function RegisterForm({ returnTo }: { returnTo: string }) {
  const [state, action] = useActionState(registerAction, initialState)
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />
      <AuthField
        id="name"
        label="Full name"
        autoComplete="name"
        errors={state.errors?.name}
      />
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
        autoComplete="new-password"
        errors={state.errors?.password}
      />
      <AuthField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        errors={state.errors?.confirmPassword}
      />
      {state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-[#f0c9ba] bg-[#fff8f5] p-3 text-sm text-[#8b4b38]"
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton>Create guest account</SubmitButton>
    </form>
  )
}
