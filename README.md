# Roomify
## Andrew Halisky
*"May the force be with you" -Jan Dodonna*

## Aaron Quarshie

*If you fail to plan, you plan to fail*

## Samuel Avike
*"Do not fear going slowly, fear only standing still"*

## UI and staff data

Shared controls live in `components/ui` and use the shadcn `base-nova`
configuration. Add more components with `pnpm exec shadcn add <component>`.
The current set was added with:

```sh
pnpm exec shadcn add button input textarea native-select label checkbox table badge card alert --yes
```

- Staff bookings use TanStack Table for sorting and client-side pagination of
  the server-filtered results. Search and status filters remain in the URL.
- The room-service queue uses TanStack Query with server-provided initial data,
  a 15-second refresh interval, manual refresh, and invalidation after status
  changes. Its GET endpoint checks staff/admin authorization on every request.
- The Query provider is scoped to the staff layout and keyed by user ID.
  Database access and authorization stay on the server.
- Native Select preserves native form submission. Its `className` styles the
  select itself; `wrapperClassName` styles the surrounding container.

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` to verify changes.
Database tests require the configured database and seed data. Authentication
requires a `SESSION_SECRET` of at least 32 characters.
