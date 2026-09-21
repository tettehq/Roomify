export function multiplyMoney(amount: string, quantity: number) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(amount)
  if (!match || !Number.isSafeInteger(quantity) || quantity < 0) return "—"
  const hundred = BigInt(100)
  const cents =
    BigInt(match[1]) * hundred + BigInt((match[2] ?? "").padEnd(2, "0"))
  const total = cents * BigInt(quantity)
  const dollars = total / hundred
  const remainder = String(total % hundred).padStart(2, "0")
  return `${dollars}.${remainder}`
}

export function displayMoney(amount: string) {
  return amount.replace(/\.00$/, "")
}
