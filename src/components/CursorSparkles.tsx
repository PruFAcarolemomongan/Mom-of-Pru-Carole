import { useEffect, useRef, useState } from 'react'
import { A11Y_EVENT, motionReduced } from '@/lib/a11y'
import './cursor-sparkles.css'

const GATE =
  '(pointer: fine) and (hover: hover) and (min-width: 900px) and (prefers-reduced-motion: no-preference)'

const COLORS = ['#c8102e', '#d4a64a', '#fff8f0']
const MAX_SPARKLES = 22
const MIN_DISTANCE = 15
const MIN_INTERVAL = 34

export default function CursorSparkles() {
  const [enabled, setEnabled] = useState(false)
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia(GATE)
    const sync = () => setEnabled(media.matches && !motionReduced())
    sync()
    media.addEventListener('change', sync)
    window.addEventListener(A11Y_EVENT, sync)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener(A11Y_EVENT, sync)
    }
  }, [])

  useEffect(() => {
    const root = layer.current
    if (!enabled || !root) return

    let previousX = 0
    let previousY = 0
    let previousTime = 0

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"], [data-cursor="none"]')) return

      const now = performance.now()
      const dx = event.clientX - previousX
      const dy = event.clientY - previousY
      if (now - previousTime < MIN_INTERVAL || dx * dx + dy * dy < MIN_DISTANCE * MIN_DISTANCE) return

      previousX = event.clientX
      previousY = event.clientY
      previousTime = now

      while (root.childElementCount >= MAX_SPARKLES) root.firstElementChild?.remove()

      const sparkle = document.createElement('span')
      sparkle.className = 'cursor-sparkle'
      sparkle.textContent = '✦'
      sparkle.style.left = `${event.clientX}px`
      sparkle.style.top = `${event.clientY}px`
      sparkle.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
      sparkle.style.setProperty('--sparkle-drift-x', `${Math.round(Math.random() * 28 - 14)}px`)
      sparkle.style.setProperty('--sparkle-drift-y', `${Math.round(Math.random() * -26 - 8)}px`)
      sparkle.style.setProperty('--sparkle-size', `${12 + Math.round(Math.random() * 9)}px`)
      root.append(sparkle)
      window.setTimeout(() => sparkle.remove(), 560)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  if (!enabled) return null
  return <div ref={layer} className="cursor-sparkles" aria-hidden="true" />
}
