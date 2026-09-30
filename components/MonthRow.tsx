'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { MONTHS, MONTH_NAMES, monthShort } from '@/lib/months'
import { CALENDAR_SEASONS, type SeasonName } from '@/lib/season/availability'
import { formatMonths, seasonMonths, selectionSeason, toggleMonth } from '@/lib/season/selection'
import { UI, text } from '@/lib/strings'
import type { Month } from '@/lib/types'

/**
 * The row of months, on both views. Tapping a month adds it to the choice or
 * takes it out again (Tia, 2026-09-30); a season button replaces the choice
 * with its three months.
 *
 * The choice is `?months=` in the address, and changing it is a real
 * navigation rather than the `pushState` the panel uses: what is in season is
 * worked out on the server, so the page has to render again. Whatever else the
 * address holds, such as an open panel, is kept.
 */
export function MonthRow({ months, today }: { months: Month[]; today: Month }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const strip = useRef<HTMLUListElement>(null)

  const choose = (next: Month[]) => {
    const query = new URLSearchParams(params.toString())
    query.set('months', formatMonths(next))
    router.push(`${pathname}?${query.toString()}`, { scroll: false })
  }

  // On mobile the months scroll sideways. Bring the first chosen one into
  // view by moving the row itself, never the page.
  const first = months[0]
  useEffect(() => {
    const row = strip.current
    const item = row?.querySelector<HTMLElement>(`[data-month="${first}"]`)
    if (!row || !item) return
    row.scrollLeft = item.offsetLeft - row.offsetLeft - (row.clientWidth - item.offsetWidth) / 2
  }, [first])

  const season = selectionSeason(months)

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
      <div role="group" aria-label={text(UI.monthRow.seasons)} className="flex gap-2">
        {CALENDAR_SEASONS.map(({ name }) => (
          <SeasonButton
            key={name}
            name={name}
            pressed={season === name}
            onPress={() => choose(seasonMonths(name))}
          />
        ))}
      </div>

      <ul
        ref={strip}
        role="group"
        aria-label={text(UI.monthRow.label)}
        className="-mx-6 flex gap-1 overflow-x-auto px-6 md:mx-0 md:px-0 lg:flex-1"
      >
        {MONTHS.map((month) => {
          const chosen = months.includes(month)
          const isToday = month === today
          return (
            <li key={month} data-month={month} className="shrink-0 md:flex-1">
              <button
                type="button"
                aria-pressed={chosen}
                aria-label={isToday ? `${MONTH_NAMES[month]}, ${text(UI.monthRow.thisMonth)}` : MONTH_NAMES[month]}
                onClick={() => choose(toggleMonth(months, month))}
                className={`flex min-h-11 w-full min-w-11 flex-col items-center justify-center rounded-lg border px-2 text-sm font-medium ${
                  chosen
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-700'
                }`}
              >
                <span aria-hidden>{monthShort(month)}</span>
                {/* Today is marked wherever you are, so it can be found again
                    after wandering off to another season. */}
                <span
                  aria-hidden
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    isToday ? (chosen ? 'bg-white' : 'bg-neutral-900') : 'bg-transparent'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SeasonButton({
  name,
  pressed,
  onPress,
}: {
  name: SeasonName
  pressed: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onPress}
      className={`min-h-11 flex-1 rounded-full border px-4 text-sm font-medium capitalize lg:flex-none ${
        pressed ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-700'
      }`}
    >
      {name}
    </button>
  )
}
