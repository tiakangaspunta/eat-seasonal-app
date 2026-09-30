/**
 * Sets the note on an ingredient or a recipe, in development only.
 *
 * Same arrangement as `app/api/rename/[kind]/[id]/route.dev.ts`: the `dev.ts`
 * extension keeps this file out of a production build altogether, and the
 * NODE_ENV check is the second lock.
 */
import { NextResponse } from 'next/server'

import { NoteError, isNoteKind, setNote } from '@/lib/data/notes'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 })
  }

  const { kind, id } = await params
  if (!isNoteKind(kind)) {
    return NextResponse.json({ error: `Cannot set a note on a "${kind}"` }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body' }, { status: 400 })
  }

  const value = (body as { note?: unknown })?.note
  if (typeof value !== 'string') {
    return NextResponse.json({ error: 'Expected { note: string }' }, { status: 400 })
  }

  try {
    return NextResponse.json({ note: setNote(kind, id, value) })
  } catch (error) {
    if (error instanceof NoteError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
