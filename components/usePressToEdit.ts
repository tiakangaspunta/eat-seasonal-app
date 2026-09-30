'use client'

import { useRef } from 'react'

/** Long enough not to fire while scrolling, short enough not to feel stuck. */
const HOLD_MS = 500

/**
 * How an editable text opens: a click with a mouse, a press and hold on touch.
 *
 * A tap has to stay free on touch screens, where it means opening things, so
 * names (issue 009) and notes both open their editor this way. The returned
 * handlers go on the button that shows the text.
 */
export function usePressToEdit(start: () => void) {
  // A press and hold that has already fired, so the click it is followed by
  // does not re-open the editor.
  const fromTouch = useRef(false)
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHold = () => {
    if (hold.current) clearTimeout(hold.current)
    hold.current = null
  }

  return {
    onClick: () => {
      if (fromTouch.current) {
        fromTouch.current = false
        return
      }
      start()
    },
    onPointerDown: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse') return
      fromTouch.current = true
      hold.current = setTimeout(start, HOLD_MS)
    },
    onPointerUp: cancelHold,
    onPointerLeave: cancelHold,
    onPointerCancel: cancelHold,
    // Otherwise a long press raises the browser's own text selection menu over
    // the field it has just opened.
    onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  }
}
