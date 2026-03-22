import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Heart, BadgeCheck } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { formatPrice } from '../../data/mockData'
import styles from './PropertyCard.module.css'

export default function PropertyCard({ property, index = 0 }) {
  const { t, lang } = useLang()
  const [saved, setSaved] = useState(false)
  const [imgError, setImgError] = useState(false)

  const typeClass = { rent: 'tag-rent', buy: 'tag-buy', sell: 'tag-sell' }[property.listing_type] || 'tag-rent'
  const typeLabel = { rent: t.types.rent, buy: t.types.buy, sell: t.types.sell }[property.listing_type]

  const days = Math.floor((Date.now() - new Date(property.created_at)) / 86400000)
  const isNew = days <= 7

  return (
    <article
      className={`${styles.card} fade-up`}
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70' : property.images[0]}
          alt={property.title}
          className={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />

        {/* Badges */}
        <div className={styles.topBadges}>
          <span className={`tag ${typeClass}`}>{typeLabel}</span>
          {isNew && <span className="tag tag-new">{t.property.new}</span>}
        </div>

        {/* Save button */}
        <button
          className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
          onClick={(e) => { e.preventDefault(); setSaved(s => !s) }}
          aria-label="Save property"
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {property.featured && (
          <div className={styles.featuredBadge}>⭐ {t.property.featured}</div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.location}>
          <MapPin size={12} />
          <span>{property.neighborhood}, {property.city}</span>
          {property.verified && (
            <span className={styles.verified}><BadgeCheck size={12} /> {t.property.verified}</span>
          )}
        </div>

        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.price}>{formatPrice(property.price, property.listing_type, lang)}</p>

        {/* Stats */}
        <div className={styles.stats}>
          {property.bedrooms != null && property.bedrooms > 0 && (
            <span><Bed size={13} /> {property.bedrooms} {t.property.beds}</span>
          )}
          {property.bedrooms === 0 && (
            <span><Bed size={13} /> {t.property.studio}</span>
          )}
          {property.bathrooms && (
            <span><Bath size={13} /> {property.bathrooms} {t.property.baths}</span>
          )}
          {property.area && (
            <span><Maximize size={13} /> {property.area} m²</span>
          )}
        </div>

        <Link to={`/property/${property.id}`} className={styles.viewBtn}>
          {t.property.view}
        </Link>
      </div>
    </article>
  )
}
