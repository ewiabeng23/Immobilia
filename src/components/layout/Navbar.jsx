import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusSquare, Info, Menu, X } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { t, lang, toggleLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const navLinks = [
    { to: '/',          label: t.nav.home,     icon: Home },
    { to: '/listings',  label: t.nav.listings, icon: Search },
    { to: '/list',      label: t.nav.sell,     icon: PlusSquare },
    { to: '/about',     label: t.nav.about,    icon: Info },
  ]

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>L</span>
          <span className={styles.logoText}>oCo<span className={styles.logoCM}>.com</span></span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.link} ${location.pathname === to ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className={styles.actions}>
          {/* Language toggle */}
          <button className={styles.langToggle} onClick={toggleLang} title="Switch language">
            <span className={lang === 'fr' ? styles.langActive : styles.langInactive}>FR</span>
            <span className={styles.langDivider}>|</span>
            <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
          </button>

          <Link to="/list" className={styles.btnList}>
            <PlusSquare size={15} />
            {t.nav.sell}
          </Link>

          {/* Mobile hamburger */}
          <button className={styles.burger} onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={`${styles.mobileLink} ${location.pathname === to ? styles.mobileLinkActive : ''}`}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button className={styles.mobileLangToggle} onClick={toggleLang}>
            🌐 {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
          </button>
        </div>
      )}
    </nav>
  )
}
