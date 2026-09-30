'use client'

import { useSearchParams } from 'next/navigation'

/**
 * The chosen months as they stand in the address, for a link to carry to the
 * other view, so following a panel link keeps the choice. Empty when the
 * address names no months, since the other view then opens on today anyway.
 */
export function useMonthsQuery(): string {
  // Digits and commas only: the value is read leniently on arrival anyway,
  // and this keeps it from carrying anything else into a link.
  const months = (useSearchParams().get('months') ?? '').replace(/[^0-9,]/g, '')
  return months ? `months=${months}` : ''
}
