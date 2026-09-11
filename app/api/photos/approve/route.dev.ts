/**
 * Records a photo approval, in development only.
 *
 * Same arrangement as `app/api/rename/[kind]/[id]/route.dev.ts`: the file is
 * named `route.dev.ts` and `next.config.ts` only counts `dev.ts` as a route
 * extension while developing, so a production build does not contain this route
 * at all. The NODE_ENV check is the second lock.
 *
 * This writes a decision, never an image. Downloading is a separate, deliberate
 * step run from the terminal, so nothing lands in `public/` as a side effect of
 * clicking around the contact sheet.
 */
import { NextResponse } from 'next/server'

import { PhotoApprovalError, approve } from '@/lib/data/photos'

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body' }, { status: 400 })
  }

  const { id, decision } = (body ?? {}) as { id?: unknown; decision?: unknown }
  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'Expected { id: string, decision }' }, { status: 400 })
  }

  try {
    const approvals = approve(id, decision === undefined ? null : decision)
    return NextResponse.json({ decisions: approvals.decisions })
  } catch (error) {
    if (error instanceof PhotoApprovalError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
