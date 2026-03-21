import { useState } from 'react'
import { CheckCircle, Upload, ChevronRight } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { CITIES, PROPERTY_TYPES } from '../data/mockData'
import { supabase } from '../lib/supabase'
import styles from './ListProperty.module.css'

const AMENITY_OPTIONS = ['Pool','Generator','Security','Parking','AC','Garden','Furnished','WiFi','Fiber Internet','Meeting Rooms','Smart Home','Title Deed','Seafront','Road Access']

export default function ListProperty() {
  const { t, lang } = useLang()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    title: '', property_type: '', listing_type: 'rent', description: '',
    city: '', neighborhood: '', price: '', bedrooms: '', bathrooms: '', area: '',
    amenities: [], name: '', phone: '', email: ''
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const toggleAmenity = (a) => set('amenities', form.amenities.includes(a) ? form.amenities.filter(x=>x!==a) : [...form.amenities, a])

  const aLabels = {
    en: { Pool:'Pool', Generator:'Generator', Security:'Security', Parking:'Parking', AC:'A/C', Garden:'Garden', Furnished:'Furnished', WiFi:'WiFi', 'Fiber Internet':'Fiber', 'Meeting Rooms':'Meeting Rooms', 'Smart Home':'Smart Home', 'Title Deed':'Title Deed', Seafront:'Seafront', 'Road Access':'Road Access' },
    fr: { Pool:'Piscine', Generator:'Groupe élec.', Security:'Sécurité', Parking:'Parking', AC:'Clim', Garden:'Jardin', Furnished:'Meublé', WiFi:'WiFi', 'Fiber Internet':'Fibre', 'Meeting Rooms':'Salles réunion', 'Smart Home':'Maison connectée', 'Title Deed':'Titre foncier', Seafront:'Bord de mer', 'Road Access':'Accès route' }
  }
  const al = aLabels[lang] || aLabels.fr

  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 10)
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-image').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('property-image').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    setUploadedImages(urls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('properties').insert([{
      title: form.title,
      listing_type: form.listing_type,
      property_type: form.property_type,
      price: Number(form.price),
      city: form.city,
      neighborhood: form.neighborhood,
      bedrooms: form.bedrooms !== '' ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms !== '' ? Number(form.bathrooms) : null,
      area: form.area !== '' ? Number(form.area) : null,
      description: form.description,
      amenities: form.amenities,
      images: uploadedImages,
      agent_name: form.name,
      agent_phone: form.phone,
      agent_email: form.email,
      verified: false,
      featured: false,
    }])
    setSubmitting(false)
    if (!error) setDone(true)
    else alert('Submission failed. Please try again.')
  }

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
          <button className={styles.btnPrimary} onClick={() => { setDone(false); setStep(1); setForm({title:'',property_type:'',listing_type:'rent',description:'',city:'',neighborhood:'',price:'',bedrooms:'',bathrooms:'',area:'',amenities:[],name:'',phone:'',email:''}); }}>
            {lang==='fr' ? 'Publier une autre annonce' : 'List another property'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t.list.title}</h1>
          <p className={styles.sub}>{t.list.subtitle}</p>
        </div>

        {/* Step indicators */}
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
                <input type="text" placeholder={t.list.prop_title_ph} value={form.title} onChange={e=>set('title',e.target.value)} required />
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label>{t.list.prop_type} *</label>
                  <select value={form.property_type} onChange={e=>set('property_type',e.target.value)} required>
                    <option value="">{t.filters.any}</option>
                    {PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{t.prop_types[pt]||pt}</option>)}
                  </select>
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
                <label>{t.list.description}</label>
                <textarea rows={5} placeholder={t.list.description_ph} value={form.description} onChange={e=>set('description',e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.amenities}</label>
                <div className={styles.amenityGrid}>
                  {AMENITY_OPTIONS.map(a => (
                    <button
                      key={a} type="button"
                      className={`${styles.amenityChip} ${form.amenities.includes(a) ? styles.amenityActive : ''}`}
                      onClick={() => toggleAmenity(a)}
                    >
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
                  <select value={form.city} onChange={e=>set('city',e.target.value)} required>
                    <option value="">{t.filters.any}</option>
                    {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.neighborhood}</label>
                  <input type="text" placeholder={t.list.neighborhood_ph} value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.price} *</label>
                <input type="number" placeholder="ex: 150000" value={form.price} onChange={e=>set('price',e.target.value)} required min="0" />
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
                  <label>{t.list.area}</label>
                  <input type="number" placeholder="ex: 120" value={form.area} onChange={e=>set('area',e.target.value)} min="0" />
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
                  <input type="file" multiple accept="image/*" style={{ display:'none' }} id="photos" onChange={handleImageUpload} />
                  {uploadedImages.length > 0 && <p style={{fontSize:13,color:'#34d399'}}>✅ {uploadedImages.length} photo(s) uploaded</p>}
                  <label htmlFor="photos" className={styles.uploadBtn}>
                    {lang==='fr' ? 'Choisir des photos' : 'Choose photos'}
                  </label>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label>{t.list.name} *</label>
                  <input type="text" value={form.name} onChange={e=>set('name',e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.list.phone} *</label>
                  <input type="tel" placeholder="+237 6XX XXX XXX" value={form.phone} onChange={e=>set('phone',e.target.value)} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t.list.email}</label>
                <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={styles.navBtns}>
            {step > 1 && (
              <button type="button" className={styles.btnBack} onClick={() => setStep(s => s - 1)}>
                {t.list.back}
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className={styles.btnNext}
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && (!form.title || !form.property_type)) ||
                  (step === 2 && (!form.city || !form.price))
                }
              >
                {t.list.next} <ChevronRight size={16}/>
              </button>
            ) : (
              <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                {submitting ? t.list.submitting : t.list.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
