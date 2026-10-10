import assert from "node:assert/strict"
import test from "node:test"
import { DEMO_CARD_DECLINED, simulateCardPayment } from "./payment-simulation"

const now = new Date("2026-10-10T12:00:00Z")
function payment(overrides: Record<string, string> = {}) {
  const form = new FormData()
  for (const [key, value] of Object.entries({
    cardholder: "Demo Guest",
    cardNumber: "4242 4242 4242 4242",
    expiry: "10/26",
    cvc: "123",
    ...overrides,
  })) {
    form.set(key, value)
  }
  return simulateCardPayment(form, now)
}

test("demo success accepts spaced numbers and expiry through the end of the current month", () => {
  assert.deepEqual(payment(), { success: true })
  assert.deepEqual(
    payment({ cardNumber: "4242-4242-4242-4242", expiry: "01/27" }),
    { success: true }
  )
})

test("declined demo card gives a retryable failure", () => {
  const result = payment({ cardNumber: DEMO_CARD_DECLINED })
  assert.equal(result.success, false)
  if (!result.success) assert.equal(result.code, "PAYMENT_DECLINED")
})

test("missing, non-demo, expired, and malformed details are rejected", () => {
  for (const [field, value] of [
    ["cardholder", "   "],
    ["cardholder", "a".repeat(101)],
    ["cardNumber", "4111111111111111"],
    ["cardNumber", ""],
    ["expiry", "09/26"],
    ["expiry", "12/25"],
    ["expiry", "13/27"],
    ["expiry", "00/27"],
    ["expiry", "10/2027"],
    ["cvc", "12"],
    ["cvc", "abc"],
    ["cvc", "1234"],
  ]) {
    const result = payment({ [field]: value })
    assert.equal(result.success, false, `${field}: ${value}`)
    if (!result.success) {
      assert.equal(result.code, "PAYMENT_INVALID")
      assert.ok(result.errors?.[field as keyof typeof result.errors])
    }
  }
})

test("omitted payment and file values cannot bypass validation", () => {
  const form = new FormData()
  form.set("cardNumber", new Blob(["4242424242424242"]))
  form.set("paymentStatus", "PAID")
  const result = simulateCardPayment(form, now)
  assert.equal(result.success, false)
  if (!result.success) assert.equal(Object.keys(result.errors ?? {}).length, 4)
})

test("results never return card data or security codes", () => {
  for (const result of [
    payment(),
    payment({ cardNumber: DEMO_CARD_DECLINED }),
    payment({ cvc: "bad-secret" }),
  ]) {
    const serialized = JSON.stringify(result)
    assert.ok(!serialized.includes("4242"))
    assert.ok(!serialized.includes(DEMO_CARD_DECLINED))
    assert.ok(!serialized.includes("bad-secret"))
  }
})
