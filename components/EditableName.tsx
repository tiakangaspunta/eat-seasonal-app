'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RenameKind } from '@/lib/data/rename'

/**
 * A name you can edit where it sits.
 *
 * `docs/PLAN.md` section 6: no edit mode and no form, because without renaming
 * the app is unusable for produce Tia knows only by its Finnish name. The write
 * goes into the JSON file in `data/` through a route that only exists in
 * development, so in a production build this renders as plain text and offers
 * nothing to click.
 *
 * Desktop is a click, mobile is a press and hold, per the issue: a tap has to
 * stay free for opening things, and on a recipe title it will mean exactly that
 * once step 2 lands.
 */
const EDITABLE = process.env.NODE_ENV === 'development'

/** Long enough not to fire while scrolling, short enough not to feel stuck. */
const HOLD_MS = 500

export function EditableName({
  kind,
  id,
  name,
  className = '',
}: {
  kind: RenameKind
  id: string
  name: string
  className?: string
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const [error, setError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)

  // A press and hold that has already fired, so the click it is followed by
  // does not re-open the editor.
  const fromTouch = useRef(false)
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null)

  // A rename elsewhere, or a refresh after this one, arrives as a new prop.
  useEffect(() => setValue(name), [name])

  useEffect(() => {
    if (editing) input.current?.select()
  }, [editing])

  if (!EDITABLE) return <span className={className}>{name}</span>

  const start = () => {
    setError(null)
    setValue(name)
    setEditing(true)
  }

  const cancelHold = () => {
    if (hold.current) clearTimeout(hold.current)
    hold.current = null
  }

  const save = async () => {
    setEditing(false)
    const next = value.trim()
    // Empty reverts rather than saving: a blank name is a slip, not an intent.
    if (next === '' || next === name) {
      setValue(name)
      return
    }

    const response = await fetch(`/api/rename/${kind}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: next }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(body.error ?? 'Could not save that name')
      setValue(name)
      return
    }

    setError(null)
    // The name is on the cards behind the panel too, so re-render from the
    // server rather than patching this one copy of it.
    router.refresh()
  }

  if (editing) {
    return (
      <input
        ref={input}
        value={value}
        aria-label={`Rename ${name}`}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
          if (event.key === 'Escape') {
            setValue(name)
            setEditing(false)
          }
        }}
        // Never narrower than the text it holds, and never wider than its column.
        style={{ width: `${Math.max(value.length, 8) + 2}ch` }}
        className={`min-h-11 max-w-full rounded border border-neutral-400 px-2 ${className}`}
      />
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (fromTouch.current) {
            fromTouch.current = false
            return
          }
          start()
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse') return
          fromTouch.current = true
          hold.current = setTimeout(start, HOLD_MS)
        }}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        // Otherwise a long press raises the browser's own text selection menu
        // over the field it has just opened.
        onContextMenu={(event) => event.preventDefault()}
        title="Click to rename, or press and hold on a touch screen"
        className={`-mx-1 flex min-h-11 items-center rounded px-1 text-left hover:bg-neutral-100 ${className}`}
      >
        {name}
      </button>
      {error && <span className="block text-sm font-normal text-red-700">{error}</span>}
    </>
  )
}
