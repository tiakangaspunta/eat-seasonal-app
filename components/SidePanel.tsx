'use client'

import { type ReactNode, useEffect, useRef } from 'react'

/**
 * The side panel both views open things in: a right-hand panel on desktop, a
 * bottom sheet on mobile. Deliberately not modal. The plan wants the grid
 * visible and usable behind it, so there is no backdrop swallowing clicks, and
 * closing is Escape or the close button rather than a click outside.
 *
 * `focusKey` is what the panel is showing. When it changes, focus moves into
 * the panel again, so opening a second item from inside the first lands a
 * keyboard user at its top rather than wherever they last were.
 */
export function SidePanel({
  label,
  focusKey,
  header,
  onClose,
  children,
}: {
  label: string
  focusKey: string
  header: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panel.current?.focus()
  }, [focusKey])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-label={label}
      className="fixed inset-x-0 bottom-0 top-20 z-30 flex flex-col overflow-y-auto rounded-t-2xl border border-neutral-200 bg-white shadow-2xl outline-none md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-md md:rounded-none md:border-y-0"
    >
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-5">
        <div className="min-w-0">{header}</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-neutral-500"
        >
          ×
        </button>
      </div>

      <div className="space-y-6 p-5">{children}</div>
    </div>
  )
}
