import { MONTH_NAMES } from '@/lib/months'
import { seasonLabel } from '@/lib/season/availability'
import type { Month } from '@/lib/types'
import { monthsHeading } from '@/components/monthText'
import { MonthRow } from '@/components/MonthRow'
import { type View, ViewSwitch } from '@/components/ViewSwitch'

/**
 * The chosen months, named, the switch between views, and the row of months
 * that chooses them. `monthsQuery` is what the switch carries to the other
 * view, empty when the address names no months.
 */
export function PageHeader({
  months,
  today,
  view,
  monthsQuery,
}: {
  months: Month[]
  today: Month
  view: View
  monthsQuery: string
}) {
  const heading = monthsHeading(months)

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">
          {months.length === 1 ? (
            <>
              {MONTH_NAMES[months[0]]}
              <span className="ml-2 font-normal capitalize text-neutral-500">
                {seasonLabel(months)}
              </span>
            </>
          ) : (
            <span className={heading.capitalize ? 'capitalize' : undefined}>{heading.title}</span>
          )}
        </h1>
        <ViewSwitch current={view} monthsQuery={monthsQuery} />
      </div>
      <MonthRow months={months} today={today} />
    </header>
  )
}
