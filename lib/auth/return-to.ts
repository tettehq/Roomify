const INTERNAL_ORIGIN = "https://roomify.internal"

export function safeReturnTo(value: unknown, fallback = "/") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return fallback
  }

  try {
    const url = new URL(value, INTERNAL_ORIGIN)
    if (url.origin !== INTERNAL_ORIGIN) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

export function loginUrl(returnTo: string) {
  const query = new URLSearchParams({ returnTo: safeReturnTo(returnTo) })
  return `/login?${query}`
}
