import { Link } from 'react-router-dom'
import { Mail, Phone, Shield, Users, MapPin, ArrowRight } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import styles from './About.module.css'

export default function About() {
  const { t, lang } = useLang()

  const values = lang === 'fr'
    ? [
        { icon: Shield, title: 'Fiabilité', desc: 'Chaque annonce est vérifiée par notre équipe avant publication.' },
        { icon: Users,  title: 'Communauté', desc: 'Nous connectons propriétaires, agents et locataires partout au Cameroun.' },
        { icon: MapPin, title: 'Local d\'abord', desc: 'Conçu pour le marché camerounais, en français et en anglais.' },
      ]
    : [
        { icon: Shield, title: 'Reliability', desc: 'Every listing is verified by our team before going live.' },
        { icon: Users,  title: 'Community', desc: 'We connect landlords, agents, and tenants across Cameroon.' },
        { icon: MapPin, title: 'Local First', desc: 'Built for the Cameroonian market, in French and English.' },
      ]

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.badge}>🇨🇲 LoCo.com</span>
          <h1 className={styles.title}>{t.about.title}</h1>
          <p className={styles.subtitle}>{t.about.subtitle}</p>
        </div>

        {/* Story */}
        <div className={`${styles.story} glass`}>
          <div className={styles.storyText}>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
          <div className={styles.storyVisual}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
              alt="Real estate"
              className={styles.storyImg}
            />
            <div className={styles.storyGlow} />
          </div>
        </div>

        {/* Mission */}
        <div className={`${styles.missionCard} glass`}>
          <span className={styles.missionLabel}>{t.about.mission}</span>
          <p className={styles.missionText}>"{t.about.mission_text}"</p>
        </div>

        {/* Values */}
        <div className={styles.valuesGrid}>
          {values.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`${styles.valueCard} glass fade-up`}
              style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
            >
              <div className={styles.valueIcon}>
                <Icon size={22} />
              </div>
              <h3 className={styles.valueTitle}>{title}</h3>
              <p className={styles.valueDesc}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className={`${styles.contactCard} glass`}>
          <h2 className={styles.contactTitle}>{t.about.contact_title}</h2>
          <div className={styles.contactLinks}>
            <a href={`mailto:${t.about.contact_email}`} className={styles.contactLink}>
              <Mail size={18} />
              {t.about.contact_email}
            </a>
            <a href={`tel:${t.about.contact_phone.replace(/\s/g,'')}`} className={styles.contactLink}>
              <Phone size={18} />
              {t.about.contact_phone}
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link to="/listings" className={styles.ctaBtn}>
            {lang === 'fr' ? 'Voir les annonces' : 'Browse Listings'} <ArrowRight size={16} />
          </Link>
          <Link to="/list" className={styles.ctaBtnSecondary}>
            {lang === 'fr' ? 'Publier un bien' : 'List a Property'}
          </Link>
        </div>

      </div>
    </div>
  )
}
