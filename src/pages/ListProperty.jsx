import { useState } from 'react'
import { CheckCircle, Upload, ChevronRight, AlertCircle } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { CITIES, PROPERTY_TYPES } from '../data/mockData'
import { supabase } from '../lib/supabase'
import styles from './ListProperty.module.css'

const AMENITY_OPTIONS = ['Pool','Generator','Security','Parking','AC','Garden','Furnished','WiFi','Fiber Internet','Meeting Rooms','Smart Home','Title Deed','Seafront','Road Access']

// City coordinates for map
const CITY_COORDS = {
  'Douala':      { lat: 4.0511,  lng: 9.7679  },
  'Yaoundé':     { lat: 3.8480,  lng: 11.5021 },
  'Bafoussam':   { lat: 5.4737,  lng: 10.4174 },
  'Bamenda':     { lat: 5.9597,  lng: 10.1456 },
  'Buea':        { lat: 4.1527,  lng: 9.2432  },
  'Kribi':       { lat: 2.9404,  lng: 9.9065  },
  'Garoua':      { lat: 9.3017,  lng: 13.3921 },
  'Maroua':      { lat: 10.5951, lng: 14.3246 },
  'Ngaoundéré':  { lat: 7.3167,  lng: 13.5833 },
  'Bertoua':     { lat: 4.5766,  lng: 13.6836 },
  'Ebolowa':     { lat: 2.9000,  lng: 11.1500 },
}

export default function ListProperty() {
  const { t, lang } = useLang()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadProgress, setUploadProgress] = useState('')
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    title: '', property_type: '', listing_type: 'rent', description: '',
    city: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', area: '',
    amenities: [], name: '', phone: '', email: ''
  })

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  const toggleAmenity = (a) => set('amenities', form.amenities.includes(a) ? form.amenities.filter(x=>x!==a) : [...form.amenities, a])

  const aLabels = {
    en: { Pool:'Pool', Generator:'Generator', Security:'Security', Parking:'Parking', AC:'A/C', Garden:'Garden', Furnished:'Furnished', WiFi:'WiFi', 'Fiber Internet':'Fiber', 'Meeting Rooms':'Meeting Rooms', 'Smart Home':'Smart Home', 'Title Deed':'Title Deed', Seafront:'Seafront', 'Road Access':'Road Access' },
    fr: { Pool:'Piscine', Generator:'Groupe élec.', Security:'Sécurité', Parking:'Parking', AC:'Clim', Garden:'Jardin', Furnished:'Meublé', WiFi:'WiFi', 'Fiber Internet':'Fibre', 'Meeting Rooms':'Salles réunion', 'Smart Home':'Maison connectée', 'Title Deed':'Titre foncier', Seafront:'Bord de mer', 'Road Access':'Accès route' }
  }
  const al = aLabels[lang] || aLabels.fr

  // ── Validation ──
  const validateStep1 = () => {
    const e = {}
    if (!form.title.trim())         e.title        = lang === 'fr' ? 'Titre requis' : 'Title is required'
    if (form.title.length > 100)    e.title        = lang === 'fr' ? 'Max 100 caractères' : 'Max 100 characters'
    if (!form.property_type)        e.property_type = lang === 'fr' ? 'Type requis' : 'Property type required'
    if (!form.description.trim())   e.description  = lang === 'fr' ? 'Description requise' : 'Description is required'
    if (form.description.length < 20) e.description = lang === 'fr' ? 'Min 20 caractères' : 'Min 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.city)                   e.city  = lang === 'fr' ? 'Ville requise' : 'City is required'
    if (!form.price)                  e.price = lang === 'fr' ? 'Prix requis' : 'Price is required'
    if (Number(form.price) <= 0)      e.price = lang === 'fr' ? 'Le prix doit être supérieur à 0' : 'Price must be greater than 0'
    if (Number(form.price) > 999999999) e.price = lang === 'fr' ? 'Prix trop élevé' : 'Price too high'
    if (form.area && Number(form.area) <= 0) e.area = lang === 'fr' ? 'Surface invalide' : 'Invalid area'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e = {}
    if (!form.name.trim()) e.name = lang === 'fr' ? 'Nom requis' : 'Name is required'
    if (!form.phone.trim()) e.phone = lang === 'fr' ? 'Téléphone requis' : 'Phone is required'
    const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/
    if (form.phone && !phoneRegex.test(form.phone)) e.phone = lang === 'fr' ? 'Numéro invalide' : 'Invalid phone number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lang === 'fr' ? 'Email invalide' : 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => s + 1)
  }

  // ── Image upload ──
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 10)
    const urls = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`${lang === 'fr' ? 'Téléchargement' : 'Uploading'} ${i+1}/${files.length}…`)
      const ext = file.name.split('.').pop()
      const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-image').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('property-image').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    setUploadedImages(urls)
    setUploadProgress('')
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep3()) return
    setSubmitting(true)

    const coords = CITY_COORDS[form.city] || null

    const { error } = await supabase.from('properties').insert([{
      title:        form.title.trim(),
      listing_type: form.listing_type,
      property_type: form.property_type,
      price:        Number(form.price),
      city:         form.city,
      neighborhood: form.neighborhood.trim(),
      bedrooms:     form.bedrooms !== '' ? Number(form.bedrooms) : null,
      bathrooms:    form.bathrooms !== '' ? Number(form.bathrooms) : null,
      area:         form.area !== '' ? Number(form.area) : null,
      description:  form.description.trim(),
      amenities:    form.amenities,
      images:       uploadedImages,
      agent_name:   form.name.trim(),
      agent_phone:  form.phone.trim(),
      agent_email:  form.email.trim(),
      verified:     false,
      featured:     false,
      lat:          coords?.lat || null,
      lng:          coords?.lng || null,
    }])

    setSubmitting(false)
    if (!error) setDone(true)
    else alert(lang === 'fr' ? 'Erreur lors de la soumission. Réessayez.' : 'Submission failed. Please try again.')
  }

  // ── Error field component ──
  const ErrMsg = ({ field }) => errors[field]
    ? <span style={{fontSize:11,color:'#f87171',marginTop:2,display:'block'}}>{errors[field]}</span>
    : null

  if (done) {
    return (
      <div className={styles.success}>
        <div className={`${styles.successCard} glass`}>
          <CheckCircle size={56} color="var(--success)" />
          <h2>{t.list.success}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, textAlign: 'center', maxWidth: 320 }}>
            {lang==='fr'
              ? 'Notre équipe examinera votre annonce sous 24h. Vous serez contacté(e) par email ou téléphone.'
              : 'Our team will review your listing within 24h and contact you by email or phone.'}
          </p>
          <button className={styles.btnPrimary} onClick={() => {
            setDone(false); setStep(1); setUploadedImages([]); setErrors({})
            setForm({title:'',property_type:'',listing_type:'rent',description:'',city:'',neighborhood:'',price:'',bedrooms:'',bathrooms:'',area:'',amenities:[],name:'',phone:'',email:''})
          }}>
            {lang==='fr' ? 'Publier une autre annonce' : 'List another property'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t.list.title}</h1>
          <p className={styles.sub}>{t.list.subtitle}</p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {[1,2,3].map(n => (
            <div key={n} className={`${styles.step} ${step >= n ? styles.stepActive : ''} ${step > n ? styles.stepDone : ''}`}>
              <div className={styles.stepNum}>{step > n ? '✓' : n}</div>
              <span>{n === 1 ? t.list.step1 : n === 2 ? t.list.step2 : t.list.step3}</span>
            </div>
          ))}
        </div>

        <form className={`${styles.form} glass`} onSubmit={handleSubmit}>

          {/* STEP 1 */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.formGroup}>
                <label>{t.list.prop_title} *</label>
                <input type="text" placeholder={t.list.prop_title_ph} value={form.title} onChange={e=>set('title',e.target.value)}
                  style={{borderColor: errors.title ? '#f87171' : ''}} />
                <ErrMsg field="title"/>
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label>{t.list.prop_type} *</label>
                  <select value={form.property_type} onChange={e=>set('property_type',e.target.value)}
                    style={{borderColor: errors.property_type ? '#f87171' : ''}}>
                    <option value="">{t.filters.any}</option>
                    {PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{t.prop_types[pt]||pt}</option>)}
                  </select>
                  <ErrMsg field="property_type"/>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.listing_type} *</label>
                  <select value={form.listing_type} onChange={e=>set('listing_type',e.target.value)}>
                    <option value="rent">{t.types.rent}</option>
                    <option value="buy">{t.types.buy}</option>
                    <option value="sell">{t.types.sell}</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.description} *</label>
                <textarea rows={5} placeholder={t.list.description_ph} value={form.description} onChange={e=>set('description',e.target.value)}
                  style={{borderColor: errors.description ? '#f87171' : ''}} />
                <ErrMsg field="description"/>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:2}}>{form.description.length}/1000</span>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.amenities}</label>
                <div className={styles.amenityGrid}>
                  {AMENITY_OPTIONS.map(a => (
                    <button key={a} type="button"
                      className={`${styles.amenityChip} ${form.amenities.includes(a) ? styles.amenityActive : ''}`}
                      onClick={() => toggleAmenity(a)}>
                      {al[a] || a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label>{t.list.city} *</label>
                  <select value={form.city} onChange={e=>set('city',e.target.value)}
                    style={{borderColor: errors.city ? '#f87171' : ''}}>
                    <option value="">{t.filters.any}</option>
                    {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <ErrMsg field="city"/>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.neighborhood}</label>
                  <input type="text" placeholder={t.list.neighborhood_ph} value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.price} (FCFA) *</label>
                <input type="number" placeholder="ex: 150000" value={form.price} onChange={e=>set('price',e.target.value)} min="1"
                  style={{borderColor: errors.price ? '#f87171' : ''}} />
                <ErrMsg field="price"/>
              </div>

              <div className={styles.row3}>
                <div className={styles.formGroup}>
                  <label>{t.list.bedrooms}</label>
                  <select value={form.bedrooms} onChange={e=>set('bedrooms',e.target.value)}>
                    <option value="">—</option>
                    {['0','1','2','3','4','5','6'].map(b=><option key={b} value={b}>{b === '0' ? 'Studio' : b}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.bathrooms}</label>
                  <select value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)}>
                    <option value="">—</option>
                    {['1','2','3','4','5'].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.area} (m²)</label>
                  <input type="number" placeholder="ex: 120" value={form.area} onChange={e=>set('area',e.target.value)} min="1"
                    style={{borderColor: errors.area ? '#f87171' : ''}} />
                  <ErrMsg field="area"/>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.formGroup}>
                <label>{t.list.photos}</label>
                <div className={styles.uploadArea}>
                  <Upload size={32} color="var(--text-muted)" />
                  <p>{t.list.photos_hint}</p>
                  {uploadProgress && <p style={{fontSize:13,color:'var(--accent)'}}>{uploadProgress}</p>}
                  {uploadedImages.length > 0 && <p style={{fontSize:13,color:'#34d399'}}>✅ {uploadedImages.length} {lang==='fr'?'photo(s) téléchargée(s)':'photo(s) uploaded'}</p>}
                  <input type="file" multiple accept="image/*" style={{ display:'none' }} id="photos" onChange={handleImageUpload} />
                  <label htmlFor="photos" className={styles.uploadBtn}>
                    {lang==='fr' ? 'Choisir des photos' : 'Choose photos'}
                  </label>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label>{t.list.name} *</label>
                  <input type="text" value={form.name} onChange={e=>set('name',e.target.value)}
                    style={{borderColor: errors.name ? '#f87171' : ''}} />
                  <ErrMsg field="name"/>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.phone} *</label>
                  <input type="tel" placeholder="+237 6XX XXX XXX" value={form.phone} onChange={e=>set('phone',e.target.value)}
                    style={{borderColor: errors.phone ? '#f87171' : ''}} />
                  <ErrMsg field="phone"/>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.email}</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)}
                  style={{borderColor: errors.email ? '#f87171' : ''}} />
                <ErrMsg field="email"/>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className={styles.navBtns}>
            {step > 1 && (
              <button type="button" className={styles.btnBack} onClick={() => setStep(s => s - 1)}>
                {t.list.back}
              </button>
            )}
            {step < 3 ? (
              <button type="button" className={styles.btnNext} onClick={handleNext}>
                {t.list.next} <ChevronRight size={16}/>
              </button>
            ) : (
              <button type="submit" className={styles.btnNext} disabled={submitting}>
                {submitting ? t.list.submitting : t.list.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
