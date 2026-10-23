/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline. Every value below is a PLACEHOLDER.
 * Replace the text, or hand this file to your AI assistant and tell it what
 * to put in each field.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

import type { Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

/** A proof fact on the phone's Home: a glyph, a short value, a caption. */
export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Portrait used in the About section. */
  aboutPortraitSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  phone: string
  bookingUrl: string
  credentials: string[]
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Carole Momongan',
  firstName: 'Carole',
  handle: '',
  role: 'Associate Unit Manager',
  avatarSrc: '/carole-hero-cutout.png',
  aboutPortraitSrc: '/carole-about-crossed-cutout.png',
  verifiedLabel: 'Verified profile',
  email: 'pluk.carolemomongan@gmail.com',
  phone: '0917 717 3046',
  bookingUrl: 'https://calendly.com/pluk-carolemomongan/online-appointment-with-mom-of-pru-carole',
  credentials: [],
  location: 'PLACEHOLDER - your city or timezone',
  // Pick any icon from https://phosphoricons.com and import it above.
  stats: [],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Carole', line2: 'Momongan' },
  hero: {
    body: 'I help families prepare today, protect what matters most, and build a more financially secure future.',
    portraitSrc: '/carole-hero-cutout.png',
    portraitAlt: 'Carole Momongan, Associate Unit Manager',
  },
  socials: [
    { label: 'Carole on Facebook', href: 'https://www.facebook.com/profile.php?id=61577227094531', iconPath: '/icons/facebook.svg' },
  ],
}
