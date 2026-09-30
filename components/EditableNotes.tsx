'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { NoteKind } from '@/lib/data/notes'
import { usePressToEdit } from '@/components/usePressToEdit'

/**
 * A note you can edit where it sits: an ingredient's notes, or Tia's own notes
 * on a recipe.
 *
 * The same arrangement as `EditableName`: a click on desktop or a press and
 * hold on touch opens it, the write goes into `data/` through a route that only
 * exists in development, and a production build shows plain text.
 *
 * What differs from a name: a note can have paragraphs, so Enter is a new line
 * and Ctrl+Enter (⌘+Enter) saves, as does clicking away. An empty note is
 * removed rather than reverted, since clearing a note is something Tia means to
 * do. And where there is no note yet, an "Add a note" button stands in for it.
 */
const EDITABLE = process.env.NODE_ENV === 'development'

export function EditableNotes({
  kind,
  id,
  note,
  heading,
}: {
  kind: NoteKind
  id: string
  note?: string
  /** Shown above the note, and only when there is a note or an editor to show. */
  heading?: string
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(note ?? '')
  const [error, setError] = useState<string | null>(null)
  const area = useRef<HTMLTextAreaElement>(null)

  // An edit elsewhere, or a refresh after this one, arrives as a new prop.
  useEffect(() => setValue(note ?? ''), [note])

  useEffect(() => {
    if (!editing || !area.current) return
    // Caret at the end, where an addition to a note usually goes.
    const end = area.current.value.length
    area.current.focus()
    area.current.setSelectionRange(end, end)
  }, [editing])

  const start = () => {
    setError(null)
    setValue(note ?? '')
    setEditing(true)
  }
  const press = usePressToEdit(start)

  if (!EDITABLE && !note) return null

  // A span, not a p, since it also sits inside the button below.
  const text = <span className="block whitespace-pre-line text-sm text-neutral-700">{note}</span>

  const wrap = (body: React.ReactNode) => (
    <section>
      {heading && <h3 className="mb-1 text-sm font-semibold text-neutral-900">{heading}</h3>}
      {body}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </section>
  )

  if (!EDITABLE) return wrap(text)

  const cancel = () => {
    setValue(note ?? '')
    setEditing(false)
  }

  const save = async () => {
    setEditing(false)
    const next = value.replace(/\r\n?/g, '\n').trim()
    if (next === (note ?? '')) return

    const response = await fetch(`/api/notes/${kind}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: next }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(body.error ?? 'Could not save that note')
      setValue(note ?? '')
      return
    }

    setError(null)
    router.refresh()
  }

  if (editing) {
    return wrap(
      <>
        <textarea
          ref={area}
          value={value}
          aria-label={note ? 'Edit note' : 'New note'}
          onChange={(event) => setValue(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
              event.preventDefault()
              save()
            }
            if (event.key === 'Escape') cancel()
          }}
          // Grows with the note rather than scrolling inside a small box.
          rows={Math.max(3, value.split('\n').length + 1)}
          className="block w-full rounded border border-neutral-400 px-2 py-1.5 text-sm text-neutral-700"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Saves when you click away, or with Ctrl+Enter. Esc cancels. An empty note is removed.
        </p>
      </>,
    )
  }

  if (!note) {
    return (
      <>
        <button
          type="button"
          onClick={start}
          className="-mx-1 flex min-h-11 items-center rounded px-1 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        >
          + Add a note
        </button>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </>
    )
  }

  return wrap(
    <button
      type="button"
      {...press}
      title="Click to edit, or press and hold on a touch screen"
      className="-mx-1 block min-h-11 w-full rounded px-1 py-1 text-left hover:bg-neutral-100"
    >
      {text}
    </button>,
  )
}
