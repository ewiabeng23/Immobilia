import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Shield, Phone, MapPin } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { mockProperties, CITY_IMAGES } from '../data/mockData'
import PropertyCard from '../components/property/PropertyCard'
import styles from './Home.module.css'

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('rent')

  const featured = mockProperties.filter(p => p.featured).slice(0, 6)
  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Kribi', 'Bamenda', 'Garoua']

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/listings?q=${encodeURIComponent(query)}&type=${activeTab}`)
  }

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={`${styles.badge} fade-up delay-1`}>
            🇨🇲 {t.hero.badge}
          </span>

          <h1 className={`${styles.heroTitle} fade-up delay-2`}>
            <span>{t.hero.title1}</span>
            <em className={styles.heroTitleAccent}>{t.hero.title2}</em>
            <span>{t.hero.title3}</span>
          </h1>

          <p className={`${styles.heroSub} fade-up delay-3`}>
            {t.hero.subtitle}
          </p>

          {/* Search box */}
          <div className={`${styles.searchBox} glass fade-up delay-4`}>
            {/* Tabs */}
            <div className={styles.searchTabs}>
              {['rent','buy','sell'].map(tab => (
                <button
                  key={tab}
                  className={`${styles.searchTab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {t.filters[tab]}
                </button>
              ))}
            </div>

            {/* Input row */}
            <form className={styles.searchRow} onSubmit={handleSearch}>
              <div className={styles.searchInput}>
                <MapPin size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={t.hero.search_placeholder}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchBtn}>
                <Search size={18} />
                {t.hero.btn_search}
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className={`${styles.stats} fade-up delay-5`}>
            {[
              { val: '500+', label: t.hero.stats_listings },
              { val: '10',   label: t.hero.stats_cities },
              { val: '80+',  label: t.hero.stats_agents },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statVal}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className={styles.heroVisual}>
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&q=85"
            alt="Property"
            className={styles.heroImg}
          />
          <div className={styles.heroImgGlow} />
          <div className={`${styles.heroCard1} glass`}>
            <Shield size={18} className={styles.heroCardIcon} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                {lang === 'fr' ? 'Annonces vérifiées' : 'Verified Listings'}
              </p>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>
                {lang === 'fr' ? '100% authentiques' : '100% authentic'}
              </p>
            </div>
          </div>
          <div className={`${styles.heroCard2} glass`}>
            <Phone size={18} className={styles.heroCardIcon2} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>
                {lang === 'fr' ? 'Contact direct' : 'Direct Contact'}
              </p>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>
                WhatsApp & {lang === 'fr' ? 'Téléphone' : 'Phone'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{t.home.featured}</h2>
              <p className={styles.sectionSub}>{t.home.featured_sub}</p>
            </div>
            <Link to="/listings" className={styles.seeAll}>
              {lang === 'fr' ? 'Voir tout' : 'View all'} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.grid}>
            {featured.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{t.home.how_title}</h2>
              <p className={styles.sectionSub}>{t.home.how_sub}</p>
            </div>
          </div>
          <div className={styles.howGrid}>
            {[
              { num: '01', title: t.home.how1_title, desc: t.home.how1_desc, emoji: '🔍' },
              { num: '02', title: t.home.how2_title, desc: t.home.how2_desc, emoji: '💬' },
              { num: '03', title: t.home.how3_title, desc: t.home.how3_desc, emoji: '🔑' },
            ].map((step, i) => (
              <div key={step.num} className={`${styles.howCard} glass fade-up`} style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <span className={styles.howEmoji}>{step.emoji}</span>
                <span className={styles.howNum}>{step.num}</span>
                <h3 className={styles.howTitle}>{step.title}</h3>
                <p className={styles.howDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{t.home.cities_title}</h2>
              <p className={styles.sectionSub}>{t.home.cities_sub}</p>
            </div>
          </div>
          <div className={styles.citiesGrid}>
            {cities.map((city, i) => {
              const count = mockProperties.filter(p => p.city === city).length
              return (
                <Link
                  key={city}
                  to={`/listings?city=${city}`}
                  className={`${styles.cityCard} fade-up`}
                  style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                >
                  <img
                    src={CITY_IMAGES[city] || 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=70'}
                    alt={city}
                    className={styles.cityImg}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=70' }}
                  />
                  <div className={styles.cityOverlay} />
                  <div className={styles.cityInfo}>
                    <span className={styles.cityName}>{city}</span>
                    <span className={styles.cityCount}>
                      {count} {lang === 'fr' ? 'bien' : 'propert'}{count !== 1 ? (lang === 'fr' ? 's' : 'ies') : (lang === 'fr' ? '' : 'y')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaInner}`}>
          <div className={`${styles.ctaBox} glass`}>
            <h2 className={styles.ctaTitle}>{t.home.cta_title}</h2>
            <p className={styles.ctaSub}>{t.home.cta_sub}</p>
            <Link to="/list" className={styles.ctaBtn}>
              {t.home.cta_btn} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
