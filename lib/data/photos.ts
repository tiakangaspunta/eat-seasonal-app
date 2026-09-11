/**
 * Records which candidate photo Tia approved for an ingredient.
 *
 * `docs/PLAN.md` section 6: images are approved before they enter the project.
 * This is where that approval is kept between the contact sheet at `/photos`
 * saying it and `scripts/download-approved.mjs` acting on it. Nothing here
 * downloads an image or edits an ingredient; it only writes down a decision.
 *
 * An approval stores the whole candidate, not an index into the candidate list.
 * `scripts/photo-candidates.mjs` can be re-run at any time, and a stored index
 * would then silently point at a different photo. A stored candidate still means
 * what it meant when it was approved.
 *
 * `root` exists throughout so the tests run against a temporary directory
 * instead of the real `scripts/` directory, exactly as `lib/data/rename.ts` does.
 */
import fs from 'node:fs'
import path from 'node:path'

export type PhotoCandidate = {
  source: string
  title: string
  thumbUrl: string
  fullUrl: string
  author: string
  license: string
  sourceUrl: string
}

/**
 * One ingredient's row on the contact sheet.
 *
 * `partial` means only one of the two Commons searches came back. It matters
 * on the sheet rather than only in a log, because a half-blind row looks
 * exactly like a full one: avocado's trial row was four normal-looking tiles
 * that were all photographs of lunch, because the plain "avocado" search had
 * been rate-limited away and only "avocado vegetable" survived.
 */
export type SheetRow = {
  id: string
  name: string
  term: string
  candidates: PhotoCandidate[]
  notes: string[]
  /** Absent on rows written before the flag existed. */
  partial?: boolean
  searched?: number
  of?: number
}

/** A candidate Tia chose, or `null` meaning "none of these, ask again later". */
export type PhotoDecision = PhotoCandidate | null

export type PhotoApprovals = {
  updatedAt: string
  /** Keyed by ingredient id. An id absent from this map has not been reviewed. */
  decisions: Record<string, PhotoDecision>
}

export const SCRIPTS_DIR = path.join(process.cwd(), 'scripts')

const APPROVALS_FILE = 'photo-approvals.json'
const CANDIDATES_FILE = 'photo-candidates.json'

/** The ids we generate: lowercase slugs, as in `lib/data/rename.ts`. */
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

export class PhotoApprovalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PhotoApprovalError'
  }
}

export function readApprovals(root = SCRIPTS_DIR): PhotoApprovals {
  const file = path.join(root, APPROVALS_FILE)
  if (!fs.existsSync(file)) return { updatedAt: '', decisions: {} }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as PhotoApprovals
}

/** The sheet's own input. Returns an empty sheet rather than throwing. */
export function readCandidates(root = SCRIPTS_DIR): {
  generatedAt: string
  month: number | null
  ingredients: SheetRow[]
} {
  const file = path.join(root, CANDIDATES_FILE)
  if (!fs.existsSync(file)) return { generatedAt: '', month: null, ingredients: [] }
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

/** Every field the attribution list will need, present and non-empty. */
function isCandidate(value: unknown): value is PhotoCandidate {
  if (typeof value !== 'object' || value === null) return false
  const fields = ['source', 'title', 'thumbUrl', 'fullUrl', 'author', 'license', 'sourceUrl'] as const
  return fields.every((field) => typeof (value as Record<string, unknown>)[field] === 'string')
}

/**
 * Records one decision and returns the approvals as saved.
 *
 * Approving replaces whatever was approved before, so changing her mind on the
 * sheet is just approving again.
 */
export function approve(id: string, decision: unknown, root = SCRIPTS_DIR): PhotoApprovals {
  if (!ID.test(id)) throw new PhotoApprovalError(`"${id}" is not a valid id`)
  if (decision !== null && !isCandidate(decision)) {
    throw new PhotoApprovalError('Expected a candidate, or null for "none of these"')
  }

  // Only http(s) is ever downloaded later. A `file:` or `data:` url reaching
  // the download step would be a way to pull something unintended into the
  // project, so it is refused at the point the decision is written.
  if (decision !== null) {
    for (const url of [decision.fullUrl, decision.thumbUrl, decision.sourceUrl]) {
      if (!/^https:\/\//.test(url)) throw new PhotoApprovalError(`"${url}" is not an https url`)
    }
  }

  const approvals = readApprovals(root)
  approvals.decisions[id] = decision
  approvals.updatedAt = new Date().toISOString()

  fs.mkdirSync(root, { recursive: true })
  fs.writeFileSync(path.join(root, APPROVALS_FILE), JSON.stringify(approvals, null, 2) + '\n')

  return approvals
}
