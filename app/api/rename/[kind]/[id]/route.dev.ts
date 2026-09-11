/**
 * Renames an ingredient or a recipe, in development only.
 *
 * `docs/PLAN.md` section 6 wants this route absent from a production build
 * rather than merely refusing there, so the file is named `route.dev.ts` and
 * `next.config.ts` only counts `dev.ts` as a route extension when
 * `NODE_ENV === 'development'`. In a production build this file is not a route
 * at all, and `/api/rename/...` is a 404 like any other path that was never
 * defined.
 *
 * The NODE_ENV check below is the second lock. If the config is ever changed
 * so this file does get built, it still refuses to write.
 */
import { NextResponse } from 'next/server'

import { RenameError, isRenameKind, rename } from '@/lib/data/rename'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 })
  }

  const { kind, id } = await params
  if (!isRenameKind(kind)) {
    return NextResponse.json({ error: `Cannot rename a "${kind}"` }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body' }, { status: 400 })
  }

  const value = (body as { name?: unknown })?.name
  if (typeof value !== 'string') {
    return NextResponse.json({ error: 'Expected { name: string }' }, { status: 400 })
  }

  try {
    return NextResponse.json({ name: rename(kind, id, value) })
  } catch (error) {
    if (error instanceof RenameError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
