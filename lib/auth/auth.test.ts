import assert from "node:assert/strict"
import test from "node:test"
import bcrypt from "bcryptjs"
import {
  createGuestUser,
  findSafeUserByEmail,
  isUniqueEmailViolation,
} from "../../data/users"
import { authenticateUser } from "./authenticate"
import { safeReturnTo } from "./return-to"
import { roleAllowed } from "./roles"
import { createSessionToken, readSessionToken } from "./session"

const SEEDED_PASSWORD = "RoomifyDemo123!"
const TEST_EMAIL = "auth-foundation-test@roomify.test"

test("seeded guest, staff, and admin credentials authenticate with trusted roles", async () => {
  const [guest, staff, admin] = await Promise.all([
    authenticateUser("ama@roomify.test", SEEDED_PASSWORD),
    authenticateUser("frontdesk@roomify.test", SEEDED_PASSWORD),
    authenticateUser("admin@roomify.test", SEEDED_PASSWORD),
  ])

  assert.equal(guest?.role, "GUEST")
  assert.equal(staff?.role, "STAFF")
  assert.equal(admin?.role, "ADMIN")
  assert.equal("passwordHash" in (guest ?? {}), false)
})

test("wrong passwords and unknown emails both fail authentication", async () => {
  assert.equal(
    await authenticateUser("ama@roomify.test", "wrong-password"),
    null
  )
  assert.equal(
    await authenticateUser("unknown-user@roomify.test", "wrong-password"),
    null
  )
})

test("public user creation enforces GUEST even if an ADMIN role is supplied", async () => {
  let user = await findSafeUserByEmail(TEST_EMAIL)
  if (!user) {
    user = await createGuestUser({
      name: "Authentication Test Guest",
      email: TEST_EMAIL,
      passwordHash: await bcrypt.hash("RoomifyTest123!", 12),
      role: "ADMIN",
    } as Parameters<typeof createGuestUser>[0] & { role: "ADMIN" })
  }
  assert.equal(user.role, "GUEST")

  await assert.rejects(
    createGuestUser({
      name: "Duplicate Authentication Test Guest",
      email: TEST_EMAIL,
      passwordHash: await bcrypt.hash("RoomifyTest123!", 12),
    }),
    (error) => isUniqueEmailViolation(error)
  )
})

test("session tokens verify their user id and reject tampering", async () => {
  process.env.SESSION_SECRET =
    "roomify-test-session-secret-at-least-32-characters"
  const userId = "00000000-0000-4000-8000-000000000101"
  const token = await createSessionToken(userId)

  assert.equal(await readSessionToken(token), userId)
  assert.equal(await readSessionToken(`${token.slice(0, -1)}x`), null)
})

test("return URLs allow internal paths and reject external redirects", () => {
  assert.equal(
    safeReturnTo("/reserve?roomId=abc&guests=2"),
    "/reserve?roomId=abc&guests=2"
  )
  assert.equal(safeReturnTo("https://malicious.example"), "/")
  assert.equal(safeReturnTo("//malicious.example/path"), "/")
  assert.equal(safeReturnTo("/\\malicious.example/path"), "/")
})

test("role checks use explicit trusted role allowlists", () => {
  assert.equal(roleAllowed("GUEST", ["GUEST"]), true)
  assert.equal(roleAllowed("GUEST", ["STAFF", "ADMIN"]), false)
  assert.equal(roleAllowed("STAFF", ["ADMIN"]), false)
  assert.equal(roleAllowed("STAFF", ["STAFF", "ADMIN"]), true)
  assert.equal(roleAllowed("ADMIN", ["ADMIN"]), true)
})
