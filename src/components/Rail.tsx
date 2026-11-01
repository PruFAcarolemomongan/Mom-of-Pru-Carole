import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ThemeGlyph from './ThemeGlyph'
import { HomeIcon, StackIcon, UserIcon, FolderIcon, CupIcon, StarIcon, MessageIcon } from './RailIcons'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { profile } from '@/data/profile'
import { SealCheck } from '@/components/slab'

// One section index and one shared, interruptible highlight.
export const RAIL_LINKS = [
  { label: 'Home', to: '#top', Icon: HomeIcon },
  { label: 'Pru Life UK app', to: '#pru-app', Icon: FolderIcon },
  { label: 'Planning topics', to: '#planning', Icon: StackIcon },
  { label: 'Our conversation', to: '#process', Icon: CupIcon },
  { label: 'Meet your adviser', to: '#about', Icon: UserIcon },
  { label: 'Grow with us', to: '#careers', Icon: StarIcon },
  { label: 'Good to know', to: '#faq', Icon: MessageIcon },
  { label: 'Your next step', to: '#book', Icon: StackIcon },
  { label: 'Contact Carole', to: '#contact', Icon: MessageIcon },
] as const

const sectionNavStyles = `
@media (min-width:1100px) {
  .rail .rail__nav { margin-top:18px; padding-top:14px; }
  .rail .rail__nav ul { position:relative; isolation:isolate; width:100%; max-width:none; gap:4px; margin:0; padding:0; }
  .rail .rail__nav li { position:relative; z-index:1; }
  .rail .rail__nav .rail__link { position:relative; height:38px; padding:0 11px; gap:10px; font-size:13px; border-radius:12px; transform:none; background:transparent; box-shadow:none; transition:color 140ms ease; }
  .rail .rail__nav .rail__link:hover { color:var(--navy); background:transparent; transform:none; }
  .rail .rail__nav .rail__link.active { color:var(--navy); font-weight:600; background:transparent; box-shadow:none; }
  .rail .rail__nav .rail__link.active svg { color:#bd173d; }
  .rail .rail__nav .rail__link:focus-visible { outline:2px solid #bd173d; outline-offset:2px; }
  .rail .rail__nav li.rail__section-pill { position:absolute; z-index:0; inset:0 0 auto; height:38px; border-radius:12px; background:rgba(195,28,67,.09); border:1px solid rgba(195,28,67,.12); pointer-events:none; opacity:0; will-change:transform; }
  .rail .rail__avatar { width:clamp(110px,15vh,145px); }
  .rail .rail__name { margin-top:12px; }
  .rail .rail__actions { margin-top:12px; }
  .rail .rail__copy { margin-top:18px; padding-top:16px; font-size:10px; }
}
@media (prefers-reduced-motion:reduce) {
  .rail__section-pill { will-change:auto; }
  .rail .rail__nav .rail__link, .rail .rail__nav .ricon * { transition:none!important; animation:none!important; }
}
`

type RailProps = {
  sidebarVisible?: boolean
  sidebarPeeking?: boolean
  onHide?: () => void
  onDock?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

export default function Rail({ sidebarVisible = true, sidebarPeeking = false, onHide = () => {}, onDock = () => {}, onPointerEnter = () => {}, onPointerLeave = () => {} }: RailProps) {
  const [theme, setThemeState] = useState<Theme>('light')

  const [activeSection, setActiveSection] = useState<string>('#top')
  const listRef = useRef<HTMLUListElement>(null)
  const pillRef = useRef<HTMLLIElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const initializedRef = useRef(false)
  const lockedSectionRef = useRef<{ to: string; until: number } | null>(null)

  useEffect(() => {
    const scroller = document.getElementById('main-content')
    let frame = 0
    const update = () => {
      frame = 0
      const root = scroller && window.innerWidth >= 1100
        ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight }
      const point = root.top + Math.min(180, root.height * .24)
      const locked = lockedSectionRef.current
      if (locked && performance.now() < locked.until) return
      lockedSectionRef.current = null
      let current = '#top'
      for (const { to } of RAIL_LINKS) {
        const section = document.querySelector(to)
        if (section && section.getBoundingClientRect().top <= point) current = to
      }
      // The short contact footer cannot reach the activation line at page end.
      const atBottom = scroller && window.innerWidth >= 1100
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      if (atBottom) current = '#contact'
      setActiveSection(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const interrupt = () => { lockedSectionRef.current = null; schedule() }
    scroller?.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    update()
    return () => {
      cancelAnimationFrame(frame)
      scroller?.removeEventListener('scroll', schedule)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
      window.removeEventListener('wheel', interrupt)
      window.removeEventListener('touchstart', interrupt)
    }
  }, [])

  useLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const place = (animate: boolean) => {
      const link = list.querySelector<HTMLAnchorElement>('a[aria-current="location"]')
      if (!link || !link.getClientRects().length) return
      const listBox = list.getBoundingClientRect()
      const target = link.getBoundingClientRect()
      const current = pill.getBoundingClientRect()
      const from = current.top - listBox.top
      const to = target.top - listBox.top
      const oldScale = current.height / target.height || 1
      animationRef.current?.cancel()
      pill.style.height = target.height + 'px'
      pill.style.transformOrigin = 'top'
      pill.style.transform = 'translateY(' + to + 'px)'
      pill.style.opacity = '1'
      if (animate && initializedRef.current && !media.matches) {
        const distance = to - from
        const stretch = Math.min(.18, Math.abs(distance) / 900)
        const frames = Array.from({ length: 61 }, (_, index) => {
          const t = index / 60
          const spring = 1 - Math.exp(-8 * t) * (Math.cos(11 * t) + (8 / 11) * Math.sin(11 * t))
          const progress = index === 60 ? 1 : spring
          const extra = Math.sin(Math.PI * Math.min(1, t / .55)) * stretch
          const scale = oldScale + (1 - oldScale) * progress + extra
          const y = from + distance * progress - (distance < 0 ? extra * target.height : 0)
          return { transform: 'translateY(' + y + 'px) scaleY(' + scale + ')', offset: t }
        })
        animationRef.current = pill.animate(frames, { duration: 590, easing: 'linear' })
      }
      initializedRef.current = true
    }
    place(true)
    let firstResize = true
    const resize = new ResizeObserver(() => {
      if (firstResize) { firstResize = false; return }
      place(false)
    })
    resize.observe(list)
    const reduce = () => place(false)
    media.addEventListener('change', reduce)
    return () => {
      resize.disconnect()
      media.removeEventListener('change', reduce)
      // Keep the current animation alive until the next target reads its position.
    }
  }, [activeSection, sidebarVisible])

  useEffect(() => () => animationRef.current?.cancel(), [])

  // The pre-paint script owns the real value; read it once mounted so the
  // button shows the icon for the action, not for the current state.
  useEffect(() => setThemeState(getTheme()), [])

  return (
    <aside id="profile-rail" className="rail" aria-label="Profile and site navigation" aria-hidden={!sidebarVisible} inert={!sidebarVisible} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <style>{sectionNavStyles}</style>
      <div className="rail__inner">
        <div className="rail__header">
          <span className="rail__header-label">Your workspace</span>
          <button type="button" className="rail__hide" aria-label={sidebarPeeking ? "Keep sidebar open" : "Hide sidebar"} aria-controls="profile-rail" aria-expanded={sidebarVisible} onClick={sidebarPeeking ? onDock : onHide}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 9l-3 3 3 3" /></svg>
          </button>
        </div>
        <span className="rail__avatar">
          <img
            src={profile.avatarSrc}
            alt={profile.name}
            width={120}
            height={120}
          />
        </span>

        <h2 className="rail__name">
          Carole <span style={{ whiteSpace: 'nowrap' }}>Momongan <SealCheck size={24} weight="fill" style={{ color: '#1d9bf0', display: 'inline-block', verticalAlign: '-0.12em' }} role="img" aria-label={profile.verifiedLabel} /></span>
        </h2>
        <p className="rail__handle">{profile.role}</p>

        <div className="rail__actions">
          <ul className="rail__socials" role="list" aria-label="Social profiles">
          {profile.socials.map(({ label, href, iconPath }) => (
            <li key={label}>
              <a
                className="rail__social"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                {/* Single-colour silhouettes, tinted by currentColor through a
                    CSS mask - same technique as the hero's social row. */}
                <span
                  className="rail__social-icon"
                  style={{ ['--icon-url' as string]: `url('${iconPath}')` }}
                  aria-hidden="true"
                />
              </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="rail__theme"
            onClick={(e) => setThemeState(toggleTheme(e.currentTarget))}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <ThemeGlyph theme={theme} size={21} />
          </button>
        </div>

        <nav className="rail__nav" aria-label="Sections">
          <ul ref={listRef}>
            <li ref={pillRef} className="rail__section-pill" role="presentation" aria-hidden="true" />
            {RAIL_LINKS.map(({ label, to, Icon }) => (
              <li key={to}>
                <a href={to} className={'rail__link' + (activeSection === to ? ' active' : '')} aria-current={activeSection === to ? 'location' : undefined} onClick={() => {
                  lockedSectionRef.current = { to, until: performance.now() + 1350 }
                  setActiveSection(to)
                }}>
                  <Icon size={18} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="rail__copy">
          &copy; {new Date().getFullYear()}
          <br />
          {profile.name}
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  )
}

