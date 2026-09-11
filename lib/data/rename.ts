/**
 * Writes a new display name into a content file.
 *
 * This is the whole of the dev-only write from `docs/PLAN.md` section 6, kept
 * out of the route handler so it can be tested against a temporary directory
 * instead of against `data/`.
 *
 * What it deliberately does not do: touch `id`, touch `verified`, or reorder
 * or reformat anything else. A rename is a change to what something is called
 * and to nothing else. `id` in particular is what recipes and cooking history
 * point at, so it survives every rename.
 */
import fs from 'node:fs'
import path from 'node:path'

export type RenameKind = 'ingredient' | 'recipe'

/** Which directory and which field each kind of content keeps its name in. */
const CONTENT = {
  ingredient: { dir: 'ingredients', field: 'name' },
  recipe: { dir: 'recipes', field: 'title' },
} as const satisfies Record<RenameKind, { dir: string; field: string }>

export const isRenameKind = (value: string): value is RenameKind => value in CONTENT

/** The ids we generate: lowercase slugs. Anything else cannot address a file. */
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Long enough for "Kelta- ja kaurajuuri", short enough to stay a name. */
const MAX_LENGTH = 80

export const DATA_DIR = path.join(process.cwd(), 'data')

export class RenameError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RenameError'
  }
}

/**
 * Renames one ingredient or recipe, and returns the name as saved.
 *
 * `root` exists so the tests can point this at a temporary directory.
 */
export function rename(kind: RenameKind, id: string, value: string, root = DATA_DIR): string {
  const { dir, field } = CONTENT[kind]

  // Checked before the id is ever joined onto a path, so "../../package" is
  // refused as a bad id rather than resolved into a file outside data/.
  if (!ID.test(id)) throw new RenameError(`"${id}" is not a valid id`)

  const name = value.trim()
  if (name === '') throw new RenameError('A name cannot be empty')
  if (name.length > MAX_LENGTH) {
    throw new RenameError(`That name is too long: ${name.length} characters, the limit is ${MAX_LENGTH}`)
  }

  const file = path.join(root, dir, `${id}.json`)
  if (!fs.existsSync(file)) throw new RenameError(`There is no ${kind} called "${id}"`)

  const content = JSON.parse(fs.readFileSync(file, 'utf8'))
  content[field] = name
  fs.writeFileSync(file, JSON.stringify(content, null, 2) + '\n')

  return name
}
