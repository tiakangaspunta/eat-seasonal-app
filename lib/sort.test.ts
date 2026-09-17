/**
 * Display order is worth testing even though it is not season logic: it is the
 * one place where the Finnish alphabet differs from the one JavaScript sorts
 * with by default, and getting it wrong looks like a bug in the data rather
 * than in the sort.
 */
import { describe, expect, it } from 'vitest'

import { compareNames, sortByName } from './sort'

const sorted = (names: string[]) => [...names].sort(compareNames)

describe('compareNames', () => {
  it('orders plain names alphabetically', () => {
    expect(sorted(['Cucumber', 'Apple', 'Beetroot'])).toEqual(['Apple', 'Beetroot', 'Cucumber'])
  })

  it('puts ä, ö and å after z, as the Finnish alphabet does', () => {
    expect(sorted(['Öljykasvi', 'Ananas', 'Ätti', 'Zucchini', 'Åkerböna'])).toEqual([
      'Ananas',
      'Zucchini',
      'Åkerböna',
      'Ätti',
      'Öljykasvi',
    ])
  })

  it('does not sort capitals before lowercase, the way a plain sort does', () => {
    expect(sorted(['banana', 'Apple'])).toEqual(['Apple', 'banana'])
    // What the default would have given, kept here so the difference is visible.
    expect(['banana', 'Apple'].sort()).toEqual(['Apple', 'banana'])
    expect(['Banana', 'apple'].sort()).toEqual(['Banana', 'apple'])
    expect(sorted(['Banana', 'apple'])).toEqual(['apple', 'Banana'])
  })

  it('mixes English and Finnish names in one order', () => {
    expect(sorted(['Kesäkurpitsa', 'Cucumber', 'Äyriäinen', 'Beetroot'])).toEqual([
      'Beetroot',
      'Cucumber',
      'Kesäkurpitsa',
      'Äyriäinen',
    ])
  })
})

describe('sortByName', () => {
  const items = [{ name: 'Öljy' }, { name: 'Ananas' }, { name: 'Salaatti' }]

  it('sorts by the name each item shows', () => {
    expect(sortByName(items, (i) => i.name).map((i) => i.name)).toEqual([
      'Ananas',
      'Salaatti',
      'Öljy',
    ])
  })

  it('leaves the original list alone', () => {
    sortByName(items, (i) => i.name)
    expect(items.map((i) => i.name)).toEqual(['Öljy', 'Ananas', 'Salaatti'])
  })
})
