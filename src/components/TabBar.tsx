import { House, Stack, User, CalendarBlank, Briefcase } from '@/components/slab'
import { profile } from '@/data/profile'

const TABS = [
  { label: 'Home', href: '#top', Icon: House },
  { label: 'Planning', href: '#planning', Icon: Stack },
  { label: 'Book', href: profile.bookingUrl, Icon: CalendarBlank, primary: true },
  { label: 'About', href: '#about', Icon: User },
  { label: 'Careers', href: '#careers', Icon: Briefcase },
] as const

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Page navigation">
      {TABS.map(({ label, href, Icon, ...rest }) => {
        const primary = 'primary' in rest && rest.primary
        return (
          <a
            key={label}
            href={href}
            className={`tabbar__tab${primary ? ' tabbar__tab--primary' : ''}`}
            {...(primary ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {primary ? (
              <span className="tabbar__fab"><Icon size={23} weight="bold" aria-hidden="true" /></span>
            ) : (
              <>
                <Icon size={22} aria-hidden="true" />
                <span className="tabbar__label">{label}</span>
              </>
            )}
            {primary && <span className="tabbar__label">{label}</span>}
          </a>
        )
      })}
    </nav>
  )
}
