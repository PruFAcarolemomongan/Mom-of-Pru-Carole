import type { Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  firstName: string
  handle: string
  role: string
  avatarSrc: string
  verifiedLabel: string
  email: string
  phone: string
  bookingUrl: string
  credentials: string[]
  location: string
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: { body: string; portraitSrc: string; portraitAlt: string }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Carole C. Momongan, LPT',
  firstName: 'Carole',
  handle: '',
  role: 'Licensed Professional Teacher | Assistant Unit Manager, Pru Life UK',
  avatarSrc: '/carole-momongan.jpg',
  verifiedLabel: 'Licensed Professional Teacher and Certified Financial Coach',
  email: 'pluk.carolemomongan@gmail.com',
  phone: '0917 717 3046',
  bookingUrl: 'https://calendly.com/pluk-carolemomongan/online-appointment-with-mom-of-pru-carole',
  credentials: ['Licensed Professional Teacher', 'Certified Financial Coach', 'Assistant Unit Manager, Pru Life UK'],
  location: 'Philippines',
  stats: [],
  displayName: { line1: 'Carole C.', line2: 'Momongan, LPT' },
  hero: {
    body: 'I help families prepare today, protect what matters most, and build a more financially secure future.',
    portraitSrc: '/carole-momongan.jpg',
    portraitAlt: 'Carole C. Momongan, Licensed Professional Teacher, Certified Financial Coach, and Assistant Unit Manager at Pru Life UK',
  },
  socials: [
    { label: 'Carole on Facebook', href: 'https://www.facebook.com/profile.php?id=61577227094531', iconPath: '/icons/facebook.svg' },
  ],
}
