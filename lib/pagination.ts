/**
 * Returns an array of page numbers (and "ellipsis" placeholders) to render
 * in a pagination control. Always includes the first and last page; inserts
 * "ellipsis" tokens when the window around `current` does not abut them.
 *
 * Edge cases covered by unit tests:
 *   - total ≤ 7  → all pages listed, no ellipsis
 *   - current = 1 or current = total → single ellipsis on the far side
 *   - current = 3 or current = total - 2 → window abuts first/last, no ellipsis
 */
export function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]

  if (current > 3) pages.push("ellipsis")

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }

  if (current < total - 2) pages.push("ellipsis")

  pages.push(total)
  return pages
}
