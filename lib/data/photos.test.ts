/**
 * The part of photo approval that can be quietly wrong: what gets written down.
 *
 * An approval is the record that Tia said yes to a specific photo, and
 * `scripts/download-approved.mjs` trusts it completely. So the write is worth
 * testing even though the contact sheet itself is checked by eye, per the tdd
 * skill. Everything here runs against a temporary directory.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { PhotoApprovalError, approve, readApprovals } from './photos'

let root: string

const candidate = {
  source: 'Wikimedia Commons',
  title: 'Tree with red apples in Barkedal 4.jpg',
  thumbUrl: 'https://upload.wikimedia.org/thumb.jpg',
  fullUrl: 'https://upload.wikimedia.org/full.jpg',
  author: 'W.carter',
  license: 'CC0',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Apples.jpg',
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'photos-'))
})

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true })
})

describe('approve', () => {
  it('records an approved candidate against its ingredient', () => {
    approve('apple', candidate, root)

    expect(readApprovals(root).decisions.apple).toEqual(candidate)
  })

  it('records "none of these" as a decision, not as an absence', () => {
    approve('apple', null, root)

    const { decisions } = readApprovals(root)
    expect('apple' in decisions).toBe(true)
    expect(decisions.apple).toBeNull()
  })

  it('leaves an unreviewed ingredient absent, so it can be told from a rejection', () => {
    approve('apple', candidate, root)

    expect('banana' in readApprovals(root).decisions).toBe(false)
  })

  it('replaces an earlier decision, so changing her mind is just approving again', () => {
    approve('apple', candidate, root)
    approve('apple', { ...candidate, title: 'A better apple.jpg' }, root)

    expect(readApprovals(root).decisions.apple).toMatchObject({ title: 'A better apple.jpg' })
  })

  it('keeps decisions about other ingredients when one is approved', () => {
    approve('apple', candidate, root)
    approve('banana', null, root)

    expect(Object.keys(readApprovals(root).decisions).sort()).toEqual(['apple', 'banana'])
  })

  it('refuses an id that is not a slug, before it is joined onto any path', () => {
    expect(() => approve('../../package', candidate, root)).toThrow(PhotoApprovalError)
  })

  it('refuses a candidate missing the fields the attribution list needs', () => {
    const { author, ...missingAuthor } = candidate

    expect(() => approve('apple', missingAuthor, root)).toThrow(PhotoApprovalError)
  })

  it('refuses a url the download step should never fetch', () => {
    expect(() => approve('apple', { ...candidate, fullUrl: 'file:///etc/passwd' }, root)).toThrow(
      PhotoApprovalError,
    )
  })

  it('stamps when the decisions were last changed', () => {
    approve('apple', candidate, root)

    expect(readApprovals(root).updatedAt).not.toBe('')
  })
})

describe('readApprovals', () => {
  it('is empty before anything has been approved', () => {
    expect(readApprovals(root)).toEqual({ updatedAt: '', decisions: {} })
  })
})
