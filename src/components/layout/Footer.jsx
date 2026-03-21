import { Link } from 'react-router-dom'
import { useLang } from '../../hooks/useLang'
import styles from './Footer.module.css'

export default function Footer() {
  const { t, lang, toggleLang } = useLang()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>L</span>
            <span className={styles.logoText}>oCo<span className={styles.logoCM}>.com</span></span>
          </div>
          <p className={styles.tagline}>
            {lang === 'fr'
              ? 'La plateforme immobilière du Cameroun.'
              : 'Cameroon\'s modern real estate platform.'}
          </p>
          <button className={styles.langBtn} onClick={toggleLang}>
            🌐 {lang === 'fr' ? 'English' : 'Français'}
          </button>
        </div>

        <div className={styles.col}>
          <h4>{lang === 'fr' ? 'Navigation' : 'Navigation'}</h4>
          <Link to="/">{t.nav.home}</Link>
          <Link to="/listings">{t.nav.listings}</Link>
          <Link to="/list">{t.nav.sell}</Link>
          <Link to="/about">{t.nav.about}</Link>
        </div>

        <div className={styles.col}>
          <h4>{lang === 'fr' ? 'Villes' : 'Cities'}</h4>
          {['Douala','Yaoundé','Bafoussam','Kribi','Bamenda'].map(c => (
            <Link key={c} to={`/listings?city=${c}`}>{c}</Link>
          ))}
        </div>

        <div className={styles.col}>
          <h4>{lang === 'fr' ? 'Contact' : 'Contact'}</h4>
          <a href="mailto:contact@loco.com">{t.about.contact_email}</a>
          <a href="tel:+2376XXXXXXXX">{t.about.contact_phone}</a>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            WhatsApp: +44 7789806378
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2025 LoCo.com. {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</span>
        <span style={{ color: 'var(--text-muted)' }}>
          {lang === 'fr' ? 'Fait avec ❤️ au Cameroun' : 'Made with ❤️ in Cameroon'}
        </span>
      </div>
    </footer>
  )
}
