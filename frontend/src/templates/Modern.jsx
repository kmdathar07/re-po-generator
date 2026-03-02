const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

export default function Modern({ r }) {
  return (
    <div style={{ fontFamily:"'Helvetica Neue',sans-serif", width:794, minHeight:1122, background:'#fff', display:'grid', gridTemplateColumns:'250px 1fr' }}>

      {/* Sidebar */}
      <div style={{ background:'linear-gradient(180deg,#6366f1 0%,#8b5cf6 100%)', padding:'40px 22px', color:'#fff' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          {r.photo
            ? <img src={r.photo} alt="" style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'4px solid rgba(255,255,255,0.35)', marginBottom:12 }} />
            : <div style={{ width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.18)', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900 }}>
                {(r.name||'?').split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>}
          <h1 style={{ fontSize:19, fontWeight:900, margin:0 }}>{r.name}</h1>
        </div>

        {[
          { title:'Contact',  items:[r.email, r.phone, r.address].filter(Boolean) },
          { title:'Links',    items:[r.linkedin, r.github, r.website, r.instagram].filter(Boolean) },
          { title:'Languages',items: r.languages ? r.languages.split(/[,，]/).map(l=>l.trim()) : [] },
        ].map(({ title, items }) => items.length > 0 && (
          <div key={title} style={{ marginBottom:18 }}>
            <div style={{ fontSize:8, fontWeight:800, letterSpacing:2, textTransform:'uppercase', opacity:.7, marginBottom:6 }}>{title}</div>
            {items.map((v,i)=><p key={i} style={{ fontSize:9.5, margin:'3px 0', opacity:.9, wordBreak:'break-all' }}>{v}</p>)}
          </div>
        ))}

        {r.skills && <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:8, fontWeight:800, letterSpacing:2, textTransform:'uppercase', opacity:.7, marginBottom:6 }}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {r.skills.split(/[,，]/).map((s,i)=>(
              <span key={i} style={{ background:'rgba(255,255,255,0.2)', padding:'2px 7px', borderRadius:20, fontSize:9, fontWeight:600 }}>{s.trim()}</span>
            ))}
          </div>
        </div>}

        {r.education && <div>
          <div style={{ fontSize:8, fontWeight:800, letterSpacing:2, textTransform:'uppercase', opacity:.7, marginBottom:6 }}>Education</div>
          {B(r.education).map((b,i)=>(
            <div key={i} style={{ marginBottom:8 }}>
              {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?10:9, fontWeight:j===0?700:400, opacity:j===0?1:.8, margin:'1px 0' }}>{l}</p>)}
            </div>
          ))}
        </div>}
      </div>

      {/* Main */}
      <div style={{ padding:'40px 32px' }}>
        {r.summary && <div style={{ marginBottom:22, padding:'12px 16px', background:'#f5f3ff', borderLeft:'4px solid #6366f1', borderRadius:'0 8px 8px 0' }}>
          <p style={{ fontSize:10.5, color:'#374151', lineHeight:1.7, margin:0 }}>{r.summary}</p>
        </div>}

        {r.experience && <div style={{ marginBottom:20 }}>
          <h2 style={{ fontSize:10, fontWeight:800, color:'#6366f1', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Experience</h2>
          {B(r.experience).map((b,i)=>{
            const ls=L(b)
            return <div key={i} style={{ marginBottom:14, paddingLeft:12, borderLeft:'2px solid #e0e7ff' }}>
              <p style={{ fontWeight:700, fontSize:11, color:'#4f46e5', margin:'0 0 4px' }}>{ls[0]}</p>
              {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
            </div>
          })}
        </div>}

        {r.projects && <div>
          <h2 style={{ fontSize:10, fontWeight:800, color:'#6366f1', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Projects</h2>
          {B(r.projects).map((b,i)=>{
            const ls=L(b)
            return <div key={i} style={{ marginBottom:12, paddingLeft:12, borderLeft:'2px solid #e0e7ff' }}>
              <p style={{ fontWeight:700, fontSize:11, color:'#4f46e5', margin:'0 0 4px' }}>{ls[0]}</p>
              {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
            </div>
          })}
        </div>}
      </div>
    </div>
  )
}