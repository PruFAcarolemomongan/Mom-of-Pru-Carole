import { useEffect, useState } from 'react'
import { SealCheck } from '@/components/slab'
import ThemeGlyph from './ThemeGlyph'
import { HomeIcon, StackIcon, UserIcon } from './RailIcons'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { profile } from '@/data/profile'

const LINKS = [
  { label: 'Home', to: '#top', Icon: HomeIcon },
  { label: 'Planning topics', to: '#planning', Icon: StackIcon },
  { label: 'About Carole', to: '#about', Icon: UserIcon },
]

export default function Rail() {
  const [theme, setThemeState] = useState<Theme>('light')
  useEffect(() => setThemeState(getTheme()), [])

  return (
    <aside className="rail" aria-label="Carole’s profile and page navigation">
      <div className="rail__inner">
        <span className="rail__avatar"><img src={profile.avatarSrc} alt={profile.name} width={120} height={120} /></span>
        <h2 className="rail__name">{profile.name}<SealCheck size={19} weight="fill" aria-label={profile.verifiedLabel} /></h2>
        <p className="rail__handle">{profile.role}</p>
        <div className="rail__actions">
          <ul className="rail__socials" role="list" aria-label="Social profiles">
            {profile.socials.map(({ label, href, iconPath }) => <li key={label}>
              <a className="rail__social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <span className="rail__social-icon" style={{ ['--icon-url' as string]: 'url(' + iconPath + ')' }} aria-hidden="true" />
              </a>
            </li>)}
          </ul>
          <button type="button" className="rail__theme" onClick={(e) => setThemeState(toggleTheme(e.currentTarget))} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <ThemeGlyph theme={theme} size={21} />
          </button>
        </div>
        <nav className="rail__nav" aria-label="Page sections">
          <ul>{LINKS.map(({ label, to, Icon }) => <li key={to}><a href={to} className="rail__link"><Icon size={21} />{label}</a></li>)}</ul>
          <a className="carole-rail-book" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Book a conversation</a>
        </nav>
        <p className="rail__copy">© {new Date().getFullYear()}<br />{profile.name}. All rights reserved.</p>
      </div>
    </aside>
  )
}
