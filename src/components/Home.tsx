import { ArrowUpRight, CheckCircle, Heart, ShieldCheck, GraduationCap } from '@/components/slab'
import { profile } from '@/data/profile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import '@/styles/home-carole.css'

const planningTopics = [
  { Icon: ShieldCheck, title: 'Protect what matters', body: 'Talk through the people and priorities you want to protect, then explore options that fit your needs.' },
  { Icon: GraduationCap, title: 'Prepare for family goals', body: 'Make space for the milestones your family is working toward and discuss how to prepare for them.' },
  { Icon: Heart, title: 'Build with intention', body: 'Review your goals, ask questions, and take a considered next step at your own pace.' },
]

const steps = [
  ['01', 'Start with your priorities', 'Share what matters to you and what you want to plan for.'],
  ['02', 'Explore suitable options', 'Review available options together and ask the questions you need.'],
  ['03', 'Choose your next step', 'Take time to decide what feels right for you and your family.'],
]

export default function Home() {
  useScrollReveal()

  return (
    <div className="carole-page" id="top">
      <section className="carole-hero" aria-labelledby="home-title">
        <div className="carole-hero__copy">
          <p className="carole-kicker"><span /> Mom of Pru · Pru Life UK</p>
          <h1 className="carole-hero__title" id="home-title">{profile.name}</h1>
          <p className="carole-hero__role">{profile.role}</p>
          <p className="carole-hero__lede">{profile.hero.body}</p>
          <div className="carole-hero__actions">
            <a className="carole-button" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Book a conversation <ArrowUpRight size={18} weight="bold" aria-hidden="true" /></a>
            <a className="carole-text-link" href="#planning">Explore planning topics</a>
          </div>
          <div className="carole-credentials" aria-label="Professional credentials">
            {profile.credentials.map((credential) => <span key={credential}><CheckCircle size={17} weight="fill" aria-hidden="true" /> {credential}</span>)}
          </div>
        </div>
        <div className="carole-hero__portrait-wrap">
          <div className="carole-hero__portrait-halo" aria-hidden="true" />
          <img className="carole-hero__portrait" src={profile.hero.portraitSrc} alt={profile.hero.portraitAlt} fetchPriority="high" />
          <div className="carole-hero__caption"><span className="carole-caption-dot" /> Here to listen. Here to help you plan.</div>
        </div>
        <a className="carole-scroll" href="#planning" aria-label="Scroll to planning topics"><span /> Scroll to explore</a>
      </section>

      <section className="carole-section carole-planning" id="planning" aria-labelledby="planning-title">
        <div className="carole-section__head">
          <p className="carole-kicker">A conversation shaped around you</p>
          <h2 id="planning-title">Start with the future <em>you want to build.</em></h2>
          <p>Every family has different priorities. A first conversation is a chance to share yours and learn what options are available.</p>
        </div>
        <div className="carole-topic-grid">
          {planningTopics.map(({ Icon, title, body }, index) => <article className="carole-topic" key={title}>
            <span className="carole-topic__index">0{index + 1}</span>
            <span className="carole-topic__icon"><Icon size={23} weight="duotone" aria-hidden="true" /></span>
            <h3>{title}</h3><p>{body}</p>
          </article>)}
        </div>
        <p className="carole-disclosure">Any financial product recommendation depends on your needs, eligibility, and the applicable policy terms.</p>
      </section>

      <section className="carole-section carole-process" aria-labelledby="process-title">
        <div className="carole-section__head carole-section__head--compact">
          <p className="carole-kicker">A simple place to begin</p>
          <h2 id="process-title">A clear conversation. <em>Your pace.</em></h2>
        </div>
        <ol className="carole-steps">
          {steps.map(([number, title, body]) => <li key={number}>
            <span className="carole-steps__number">{number}</span><div><h3>{title}</h3><p>{body}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="carole-about" id="about" aria-labelledby="about-title">
        <div className="carole-about__image"><img src={profile.avatarSrc} alt={profile.hero.portraitAlt} loading="lazy" /></div>
        <div className="carole-about__copy">
          <p className="carole-kicker">Meet your adviser</p>
          <h2 id="about-title">{profile.name}</h2>
          <p className="carole-about__role">{profile.role}</p>
          <p>{profile.hero.body}</p>
          <a className="carole-text-link" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Get to know Carole <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="carole-booking" id="book" aria-labelledby="book-title">
        <div>
          <p className="carole-kicker">Your next step</p>
          <h2 id="book-title">Let’s talk about <em>what matters to you.</em></h2>
          <p>Choose a time that works for you. Carole will be ready to listen and learn about your goals.</p>
        </div>
        <a className="carole-button carole-button--light" href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Schedule an appointment <ArrowUpRight size={18} weight="bold" aria-hidden="true" /></a>
        <div className="carole-contact-links" aria-label="Contact Carole">
          <a href="tel:+639177173046">{profile.phone}</a>
          <a href="mailto:pluk.carolemomongan@gmail.com">{profile.email}</a>
          {profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">Facebook profile</a>)}
        </div>
      </section>

      <footer className="carole-footer" id="faq">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Licensed Professional Teacher | Assistant Unit Manager, Pru Life UK</span>
        <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer">Book an appointment</a>
      </footer>
    </div>
  )
}
