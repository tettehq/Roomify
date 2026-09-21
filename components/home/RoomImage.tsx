"use client"

import Image from "next/image"
import { useState } from "react"

export function RoomImage({
  src,
  fallback,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  src: string | null
  fallback: string
  alt: string
  sizes?: string
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  let image = fallback
  if (src && src !== failedSource) {
    try {
      const url = new URL(src)
      // Match next.config.ts rather than allowing arbitrary remote hosts.
      if (
        url.protocol === "https:" &&
        url.hostname === "images.unsplash.com" &&
        !url.port &&
        !url.username &&
        !url.password
      )
        image = src
    } catch {
      /* Missing or malformed URLs use the existing room photography. */
    }
  }
  return (
    <Image
      key={image}
      src={image}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover transition duration-500 group-hover:scale-105"
      onError={() => {
        if (image !== fallback) setFailedSource(src)
      }}
    />
  )
}
