'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Which item the side panel is showing, kept in the URL as `?open=<id>`.
 *
 * In the address rather than in component state because the two views link
 * into each other: a recipe listed in an ingredient's panel is a link to
 * `/recipes?open=<recipe>`, and that page has to arrive with the panel already
 * open. It also makes the back button undo the last thing opened, and a reload
 * keep it open.
 *
 * `pushState` rather than a router navigation: Next keeps `useSearchParams` in
 * step with the native history API, and nothing on the server needs to render
 * again just because a panel opened.
 */
export function useOpenParam(): [string | null, (id: string | null) => void] {
  const params = useSearchParams()
  const open = params.get('open')

  const setOpen = (id: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (id === null) next.delete('open')
    else next.set('open', id)
    const query = next.toString()
    window.history.pushState(null, '', query ? `?${query}` : window.location.pathname)
  }

  return [open, setOpen]
}
