import { useEffect, useState } from 'react'
import ThemeGlyph from './ThemeGlyph'
import { HomeIcon, StackIcon, UserIcon } from './RailIcons'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { profile } from '@/data/profile'
import { SealCheck } from '@/components/slab'

/**
 * The profile rail: the fixed left column of the shell. It carries identity,
 * the theme switch and the section index, and it is the site's only navigation
 * surface from 1100px up - the floating NavBar pill hides there and takes over
 * again below it.
 *
 * The links are ROUTES, not anchors. Home is a fixed non-scrolling viewport, so
 * there is nothing for a scrollspy to spy on; the panel to the right swaps
 * instead. `NavLink` owns the active state, which is why there is no
 * IntersectionObserver here.
 */
export const RAIL_LINKS = [
  { label: 'Home', to: '#top', Icon: HomeIcon },
  { label: 'Planning topics', to: '#planning', Icon: StackIcon },
  { label: 'About Carole', to: '#about', Icon: UserIcon },
] as const

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

  // The pre-paint script owns the real value; read it once mounted so the
  // button shows the icon for the action, not for the current state.
  useEffect(() => setThemeState(getTheme()), [])

  return (
    <aside id="profile-rail" className="rail" aria-label="Profile and site navigation" aria-hidden={!sidebarVisible} inert={!sidebarVisible} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
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
          <ul>
            {RAIL_LINKS.map(({ label, to, Icon }) => (
              <li key={to}>
                <a href={to} className="rail__link">
                  <Icon size={21} />
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
