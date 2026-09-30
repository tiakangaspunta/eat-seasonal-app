/**
 * Writes a note into a content file: an ingredient's `notes`, or a recipe's
 * `ownNotes`.
 *
 * The notes half of the dev-only write from `docs/PLAN.md` section 6, kept out
 * of the route handler so it can be tested against a temporary directory. Same
 * limits as `rename.ts`: nothing but the one field changes, and `id` and
 * `verified` in particular are never touched.
 *
 * Only the English text is written. `fi` stays whatever it was, and a new note
 * starts with `fi` empty, until the localization step fills it by hand.
 */
import fs from 'node:fs'
import path from 'node:path'

import { DATA_DIR, ID, type RenameKind } from './rename'

export type NoteKind = RenameKind

/** Which directory and which field each kind of content keeps its note in. */
const CONTENT = {
  ingredient: { dir: 'ingredients', field: 'notes' },
  recipe: { dir: 'recipes', field: 'ownNotes' },
} as const satisfies Record<NoteKind, { dir: string; field: string }>

export const isNoteKind = (value: string): value is NoteKind => value in CONTENT

/** A few paragraphs. Anything longer is a recipe write-up, not a note. */
const MAX_LENGTH = 2000

export class NoteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoteError'
  }
}

/**
 * Sets the English note on one ingredient or recipe, and returns it as saved.
 *
 * An empty note removes the note, since clearing one is something Tia means to
 * do (unlike an empty name, which is a slip). A Finnish text, if there is one,
 * is kept rather than lost with it.
 *
 * `root` exists so the tests can point this at a temporary directory.
 */
export function setNote(kind: NoteKind, id: string, value: string, root = DATA_DIR): string {
  const { dir, field } = CONTENT[kind]

  // Checked before the id is ever joined onto a path, as in rename().
  if (!ID.test(id)) throw new NoteError(`"${id}" is not a valid id`)

  // A textarea sends \r\n on some systems. The files hold \n.
  const note = value.replace(/\r\n?/g, '\n').trim()
  if (note.length > MAX_LENGTH) {
    throw new NoteError(`That note is too long: ${note.length} characters, the limit is ${MAX_LENGTH}`)
  }

  const file = path.join(root, dir, `${id}.json`)
  if (!fs.existsSync(file)) throw new NoteError(`There is no ${kind} called "${id}"`)

  const content = JSON.parse(fs.readFileSync(file, 'utf8'))
  const fi: string = content[field]?.fi ?? ''

  if (note === '' && fi === '') delete content[field]
  else content[field] = { en: note, fi }

  fs.writeFileSync(file, JSON.stringify(content, null, 2) + '\n')

  return note
}
