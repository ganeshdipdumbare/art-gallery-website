"use client"

import Image from "next/image"

/**
 * Renders a painting image that can be either a URL path (e.g. /images/foo.jpg)
 * or a base64 data URL (from DB blob storage).
 * Next.js Image doesn't support data URLs, so we use img for those.
 */
export function PaintingImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const isDataUrl = src.startsWith("data:")

  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${fill ? "absolute inset-0 w-full h-full object-cover" : ""} ${className ?? ""}`.trim()}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
