import { describe, expect, it } from 'vitest'

import { orderMonths, parseMonths, seasonMonths, selectionSeason, toggleMonth } from './selection'

describe('reading the chosen months from the address', () => {
  it('reads one month', () => {
    expect(parseMonths('3', 9)).toEqual([3])
  })

  it('reads several months', () => {
    expect(parseMonths('10,11', 9)).toEqual([10, 11])
  })

  it("reads a season's three months, in the order the season runs", () => {
    expect(parseMonths('1,2,12', 9)).toEqual([12, 1, 2])
  })

  it('drops duplicates', () => {
    expect(parseMonths('10,10,11', 9)).toEqual([10, 11])
  })

  it('drops out-of-range and non-numeric values and keeps the rest', () => {
    expect(parseMonths('0,13,x,4,2.5,-1', 9)).toEqual([4])
  })

  it('falls back to the given month when nothing valid is left', () => {
    expect(parseMonths('x,13', 9)).toEqual([9])
    expect(parseMonths('', 9)).toEqual([9])
  })

  it('falls back to the given month when there is no value at all', () => {
    expect(parseMonths(undefined, 9)).toEqual([9])
  })

  it('reads a repeated parameter as one list', () => {
    expect(parseMonths(['10', '11'], 9)).toEqual([10, 11])
  })
})

describe('the order chosen months are named in', () => {
  it('is calendar order for months within one year', () => {
    expect(orderMonths([11, 3, 10])).toEqual([3, 10, 11])
  })

  it('puts a run through the new year first', () => {
    expect(orderMonths([1, 12])).toEqual([12, 1])
    expect(orderMonths([2, 11, 12, 1])).toEqual([11, 12, 1, 2])
    expect(orderMonths([1, 7, 12])).toEqual([12, 1, 7])
  })

  it('stays in calendar order when nothing runs through the new year', () => {
    expect(orderMonths([1, 7])).toEqual([1, 7])
    expect(orderMonths([12, 6])).toEqual([6, 12])
    expect(orderMonths([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })
})

describe('tapping a month', () => {
  it('adds a month that was not chosen', () => {
    expect(toggleMonth([10], 11)).toEqual([10, 11])
  })

  it('takes out a month that was chosen', () => {
    expect(toggleMonth([10, 11], 10)).toEqual([11])
  })

  it('cannot take out the last chosen month', () => {
    expect(toggleMonth([10], 10)).toEqual([10])
  })

  it('keeps the result in order', () => {
    expect(toggleMonth([12, 1], 11)).toEqual([11, 12, 1])
  })
})

describe('seasons', () => {
  it('gives each season its three months, winter running over the new year', () => {
    expect(seasonMonths('winter')).toEqual([12, 1, 2])
    expect(seasonMonths('spring')).toEqual([3, 4, 5])
    expect(seasonMonths('summer')).toEqual([6, 7, 8])
    expect(seasonMonths('autumn')).toEqual([9, 10, 11])
  })

  it('names the season when exactly its three months are chosen', () => {
    expect(selectionSeason([12, 1, 2])).toBe('winter')
    expect(selectionSeason([9, 10, 11])).toBe('autumn')
  })

  it('names no season for part of one, or more than one', () => {
    expect(selectionSeason([9, 10])).toBeUndefined()
    expect(selectionSeason([8, 9, 10, 11])).toBeUndefined()
    expect(selectionSeason([3])).toBeUndefined()
  })
})
