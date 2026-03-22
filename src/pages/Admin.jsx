import { useState } from 'react'
import { CheckCircle, XCircle, Eye, LogOut, Home, Lock } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { mockProperties, formatPrice } from '../data/mockData'
import styles from './Admin.module.css'

// Simple admin password — change this to something strong
const ADMIN_PASSWORD = 'loco2025admin'

export default function Admin() {
  const { lang } = useLang()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('loco_admin') === 'true')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  // In production these come from Supabase. For now simulate with state.
  const [listings, setListings] = useState([])

  const [filter, setFilter] = useState('pending')
  const [selected, setSelected] = useState(null)

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('loco_admin', 'true')
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('loco_admin')
    setAuthed(false)
  }

  const approve = (id) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, verified: true } : l))
    setSelected(null)
  }

  const reject = (id) => {
    setListings(ls => ls.filter(l => l.id !== id))
    setSelected(null)
  }

  const feature = (id) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, featured: !l.featured } : l))
  }

  const filtered = listings.filter(l =>
    filter === 'pending'  ? !l.verified :
    filter === 'approved' ? l.verified :
    true
  )

  const pending  = listings.filter(l => !l.verified).length
  const approved = listings.filter(l => l.verified).length

  const typeLabel = { rent: 'For Rent', buy: 'For Sale', sell: 'To Sell' }
  const typeColor = { rent: '#4f9eff', buy: '#e8c97a', sell: '#34d399' }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={`${styles.loginCard} glass`}>
          <div className={styles.loginIcon}><Lock size={28} /></div>
          <h1 className={styles.loginTitle}>Admin Access</h1>
          <p className={styles.loginSub}>LoCo.cm — Property Management</p>
          <input
            type="password"
            className={styles.loginInput}
            placeholder="Enter admin password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {pwError && <p className={styles.loginError}>Incorrect password</p>}
          <button className={styles.loginBtn} onClick={login}>Sign In</button>
          <a href="/" className={styles.loginBack}><Home size={13}/> Back to site</a>
        </div>
      </div>
    )
  }

  // ADMIN DASHBOARD
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>L</div>
          <div>
            <h1 className={styles.headerTitle}>Admin Dashboard</h1>
            <p className={styles.headerSub}>LoCo.cm — Property Management</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <a href="/" className={styles.siteBtn}><Home size={14}/> View Site</a>
          <button className={styles.logoutBtn} onClick={logout}><LogOut size={14}/> Logout</button>
        </div>
      </div>

      <div className={styles.inner}>
        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={`${styles.statCard} glass`}>
            <span className={styles.statNum}>{listings.length}</span>
            <span className={styles.statLabel}>Total Listings</span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <span className={styles.statNum} style={{ color: '#fbbf24' }}>{pending}</span>
            <span className={styles.statLabel}>Pending Review</span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <span className={styles.statNum} style={{ color: '#34d399' }}>{approved}</span>
            <span className={styles.statLabel}>Approved & Live</span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <span className={styles.statNum} style={{ color: '#e8c97a' }}>{listings.filter(l=>l.featured).length}</span>
            <span className={styles.statLabel}>Featured</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.tabs}>
          {[
            { key: 'pending',  label: `Pending (${pending})` },
            { key: 'approved', label: `Approved (${approved})` },
            { key: 'all',      label: `All (${listings.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${filter === tab.key ? styles.tabActive : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listings table */}
        <div className={`${styles.tableWrap} glass`}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <CheckCircle size={40} color="var(--success)" />
              <p>No listings in this category.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Agent</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(listing => (
                  <tr key={listing.id} className={styles.row}>
                    <td>
                      <div className={styles.propCell}>
                        {listing.images?.[0] && (
                          <img src={listing.images[0]} alt="" className={styles.thumb}
                            onError={e => e.target.style.display='none'} />
                        )}
                        <div>
                          <p className={styles.propName}>{listing.title}</p>
                          <p className={styles.propLoc}>📍 {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.typeBadge} style={{ color: typeColor[listing.listing_type], borderColor: typeColor[listing.listing_type] + '55' }}>
                        {typeLabel[listing.listing_type]}
                      </span>
                    </td>
                    <td className={styles.price}>{formatPrice(listing.price, listing.listing_type, lang)}</td>
                    <td>
                      <p className={styles.agentName}>{listing.agent_name || listing.agent?.name || '—'}</p>
                      <p className={styles.agentPhone}>{listing.agent_phone || listing.agent?.phone || '—'}</p>
                    </td>
                    <td className={styles.date}>
                      {new Date(listing.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      {listing.verified
                        ? <span className={styles.badgeApproved}>✓ Live</span>
                        : <span className={styles.badgePending}>⏳ Pending</span>
                      }
                      {listing.featured && <span className={styles.badgeFeat}>⭐</span>}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnView} onClick={() => setSelected(listing)} title="Preview">
                          <Eye size={14}/>
                        </button>
                        {!listing.verified && (
                          <button className={styles.btnApprove} onClick={() => approve(listing.id)} title="Approve">
                            <CheckCircle size={14}/> Approve
                          </button>
                        )}
                        <button className={styles.btnFeat} onClick={() => feature(listing.id)} title="Toggle featured">
                          {listing.featured ? '★' : '☆'}
                        </button>
                        <button className={styles.btnReject} onClick={() => reject(listing.id)} title="Delete">
                          <XCircle size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {selected && (
        <div className={styles.modalBg} onClick={() => setSelected(null)}>
          <div className={`${styles.modal} glass`} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
            {selected.images?.[0] && (
              <img src={selected.images[0]} alt="" className={styles.modalImg}
                onError={e => e.target.style.display='none'} />
            )}
            <div className={styles.modalBody}>
              <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                <span className={styles.typeBadge} style={{ color: typeColor[selected.listing_type], borderColor: typeColor[selected.listing_type]+'55' }}>
                  {typeLabel[selected.listing_type]}
                </span>
                {selected.verified
                  ? <span className={styles.badgeApproved}>✓ Live</span>
                  : <span className={styles.badgePending}>⏳ Pending</span>
                }
              </div>
              <h2 className={styles.modalTitle}>{selected.title}</h2>
              <p className={styles.modalLoc}>📍 {selected.neighborhood ? `${selected.neighborhood}, ` : ''}{selected.city}</p>
              <p className={styles.modalPrice}>{formatPrice(selected.price, selected.listing_type, lang)}</p>
              <p className={styles.modalDesc}>{selected.description}</p>
              <div className={styles.modalMeta}>
                <span>Agent: {selected.agent_name || selected.agent?.name}</span>
                <span>Tel: {selected.agent_phone || selected.agent?.phone}</span>
              </div>
              {!selected.verified && (
                <div className={styles.modalActions}>
                  <button className={styles.btnApprove} onClick={() => approve(selected.id)}>
                    <CheckCircle size={15}/> Approve & Publish
                  </button>
                  <button className={styles.btnReject} onClick={() => reject(selected.id)}>
                    <XCircle size={15}/> Reject & Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
