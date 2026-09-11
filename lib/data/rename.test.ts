/**
 * The one part of inline editing that can be quietly wrong: the write.
 *
 * Everything here runs against a temporary directory rather than data/, so a
 * bug in the writer is found without touching the real content. The React side
 * of issue 009 is checked by eye, per the tdd skill.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { rename } from './rename'

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

const read = (kind: string, id: string) =>
  JSON.parse(fs.readFileSync(path.join(root, kind, `${id}.json`), 'utf8'))

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'rename-'))
  fs.mkdirSync(path.join(root, 'ingredients'))
  fs.mkdirSync(path.join(root, 'recipes'))
  fs.writeFileSync(
    path.join(root, 'ingredients', 'carrot.json'),
    JSON.stringify(ingredient, null, 2) + '\n',
  )
  fs.writeFileSync(
    path.join(root, 'recipes', 'carrot-pancakes.json'),
    JSON.stringify(recipe, null, 2) + '\n',
  )
})

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('rename', () => {
  it('writes a new ingredient name into the file', () => {
    expect(rename('ingredient', 'carrot', 'Porkkana', root)).toBe('Porkkana')
    expect(read('ingredients', 'carrot').name).toBe('Porkkana')
  })

  it('writes a new recipe title into the file', () => {
    expect(rename('recipe', 'carrot-pancakes', 'Porkkanaletut', root)).toBe('Porkkanaletut')
    expect(read('recipes', 'carrot-pancakes').title).toBe('Porkkanaletut')
  })

  it('never changes the id, which recipes and cooking history point at', () => {
    rename('ingredient', 'carrot', 'Porkkana', root)
    expect(read('ingredients', 'carrot').id).toBe('carrot')
  })

  it('leaves verified and the drafted months alone: a name is not a season', () => {
    rename('ingredient', 'carrot', 'Porkkana', root)
    const saved = read('ingredients', 'carrot')
    expect(saved.verified).toBe(true)
    expect(saved.unverifiedMonths).toEqual([9])
  })

  it('leaves every other field byte for byte', () => {
    rename('ingredient', 'carrot', 'Porkkana', root)
    expect(read('ingredients', 'carrot')).toEqual({ ...ingredient, name: 'Porkkana' })
  })

  it('trims surrounding whitespace rather than saving it', () => {
    expect(rename('ingredient', 'carrot', '  Porkkana  ', root)).toBe('Porkkana')
  })

  it('refuses an empty name', () => {
    expect(() => rename('ingredient', 'carrot', '   ', root)).toThrow(/empty/i)
    expect(read('ingredients', 'carrot').name).toBe('Carrot')
  })

  it('refuses a name longer than the field is meant to hold', () => {
    expect(() => rename('ingredient', 'carrot', 'x'.repeat(81), root)).toThrow(/too long/i)
  })

  it('refuses an id that is not a slug, so a path can never escape the directory', () => {
    expect(() => rename('ingredient', '../../package', 'Nope', root)).toThrow(/not a valid id/i)
    expect(() => rename('ingredient', 'Carrot', 'Nope', root)).toThrow(/not a valid id/i)
  })

  it('refuses an id with no file, rather than creating one', () => {
    expect(() => rename('ingredient', 'unicorn', 'Nope', root)).toThrow(/no ingredient/i)
    expect(fs.existsSync(path.join(root, 'ingredients', 'unicorn.json'))).toBe(false)
  })

  it('keeps the file readable by the loader: two-space JSON, trailing newline', () => {
    rename('ingredient', 'carrot', 'Porkkana', root)
    const raw = fs.readFileSync(path.join(root, 'ingredients', 'carrot.json'), 'utf8')
    expect(raw.endsWith('}\n')).toBe(true)
    expect(raw).toContain('\n  "name": "Porkkana"')
  })
})
