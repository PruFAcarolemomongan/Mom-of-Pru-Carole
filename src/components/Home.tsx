import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { ArrowUpRight, Heart, ShieldCheck, GraduationCap, SealCheck, CheckCircle } from '@/components/slab'
import { profile } from '@/data/profile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import '@/styles/home-carole.css'

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void }
  }
}

let calendlyWidgetPromise: Promise<void> | null = null

function openBooking(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: profile.bookingUrl })
    return
  }

  if (!calendlyWidgetPromise) {
    calendlyWidgetPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        calendlyWidgetPromise = null
        reject(new Error('Calendly widget failed to load'))
      }
      document.head.appendChild(script)
    })
  }

  void calendlyWidgetPromise
    .then(() => window.Calendly?.initPopupWidget({ url: profile.bookingUrl }))
    .catch(() => { window.location.href = profile.bookingUrl })
}

const planningTopics = [
  {
    Icon: ShieldCheck,
    title: 'Protect the people you love',
    body: 'Talk through your family’s priorities and explore protection options that suit your needs.',
  },
  {
    Icon: GraduationCap,
    title: 'Plan for future milestones',
    body: 'Give education, family goals, and the milestones ahead a place in your financial plan.',
  },
  {
    Icon: Heart,
    title: 'Build a more secure future',
    body: 'Start with your goals, ask questions, and consider your next step at a pace that feels right.',
  },
]

const steps = [
  ['01', 'Tell me what matters to you', 'Share the people, plans, and priorities you want to prepare for.'],
  ['02', 'Explore your options', 'We can review suitable options together and answer your questions.'],
  ['03', 'Choose your next step', 'Take the time you need to decide what feels right for you.'],
]

const faqs = [
  ['What happens during an online appointment?', 'We’ll talk about your priorities, answer your questions, and discuss possible next steps. There is no obligation to apply.'],
  ['Do I need to prepare anything?', 'You can bring questions or a general idea of what you want to plan for. Please do not send sensitive personal or financial documents through this page.'],
  ['How do I book a time?', 'Use the booking button to view Carole’s available appointment times on Calendly.'],
]

const rating = 5.0
const starPath = 'M12 2.8l2.77 5.62 6.2.9-4.49 4.38 1.06 6.18L12 16.96 6.46 19.88l1.06-6.18-4.49-4.38 6.2-.9L12 2.8z'

function CaroleRating() {
  const ratingRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ratingGroup = ratingRef.current
    const score = scoreRef.current
    if (!ratingGroup || !score) return

    const stars = Array.from(ratingGroup.querySelectorAll<HTMLElement>('.carole-rating__star'))
    const fills = Array.from(ratingGroup.querySelectorAll<HTMLElement>('.carole-rating__fill'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let started = false

    const showFinalRating = () => {
      score.textContent = rating.toFixed(1)
      stars.forEach((star, index) => {
        const fraction = Math.max(0, Math.min(1, rating - index))
        const percent = (1 - fraction) * 100
        const fill = fills[index]
        if (fill) fill.style.clipPath = `inset(0 ${percent}% 0 0)`
        star.style.animation = 'none'
      })
    }

    if (reducedMotion) {
      showFinalRating()
      return
    }

    score.textContent = '0.0'
    const animateRating = () => {
      if (started) return
      started = true
      const totalDuration = 400 + (stars.length - 1) * 190

      fills.forEach((fill, index) => {
        const fraction = Math.max(0, Math.min(1, rating - index))
        const percent = (1 - fraction) * 100
        fill.style.transitionDelay = `${index * 190}ms`
        fill.style.clipPath = `inset(0 ${percent}% 0 0)`
        stars[index].style.animation = `carole-star-pop 560ms cubic-bezier(.2, 1.4, .4, 1) ${index * 190}ms both`
      })

      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / totalDuration)
        score.textContent = (rating * progress).toFixed(1)
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      observer.disconnect()
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) animateRating()
    }, { threshold: 0.45 })
    observer.observe(ratingGroup)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="carole-rating" ref={ratingRef}>
      <div className="carole-rating__score-wrap">
        <span className="carole-rating__score" ref={scoreRef}>4.9</span>
        <span className="carole-rating__out-of">out of 5</span>
      </div>
      <div className="carole-rating__stars" role="img" aria-label="Rated 5 out of 5">
        {Array.from({ length: 5 }, (_, index) => (
          <span className="carole-rating__star" key={index} aria-hidden="true">
            <span className="carole-rating__base">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"><path d={starPath} /></svg>
            </span>
            <span className="carole-rating__fill">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"><path d={starPath} /></svg>
            </span>
          </span>
        ))}
      </div>
      <span className="carole-rating__caption">Rated 5 out of 5</span>
    </div>
  )
}

export default function Home() {
  useScrollReveal()

  return (
    <div className="carole-page" id="top">
      <div className="carole-masthead">
        <header className="carole-header">
          <a className="carole-brand" href="#top" aria-label="Mom of Pru, Carole home">
            <span className="carole-brand__mark">C</span>
            <span><b>Mom of Pru</b><small>Carole Momongan</small></span>
          </a>
          <nav className="carole-nav" aria-label="Main navigation">
            <a href="#top">Home</a>
            <a href="#about">About</a>
            <a href="#planning">Planning</a>
            <a href="#faq">FAQs</a>
          </nav>
          <a className="carole-header__cta" href={profile.bookingUrl} onClick={openBooking}>
            Contact Carole <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </header>

        <section className="carole-hero" aria-labelledby="home-title">
          <div className="carole-hero__copy">
            <p className="carole-kicker"><span /> Pru Life UK · Mom of Pru</p>
            <h1 className="carole-hero__title" id="home-title">
              {profile.name}<SealCheck className="carole-hero__verified" size={30} weight="fill" aria-label={profile.verifiedLabel} />
            </h1>
            <p className="carole-hero__role">{profile.role}</p>
            <p className="carole-hero__lede">{profile.hero.body}</p>
            <div className="carole-hero__actions">
              <a className="carole-button" href={profile.bookingUrl} onClick={openBooking}>
                Book an online appointment <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
              <a className="carole-text-link" href="#planning">Explore planning topics</a>
            </div>
            <CaroleRating />
            <div className="carole-hero__credentials">
              <span>Carole Momongan</span>
              <small>Associate Unit Manager · Pru Life UK</small>
            </div>
          </div>
          <div className="carole-hero__portrait-wrap">
            <div className="carole-hero__portrait-frame">
              <img className="carole-hero__portrait" src={profile.hero.portraitSrc} alt={profile.hero.portraitAlt} fetchPriority="high" />
            </div>
            <div className="carole-hero__caption"><CheckCircle size={17} weight="fill" aria-hidden="true" /> Certified Financial Coach</div>
          </div>
          <a className="carole-scroll" href="#planning" aria-label="Scroll to planning topics"><span /> Scroll to explore</a>
        </section>
      </div>

      <main>

        <section className="carole-section carole-planning" id="planning" aria-labelledby="planning-title">
          <div className="carole-section__head">
            <p className="carole-kicker">A conversation shaped around you</p>
            <h2 id="planning-title">Start with the future <em>you want to build.</em></h2>
            <p>Every family has different priorities. Begin with what matters most to you, then explore the options available for your goals.</p>
          </div>
          <div className="carole-topic-grid">
            {planningTopics.map(({ Icon, title, body }, index) => (
              <article className="carole-topic" key={title}>
                <span className="carole-topic__index">0{index + 1}</span>
                <span className="carole-topic__icon"><Icon size={23} weight="duotone" aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{body}</p>
                <a href={profile.bookingUrl} onClick={openBooking} aria-label={`Talk with Carole about ${title}`}>Let’s talk <ArrowUpRight size={15} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
          <p className="carole-disclosure">Any financial product recommendation depends on your needs, eligibility, and the applicable policy terms.</p>
        </section>

        <section className="carole-section carole-process" aria-labelledby="process-title">
          <div className="carole-section__head carole-section__head--compact">
            <p className="carole-kicker">A simple place to begin</p>
            <h2 id="process-title">A clear conversation. <em>Your pace.</em></h2>
            <p>Get to know the process before you book your first conversation.</p>
          </div>
          <ol className="carole-steps">
            {steps.map(([number, title, body]) => (
              <li key={number}>
                <span className="carole-steps__number">{number}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="carole-about" id="about" aria-labelledby="about-title">
          <div className="carole-about__image"><img src={profile.aboutPortraitSrc} alt="Carole Momongan holding a red folder" loading="lazy" /></div>
          <div className="carole-about__copy">
            <p className="carole-kicker">Meet your adviser</p>
            <h2 id="about-title">Carole Momongan<SealCheck className="carole-hero__verified" size={25} weight="fill" aria-label={profile.verifiedLabel} /></h2>
            <p className="carole-about__role">Associate Unit Manager · Pru Life UK</p>
            <p>Carole brings her experience as a Licensed Professional Teacher and Certified Financial Coach to conversations about family protection and financial goals.</p>
            <div className="carole-about__credentials">
              <span>Licensed Professional Teacher (LPT)</span>
              <span>Certified Financial Coach</span>
            </div>
            <a className="carole-text-link" href={profile.bookingUrl} onClick={openBooking}>Get to know Carole <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="carole-faq" id="faq" aria-labelledby="faq-title">
          <div className="carole-faq__intro">
            <p className="carole-kicker">Good to know</p>
            <h2 id="faq-title">Questions before <em>we talk?</em></h2>
            <p>Here are a few details to help you feel ready for your first appointment.</p>
          </div>
          <div className="carole-faq__list">
            {faqs.map(([question, answer]) => (
              <details className="carole-faq__item" key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="carole-booking" id="book" aria-labelledby="book-title">
          <div>
            <p className="carole-kicker">Your next step</p>
            <h2 id="book-title">Let’s talk about <em>what matters to you.</em></h2>
            <p>Choose an online appointment time that works for you. Carole will be ready to listen and learn about your goals.</p>
          </div>
          <a className="carole-button carole-button--light" href={profile.bookingUrl} onClick={openBooking}>
            Schedule an appointment <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
          </a>
          <div className="carole-contact-links" aria-label="Contact Carole">
            <a href="tel:+639177173046">{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            {profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">Facebook profile</a>)}
          </div>
        </section>
      </main>

      <section className="carole-brand-signature" aria-label="Pru Life UK brand messages">
        <p className="carole-brand-signature__tagline" aria-label="For Every Life, For Every Future">
          <span>For Every <em>Life,</em></span>
          <span>For Every <em>Future</em></span>
        </p>
        <div className="carole-brand-signature__anniversary" aria-label="175 Years Celebrating Life">
          <div className="carole-brand-signature__years"><strong>175</strong><b>YEARS</b></div>
          <svg className="carole-brand-signature__wave" viewBox="0 0 210 24" aria-hidden="true"><path d="M4 17 C40 18 57 9 83 6 C115 2 121 21 151 17 C174 14 187 6 205 7" /></svg>
          <span>Celebrating Life</span>
        </div>
      </section>

      <footer className="carole-footer">
        <a className="carole-brand carole-brand--footer" href="#top" aria-label="Mom of Pru, Carole home">
          <span className="carole-brand__mark">C</span>
          <span><b>Mom of Pru</b><small>Carole Momongan</small></span>
        </a>
        <span>© {new Date().getFullYear()} Carole Momongan · Associate Unit Manager</span>
        <a href={profile.bookingUrl} onClick={openBooking}>Book an appointment <ArrowUpRight size={15} aria-hidden="true" /></a>
      </footer>
    </div>
  )
}
