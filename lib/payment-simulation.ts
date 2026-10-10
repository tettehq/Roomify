export const DEMO_CARD_SUCCESS = "4242424242424242"
export const DEMO_CARD_DECLINED = "4000000000000002"

export type PaymentField = "cardholder" | "cardNumber" | "expiry" | "cvc"
export type PaymentErrors = Partial<Record<PaymentField, string>>

type PaymentResult =
  | { success: true }
  | {
      success: false
      code: "PAYMENT_INVALID" | "PAYMENT_DECLINED"
      message: string
      errors?: PaymentErrors
    }

// Only the published demo cards are accepted. Never persist or log these fields.
export function simulateCardPayment(
  formData: FormData,
  now = new Date()
): PaymentResult {
  const read = (field: PaymentField) => {
    const value = formData.get(field)
    return typeof value === "string" ? value.trim() : ""
  }
  const errors: PaymentErrors = {}
  const cardholder = read("cardholder")
  const cardNumber = read("cardNumber").replace(/[ -]/g, "")
  const expiry = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(read("expiry"))

  if (!cardholder || cardholder.length > 100) {
    errors.cardholder = "Enter a demo cardholder name (up to 100 characters)."
  }
  if (cardNumber !== DEMO_CARD_SUCCESS && cardNumber !== DEMO_CARD_DECLINED) {
    errors.cardNumber =
      "Use one of the demo card numbers below. Real cards are not accepted."
  }
  if (!expiry) {
    errors.expiry = "Enter an expiry date in MM/YY format."
  } else {
    const month = Number(expiry[1])
    const year = 2000 + Number(expiry[2])
    if (
      year < now.getUTCFullYear() ||
      (year === now.getUTCFullYear() && month < now.getUTCMonth() + 1)
    ) {
      errors.expiry = "Use the current month or a future expiry date."
    }
  }
  if (!/^\d{3}$/.test(read("cvc"))) {
    errors.cvc = "Enter any three digits for the demo security code."
  }
  if (Object.keys(errors).length) {
    return {
      success: false,
      code: "PAYMENT_INVALID",
      message: "Check your demo payment details.",
      errors,
    }
  }
  if (cardNumber === DEMO_CARD_DECLINED) {
    return {
      success: false,
      code: "PAYMENT_DECLINED",
      message:
        "Demo payment declined. No reservation was created. Try the successful demo card to continue.",
    }
  }
  return { success: true }
}
