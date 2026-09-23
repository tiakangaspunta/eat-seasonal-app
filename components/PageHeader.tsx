import { MONTH_NAMES } from '@/lib/months'
import { seasonLabel } from '@/lib/season/availability'
import type { Month } from '@/lib/types'
import { type View, ViewSwitch } from '@/components/ViewSwitch'

/** The month, named and labelled with its season, and the switch between views. */
export function PageHeader({ month, view }: { month: Month; view: View }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-semibold md:text-3xl">
        {MONTH_NAMES[month]}
        <span className="ml-2 font-normal capitalize text-neutral-500">{seasonLabel([month])}</span>
      </h1>
      <ViewSwitch current={view} />
    </header>
  )
}
