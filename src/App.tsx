import { lazy, Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '@/components/TabBar'

import Rail from '@/components/Rail'
import IntroOverlay from '@/components/IntroOverlay'
import CursorRing from '@/components/CursorRing'
import CursorSparkles from '@/components/CursorSparkles'

import { motionReduced } from '@/lib/a11y'
import { useLenis, SCROLLER_ID } from '@/hooks/useLenis'
import { useIsPhone } from '@/hooks/useMediaQuery'
import { getPerfTier, watchFrameHealth, PERF_TIER_EVENT } from '@/lib/perf'

// Lazy-load HeroCanvas so the 118KB Three.js bundle is fetched only
// when actually needed. Mobile + reduced-motion users skip the import
// entirely - the .hero-canvas CSS fallback (background:var(--cream))
// handles the visual baseline. PageSpeed showed Three.js had 76.6 KiB
// of unused JS; not loading it at all on mobile is the cleaner fix.
const HeroCanvas = lazy(() => import('@/components/HeroCanvasV2'))

/**
 * The shell. It owns everything that outlives a route change: the contour
 * shader, the intro, the profile rail and the one scrolling panel. Each route
 * renders its view into that panel through the Outlet.
 *
 * Home is the route that shaped the layout: it is sized to the panel box and
 * must not scroll, which is what `data-fixed` switches off. Projects,
 * Testimonials, About and Contact are built to the same budget and join it.
 */
export default function App() {
  useLenis()

  const { pathname } = useLocation()
  const FIXED_ROUTES = ['/projects', '/testimonials', '/about', '/contact']
  const isFixed = FIXED_ROUTES.includes(pathname)
  // Below the shell breakpoint the rail is gone: a bottom tab bar navigates,
  // the QuickMenu (theme + accessibility) floats top-right on every page but
  // Home (whose profile header carries it), and the visits widget folds into
  // that header.
  const phone = useIsPhone()
  const panelRef = useRef<HTMLElement>(null)
  const [sidebarHidden, setSidebarHidden] = useState(() => {
    try {
      return window.localStorage.getItem('carole-sidebar-hidden') === 'true'
    } catch {
      return false
    }
  })
  const [sidebarPeeking, setSidebarPeeking] = useState(false)
  const sidebarPeekTimerRef = useRef<number | null>(null)
  const showSidebarRef = useRef<HTMLButtonElement>(null)
  const sidebarVisible = !sidebarHidden || sidebarPeeking

  useEffect(() => {
    try {
      window.localStorage.setItem('carole-sidebar-hidden', String(sidebarHidden))
    } catch {
      // The layout still works when storage is unavailable.
    }
  }, [sidebarHidden])

  const hideSidebar = () => {
    setSidebarHidden(true)
    setSidebarPeeking(false)
    window.requestAnimationFrame(() => showSidebarRef.current?.focus())
  }
  const showSidebar = () => {
    if (sidebarPeekTimerRef.current !== null) window.clearTimeout(sidebarPeekTimerRef.current)
    setSidebarHidden(false)
    setSidebarPeeking(false)
  }
  const peekSidebar = () => {
    if (!sidebarHidden) return
    if (sidebarPeekTimerRef.current !== null) window.clearTimeout(sidebarPeekTimerRef.current)
    setSidebarPeeking(true)
  }
  const scheduleSidebarPeekClose = () => {
    if (!sidebarHidden) return
    if (sidebarPeekTimerRef.current !== null) window.clearTimeout(sidebarPeekTimerRef.current)
    sidebarPeekTimerRef.current = window.setTimeout(() => setSidebarPeeking(false), 300)
  }

  // The panel is the scroller, so a route change has to reset it by hand -
  // the browser only restores scroll on the document.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  // From the first route change on, a page that mounts rises into place
  // (mobile-pass.css). Not on the first load: the intro owns that arrival.
  // Layout effect: set before paint, or the new page shows for one frame at
  // full opacity and then jumps back to start its rise.
  const firstPath = useRef(pathname)
  useLayoutEffect(() => {
    if (pathname !== firstPath.current) document.documentElement.classList.add('has-navigated')
  }, [pathname])

  // The page measures its own frame health once the intro clears and steps
  // the design down if it cannot hold it - see lib/perf.ts. `low` is the tier
  // where the shader itself has to go.
  const [perfTier, setPerfTier] = useState(getPerfTier)
  useEffect(() => {
    const onTier = (e: Event) => setPerfTier((e as CustomEvent).detail)
    window.addEventListener(PERF_TIER_EVENT, onTier)
    void watchFrameHealth()
    return () => window.removeEventListener(PERF_TIER_EVENT, onTier)
  }, [])

  const [shouldLoadCanvas, setShouldLoadCanvas] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || motionReduced()
    const isMobile = window.matchMedia('(pointer: coarse) and (hover: none)').matches
    if (reduced || isMobile) return
    // Defer the Three.js fetch to idle time so it does not compete with
    // initial render / LCP. Falls back to setTimeout if requestIdleCallback
    // is unavailable (Safari).
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
    // Wait for the load event too: the shader is decoration, and parsing
    // Three.js during boot was the bulk of the blocking time.
    const start = () => {
      if (w.requestIdleCallback) {
        w.requestIdleCallback(() => setShouldLoadCanvas(true), { timeout: 3000 })
      } else {
        window.setTimeout(() => setShouldLoadCanvas(true), 1500)
      }
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
  }, [])

  return (
    <>
      <IntroOverlay />
      <CursorRing />
      <CursorSparkles />
      <a href={`#${SCROLLER_ID}`} className="skip-link">Skip to main content</a>
      {shouldLoadCanvas && perfTier !== 'low' && (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      )}

      <div className={"shell" + (sidebarHidden ? " shell--sidebar-hidden" : "") + (sidebarPeeking ? " shell--sidebar-peeking" : "")}>
        <div className="shell__edge-zone" aria-hidden="true" onPointerEnter={peekSidebar} />
        <Rail sidebarVisible={sidebarVisible} sidebarPeeking={sidebarPeeking} onHide={hideSidebar} onDock={showSidebar} onPointerEnter={peekSidebar} onPointerLeave={scheduleSidebarPeekClose} />
        <main
          ref={panelRef}
          id={SCROLLER_ID}
          className="shell__panel"
          data-fixed={isFixed ? 'true' : 'false'}
        >
          <button ref={showSidebarRef} type="button" className="shell__show-sidebar" aria-label="Show sidebar" aria-controls="profile-rail" aria-expanded={sidebarVisible} onClick={showSidebar}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
            </svg>
          </button>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {phone && <TabBar />}

    </>
  )
}
