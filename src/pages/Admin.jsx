import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, LogOut, Home, Lock } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { mockProperties, formatPrice } from '../data/mockData'
import { supabase } from '../lib/supabase'
import styles from './Admin.module.css'

const ADMIN_PASSWORD = 'loko2025admin'

export default function Admin() {
  const { lang } = useLang()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('loko_admin') === 'true')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [listings, setListings] = useState([
    ...mockProperties.map(p => ({ ...p, agent_name: p.agent?.name, agent_phone: p.agent?.phone }))
  ])

  useEffect(() => {
    if (!authed) return
    supabase.from('properties').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setListings(data)
      })
  }, [authed])
  const [filter, setFilter] = useState('pending')
  const [selected, setSelected] = useState(null)

  const login = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('loko_admin', 'true'); setAuthed(true); setPwError(false) }
    else setPwError(true)
  }
  const logout = () => { sessionStorage.removeItem('loko_admin'); setAuthed(false) }
  const approve = async (id) => {
    await supabase.from('properties').update({ verified: true }).eq('id', id)
    setListings(ls => ls.map(l => l.id === id ? { ...l, verified: true } : l))
    setSelected(null)
  }

  const reject = async (id) => {
    await supabase.from('properties').delete().eq('id', id)
    setListings(ls => ls.filter(l => l.id !== id))
    setSelected(null)
  }

  const feature = async (id) => {
    const listing = listings.find(l => l.id === id)
    const newFeatured = !listing.featured
    await supabase.from('properties').update({ featured: newFeatured }).eq('id', id)
    setListings(ls => ls.map(l => l.id === id ? { ...l, featured: newFeatured } : l))
  }

  const filtered = listings.filter(l => filter === 'pending' ? !l.verified : filter === 'approved' ? l.verified : true)
  const pending = listings.filter(l => !l.verified).length
  const approved = listings.filter(l => l.verified).length
  const typeLabel = { rent: 'For Rent', buy: 'For Sale', sell: 'To Sell' }
  const typeColor = { rent: '#4f9eff', buy: '#e8c97a', sell: '#34d399' }

  if (!authed) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20,background:'#080c14'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:24,padding:'48px 40px',width:'100%',maxWidth:380,display:'flex',flexDirection:'column',alignItems:'center',gap:14,textAlign:'center',backdropFilter:'blur(20px)'}}>
        <div style={{width:56,height:56,background:'rgba(79,158,255,0.15)',border:'1px solid rgba(79,158,255,0.3)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',color:'#4f9eff'}}><Lock size={28}/></div>
        <h1 style={{fontFamily:'serif',fontSize:28,color:'white'}}>Admin Access</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.55)'}}>LoKo.com — Property Management</p>
        <input type="password" placeholder="Enter admin password" value={pw}
          onChange={e=>{setPw(e.target.value);setPwError(false)}}
          onKeyDown={e=>e.key==='Enter'&&login()}
          style={{width:'100%',padding:'12px 16px',background:'rgba(255,255,255,0.06)',border:`1px solid ${pwError?'#f87171':'rgba(255,255,255,0.16)'}`,borderRadius:10,color:'white',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
        {pwError && <p style={{fontSize:13,color:'#f87171',marginTop:-6}}>Incorrect password</p>}
        <button onClick={login} style={{width:'100%',padding:13,background:'#4f9eff',color:'white',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Sign In</button>
        <a href="/" style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'rgba(255,255,255,0.45)'}}>
          <Home size={13}/> Back to site
        </a>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#080c14',color:'white'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 32px',borderBottom:'1px solid rgba(255,255,255,0.10)',background:'rgba(8,12,20,0.90)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#4f9eff,#7cb9ff)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'serif',fontSize:20,color:'white'}}>L</div>
          <div>
            <div style={{fontFamily:'serif',fontSize:20}}>Admin Dashboard</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>LoKo.com — Property Management</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.80)',fontSize:13,fontWeight:600,textDecoration:'none'}}>
            <Home size={14}/> View Site
          </a>
          <button onClick={logout} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:8,background:'rgba(248,113,113,0.12)',border:'1px solid rgba(248,113,113,0.25)',color:'#f87171',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </div>

      <div style={{padding:32,maxWidth:1280,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
          {[{n:listings.length,l:'Total Listings',c:'white'},{n:pending,l:'Pending Review',c:'#fbbf24'},{n:approved,l:'Approved & Live',c:'#34d399'},{n:listings.filter(l=>l.featured).length,l:'Featured',c:'#e8c97a'}].map(s=>(
            <div key={s.l} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,padding:'20px 24px',backdropFilter:'blur(20px)'}}>
              <div style={{fontFamily:'serif',fontSize:32,color:s.c}}>{s.n}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.50)',fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase'}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:4,marginBottom:20}}>
          {[{k:'pending',l:`Pending (${pending})`},{k:'approved',l:`Approved (${approved})`},{k:'all',l:`All (${listings.length})`}].map(tab=>(
            <button key={tab.k} onClick={()=>setFilter(tab.k)}
              style={{padding:'9px 18px',borderRadius:8,background:filter===tab.k?'rgba(79,158,255,0.12)':'rgba(255,255,255,0.05)',border:`1px solid ${filter===tab.k?'rgba(79,158,255,0.3)':'rgba(255,255,255,0.10)'}`,color:filter===tab.k?'#4f9eff':'rgba(255,255,255,0.60)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              {tab.l}
            </button>
          ))}
        </div>

        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.10)',borderRadius:16,overflow:'hidden',backdropFilter:'blur(20px)'}}>
          {filtered.length === 0 ? (
            <div style={{padding:60,display:'flex',flexDirection:'column',alignItems:'center',gap:12,color:'rgba(255,255,255,0.45)',fontSize:14}}>
              <CheckCircle size={40} color="#34d399"/><p>No listings here.</p>
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.10)'}}>
                  {['Property','Type','Price','Agent','Date','Status','Actions'].map(h=>(
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:11,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:'rgba(255,255,255,0.40)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l=>(
                  <tr key={l.id} style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <td style={{padding:'14px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        {l.images?.[0] && <img src={l.images[0]} alt="" style={{width:50,height:38,borderRadius:7,objectFit:'cover',flexShrink:0}} onError={e=>e.target.style.display='none'}/>}
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.92)',marginBottom:2}}>{l.title}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.45)'}}>📍 {l.neighborhood?`${l.neighborhood}, `:''}{l.city}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'14px 16px'}}>
                      <span style={{padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:700,color:typeColor[l.listing_type],border:`1px solid ${typeColor[l.listing_type]}55`}}>{typeLabel[l.listing_type]}</span>
                    </td>
                    <td style={{padding:'14px 16px',fontFamily:'serif',fontSize:14,color:'#6db8ff',whiteSpace:'nowrap'}}>{formatPrice(l.price,l.listing_type,lang)}</td>
                    <td style={{padding:'14px 16px'}}>
                      <div style={{fontSize:13,color:'rgba(255,255,255,0.82)'}}>{l.agent_name||l.agent?.name||'—'}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.45)'}}>{l.agent_phone||l.agent?.phone||'—'}</div>
                    </td>
                    <td style={{padding:'14px 16px',fontSize:12,color:'rgba(255,255,255,0.50)',whiteSpace:'nowrap'}}>{new Date(l.created_at).toLocaleDateString('en-GB')}</td>
                    <td style={{padding:'14px 16px'}}>
                      {l.verified
                        ? <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:'rgba(52,211,153,0.15)',color:'#34d399',border:'1px solid rgba(52,211,153,0.3)'}}>✓ Live</span>
                        : <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:'rgba(251,191,36,0.15)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.3)'}}>⏳ Pending</span>
                      }
                      {l.featured && <span style={{marginLeft:5,fontSize:13}}>⭐</span>}
                    </td>
                    <td style={{padding:'14px 16px'}}>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <button onClick={()=>setSelected(l)} title="Preview" style={{width:30,height:30,borderRadius:7,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.70)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><Eye size={14}/></button>
                        {!l.verified && <button onClick={()=>approve(l.id)} style={{display:'flex',alignItems:'center',gap:5,padding:'6px 10px',borderRadius:7,background:'rgba(52,211,153,0.15)',border:'1px solid rgba(52,211,153,0.35)',color:'#34d399',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}><CheckCircle size={13}/> Approve</button>}
                        <button onClick={()=>feature(l.id)} title="Toggle featured" style={{width:30,height:30,borderRadius:7,background:'rgba(232,201,122,0.10)',border:'1px solid rgba(232,201,122,0.25)',color:'#e8c97a',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{l.featured?'★':'☆'}</button>
                        <button onClick={()=>reject(l.id)} title="Delete" style={{width:30,height:30,borderRadius:7,background:'rgba(248,113,113,0.10)',border:'1px solid rgba(248,113,113,0.25)',color:'#f87171',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><XCircle size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'rgba(13,20,32,0.95)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:24,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto',position:'relative',backdropFilter:'blur(20px)'}}>
            <button onClick={()=>setSelected(null)} style={{position:'absolute',top:14,right:14,width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.10)',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.80)',fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1}}>✕</button>
            {selected.images?.[0] && <img src={selected.images[0]} alt="" style={{width:'100%',height:220,objectFit:'cover',borderRadius:'24px 24px 0 0',display:'block'}} onError={e=>e.target.style.display='none'}/>}
            <div style={{padding:24}}>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <span style={{padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:700,color:typeColor[selected.listing_type],border:`1px solid ${typeColor[selected.listing_type]}55`}}>{typeLabel[selected.listing_type]}</span>
                {selected.verified
                  ? <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:'rgba(52,211,153,0.15)',color:'#34d399',border:'1px solid rgba(52,211,153,0.3)'}}>✓ Live</span>
                  : <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:'rgba(251,191,36,0.15)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.3)'}}>⏳ Pending</span>
                }
              </div>
              <h2 style={{fontFamily:'serif',fontSize:22,marginBottom:6}}>{selected.title}</h2>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.55)',marginBottom:8}}>📍 {selected.neighborhood?`${selected.neighborhood}, `:''}{selected.city}</p>
              <p style={{fontFamily:'serif',fontSize:22,color:'#6db8ff',marginBottom:14}}>{formatPrice(selected.price,selected.listing_type,lang)}</p>
              <p style={{fontSize:13,color:'rgba(255,255,255,0.75)',lineHeight:1.7,marginBottom:14}}>{selected.description}</p>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.50)',marginBottom:20,display:'flex',flexDirection:'column',gap:4}}>
                <span>Agent: {selected.agent_name||selected.agent?.name}</span>
                <span>Tel: {selected.agent_phone||selected.agent?.phone}</span>
              </div>
              {!selected.verified && (
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>approve(selected.id)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:13,borderRadius:10,background:'rgba(52,211,153,0.15)',border:'1px solid rgba(52,211,153,0.35)',color:'#34d399',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    <CheckCircle size={15}/> Approve & Publish
                  </button>
                  <button onClick={()=>reject(selected.id)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:13,borderRadius:10,background:'rgba(248,113,113,0.12)',border:'1px solid rgba(248,113,113,0.30)',color:'#f87171',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
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
