/**
 * The write behind note editing, the one part of it that can be quietly wrong.
 *
 * Same arrangement as rename.test.ts: everything runs against a temporary
 * directory rather than data/. The React side is checked by eye, per the tdd
 * skill.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { setNote } from './notes'

let root: string

const ingredient = {
  id: 'carrot',
  name: 'Carrot',
  category: 'vegetable',
  availability: { domestic: { freshMonths: [9], storageMonths: [], peakMonths: [9] } },
  verified: true,
  similarTo: [],
  unverifiedMonths: [9],
}

const recipe = {
  id: 'carrot-pancakes',
  title: 'Carrot pancakes',
  source: { name: 'satokausi.fi', url: 'https://satokausi.fi/porkkanaletut/' },
  ingredients: [{ ingredientId: 'carrot' }],
  mealType: ['breakfast'],
  tags: [],
  effort: 'easy',
}

const write = (dir: string, id: string, content: object) =>
  fs.writeFileSync(path.join(root, dir, `${id}.json`), JSON.stringify(content, null, 2) + '\n')

const read = (dir: string, id: string) =>
  JSON.parse(fs.readFileSync(path.join(root, dir, `${id}.json`), 'utf8'))

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'))
  fs.mkdirSync(path.join(root, 'ingredients'))
  fs.mkdirSync(path.join(root, 'recipes'))
  write('ingredients', 'carrot', ingredient)
  write('recipes', 'carrot-pancakes', recipe)
})

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('setNote', () => {
  it('adds a note to an ingredient that had none, with fi left empty', () => {
    expect(setNote('ingredient', 'carrot', 'Sweetest after the first frost.', root)).toBe(
      'Sweetest after the first frost.',
    )
    expect(read('ingredients', 'carrot').notes).toEqual({
      en: 'Sweetest after the first frost.',
      fi: '',
    })
  })

  it('writes a recipe note into ownNotes, the field for Tia’s own notes', () => {
    setNote('recipe', 'carrot-pancakes', 'Double the batch, they freeze well.', root)
    expect(read('recipes', 'carrot-pancakes').ownNotes).toEqual({
      en: 'Double the batch, they freeze well.',
      fi: '',
    })
  })

  it('replaces the English text and keeps a Finnish text already there', () => {
    write('ingredients', 'carrot', { ...ingredient, notes: { en: 'Old', fi: 'Vanha' } })
    setNote('ingredient', 'carrot', 'New', root)
    expect(read('ingredients', 'carrot').notes).toEqual({ en: 'New', fi: 'Vanha' })
  })

  it('removes the note when it is emptied', () => {
    write('ingredients', 'carrot', { ...ingredient, notes: { en: 'Old', fi: '' } })
    expect(setNote('ingredient', 'carrot', '   ', root)).toBe('')
    expect(read('ingredients', 'carrot')).toEqual(ingredient)
  })

  it('keeps a Finnish text when the English one is emptied, rather than losing it', () => {
    write('ingredients', 'carrot', { ...ingredient, notes: { en: 'Old', fi: 'Vanha' } })
    setNote('ingredient', 'carrot', '', root)
    expect(read('ingredients', 'carrot').notes).toEqual({ en: '', fi: 'Vanha' })
  })

  it('does nothing to a file with no note when an empty one is saved', () => {
    setNote('recipe', 'carrot-pancakes', '', root)
    expect(read('recipes', 'carrot-pancakes')).toEqual(recipe)
  })

  it('keeps line breaks inside a note, and stores them as \\n whatever the browser sent', () => {
    setNote('ingredient', 'carrot', 'First line\r\n\r\nSecond paragraph', root)
    expect(read('ingredients', 'carrot').notes.en).toBe('First line\n\nSecond paragraph')
  })

  it('trims surrounding whitespace rather than saving it', () => {
    expect(setNote('ingredient', 'carrot', '\n  Sweet  \n', root)).toBe('Sweet')
  })

  it('leaves id, verified and every other field byte for byte', () => {
    setNote('ingredient', 'carrot', 'Sweet', root)
    expect(read('ingredients', 'carrot')).toEqual({ ...ingredient, notes: { en: 'Sweet', fi: '' } })
  })

  it('refuses a note longer than a note is meant to be', () => {
    expect(() => setNote('ingredient', 'carrot', 'x'.repeat(2001), root)).toThrow(/too long/i)
    expect(read('ingredients', 'carrot').notes).toBeUndefined()
  })

  it('refuses an id that is not a slug, so a path can never escape the directory', () => {
    expect(() => setNote('ingredient', '../../package', 'Nope', root)).toThrow(/not a valid id/i)
  })

  it('refuses an id with no file, rather than creating one', () => {
    expect(() => setNote('recipe', 'unicorn', 'Nope', root)).toThrow(/no recipe/i)
    expect(fs.existsSync(path.join(root, 'recipes', 'unicorn.json'))).toBe(false)
  })

  it('keeps the file readable by the loader: two-space JSON, trailing newline', () => {
    setNote('ingredient', 'carrot', 'Sweet', root)
    const raw = fs.readFileSync(path.join(root, 'ingredients', 'carrot.json'), 'utf8')
    expect(raw.endsWith('}\n')).toBe(true)
    expect(raw).toContain('\n  "notes": {\n    "en": "Sweet"')
  })
})
