import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { mockProperties, CITIES, PROPERTY_TYPES } from '../data/mockData'
import PropertyCard from '../components/property/PropertyCard'
import styles from './Listings.module.css'

export default function Listings() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()

  const [query, setQuery]         = useState(searchParams.get('q') || '')
  const [listingType, setType]    = useState(searchParams.get('type') || 'all')
  const [city, setCity]           = useState(searchParams.get('city') || '')
  const [propType, setPropType]   = useState('')
  const [minPrice, setMinPrice]   = useState('')
  const [maxPrice, setMaxPrice]   = useState('')
  const [bedrooms, setBedrooms]   = useState('')
  const [sort, setSort]           = useState('newest')
  const [filtersOpen, setFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...mockProperties]

    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    if (listingType !== 'all') list = list.filter(p => p.listing_type === listingType)
    if (city)     list = list.filter(p => p.city === city)
    if (propType) list = list.filter(p => p.property_type === propType)
    if (minPrice) list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice))
    if (bedrooms) list = list.filter(p => bedrooms === '4+' ? p.bedrooms >= 4 : p.bedrooms === Number(bedrooms))

    switch (sort) {
      case 'price_asc':  list.sort((a,b) => a.price - b.price);      break
      case 'price_desc': list.sort((a,b) => b.price - a.price);      break
      case 'area':       list.sort((a,b) => (b.area||0)-(a.area||0)); break
      default:           list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    }

    return list
  }, [query, listingType, city, propType, minPrice, maxPrice, bedrooms, sort])

  const resetFilters = () => {
    setQuery(''); setType('all'); setCity(''); setPropType('')
    setMinPrice(''); setMaxPrice(''); setBedrooms('')
  }

  const hasFilters = query || listingType !== 'all' || city || propType || minPrice || maxPrice || bedrooms

  const propTypeLabels = PROPERTY_TYPES.reduce((acc, pt) => {
    acc[pt] = t.prop_types[pt] || pt; return acc
  }, {})

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>
            {listingType === 'all' ? (lang === 'fr' ? 'Toutes les annonces' : 'All Listings')
             : listingType === 'rent' ? t.filters.rent
             : listingType === 'buy'  ? t.filters.buy
             : t.filters.sell}
          </h1>
          <p className={styles.count}>
            <span className={styles.countNum}>{filtered.length}</span> {t.filters.results}
          </p>
        </div>

        {/* Search + controls bar */}
        <div className={`${styles.topBar} glass`}>
          {/* Search input */}
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIco} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t.hero.search_placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <button className={styles.clearBtn} onClick={() => setQuery('')}><X size={14}/></button>}
          </div>

          {/* Type tabs */}
          <div className={styles.typeTabs}>
            {['all','rent','buy','sell'].map(tab => (
              <button
                key={tab}
                className={`${styles.typeTab} ${listingType === tab ? styles.typeTabActive : ''}`}
                onClick={() => setType(tab)}
              >
                {t.filters[tab]}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">{t.filters.sort_newest}</option>
            <option value="price_asc">{t.filters.sort_price_asc}</option>
            <option value="price_desc">{t.filters.sort_price_desc}</option>
            <option value="area">{t.filters.sort_area}</option>
          </select>

          {/* Filter toggle */}
          <button
            className={`${styles.filterBtn} ${filtersOpen ? styles.filterBtnActive : ''} ${hasFilters ? styles.filterBtnDirty : ''}`}
            onClick={() => setFilters(o => !o)}
          >
            <SlidersHorizontal size={15} />
            {t.filters.apply}
            {hasFilters && <span className={styles.filterDot} />}
          </button>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className={`${styles.filtersPanel} glass fade-in`}>
            <div className={styles.filtersGrid}>
              {/* City */}
              <div className={styles.filterGroup}>
                <label>{t.filters.city}</label>
                <select value={city} onChange={e => setCity(e.target.value)}>
                  <option value="">{t.filters.any}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Property type */}
              <div className={styles.filterGroup}>
                <label>{t.filters.type}</label>
                <select value={propType} onChange={e => setPropType(e.target.value)}>
                  <option value="">{t.filters.any}</option>
                  {PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{propTypeLabels[pt]}</option>)}
                </select>
              </div>

              {/* Min price */}
              <div className={styles.filterGroup}>
                <label>{t.filters.min_price}</label>
                <input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              </div>

              {/* Max price */}
              <div className={styles.filterGroup}>
                <label>{t.filters.max_price}</label>
                <input type="number" placeholder="∞" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>

              {/* Bedrooms */}
              <div className={styles.filterGroup}>
                <label>{t.filters.bedrooms}</label>
                <select value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
                  <option value="">{t.filters.any}</option>
                  {['0','1','2','3','4+'].map(b => <option key={b} value={b}>{b === '0' ? 'Studio' : b}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.resetBtn} onClick={resetFilters}>
                <X size={14} /> {t.filters.reset}
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className={styles.chips}>
            {city && <span className={styles.chip}>{city} <button onClick={() => setCity('')}><X size={11}/></button></span>}
            {propType && <span className={styles.chip}>{propTypeLabels[propType]} <button onClick={() => setPropType('')}><X size={11}/></button></span>}
            {minPrice && <span className={styles.chip}>{lang==='fr'?'Min':'Min'}: {new Intl.NumberFormat('fr-FR').format(minPrice)} <button onClick={() => setMinPrice('')}><X size={11}/></button></span>}
            {maxPrice && <span className={styles.chip}>{lang==='fr'?'Max':'Max'}: {new Intl.NumberFormat('fr-FR').format(maxPrice)} <button onClick={() => setMaxPrice('')}><X size={11}/></button></span>}
            {bedrooms && <span className={styles.chip}>{bedrooms === '0' ? 'Studio' : `${bedrooms} ${t.property.beds}`} <button onClick={() => setBedrooms('')}><X size={11}/></button></span>}
          </div>
        )}

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <p>{t.general.no_results}</p>
            <button className={styles.resetBtn} onClick={resetFilters}>{t.filters.reset}</button>
          </div>
        )}
      </div>
    </div>
  )
}
