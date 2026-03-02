const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

export default function Tech({ r }) {
  return (
    <div style={{ fontFamily:"'Courier New',monospace", width:794, minHeight:1122, background:'#0f172a', color:'#e2e8f0', padding:'48px 52px' }}>

      {/* Header */}
      <div style={{ borderBottom:'1px solid #1e293b', paddingBottom:20, marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ color:'#38bdf8', fontSize:10, letterSpacing:3, textTransform:'uppercase', marginBottom:5 }}>// profile</div>
          <h1 style={{ fontSize:30, fontWeight:900, color:'#f1f5f9', margin:0 }}>{r.name}</h1>
          {r.summary && <p style={{ fontSize:10, color:'#94a3b8', marginTop:6, maxWidth:400, lineHeight:1.6 }}>{r.summary}</p>}
        </div>
        {r.photo && <img src={r.photo} alt="" style={{ width:80, height:80, borderRadius:8, objectFit:'cover', border:'2px solid #38bdf8' }} />}
      </div>

      {/* Contact bar */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 16px', marginBottom:24, padding:'10px 14px', background:'#1e293b', borderRadius:8 }}>
        {[r.email&&`> ${r.email}`, r.phone&&`> ${r.phone}`, r.github&&`> ${r.github}`, r.linkedin&&`> ${r.linkedin}`].filter(Boolean).map((c,i)=>(
          <span key={i} style={{ fontSize:9, color:'#38bdf8' }}>{c}</span>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:24 }}>
        <div>
          {r.skills && <div style={{ marginBottom:20 }}>
            <div style={{ color:'#f59e0b', fontSize:9, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>// skills</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {r.skills.split(/[,，]/).map((s,i)=>(
                <span key={i} style={{ background:'#1e293b', border:'1px solid #334155', color:'#7dd3fc', padding:'2px 8px', borderRadius:4, fontSize:9 }}>{s.trim()}</span>
              ))}
            </div>
          </div>}

          {r.education && <div style={{ marginBottom:20 }}>
            <div style={{ color:'#f59e0b', fontSize:9, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>// education</div>
            {B(r.education).map((b,i)=>(
              <div key={i} style={{ marginBottom:10, borderLeft:'2px solid #334155', paddingLeft:10 }}>
                {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?10:9, color:j===0?'#e2e8f0':'#94a3b8', margin:'2px 0', fontWeight:j===0?700:400 }}>{l}</p>)}
              </div>
            ))}
          </div>}

          {r.languages && <div>
            <div style={{ color:'#f59e0b', fontSize:9, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>// languages</div>
            {r.languages.split(/[,，]/).map((l,i)=><p key={i} style={{ fontSize:9.5, color:'#94a3b8', margin:'3px 0' }}>{l.trim()}</p>)}
          </div>}
        </div>

        <div>
          {r.experience && <div style={{ marginBottom:20 }}>
            <div style={{ color:'#f59e0b', fontSize:9, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>// experience</div>
            {B(r.experience).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:14, borderLeft:'2px solid #38bdf8', paddingLeft:10 }}>
                <p style={{ color:'#38bdf8', fontWeight:700, fontSize:11, margin:'0 0 4px' }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:9.5, color:'#94a3b8', margin:'2px 0' }}>{'> '}{l.replace(/^[-•]\s*/,'')}</p>)}
              </div>
            })}
          </div>}

          {r.projects && <div>
            <div style={{ color:'#f59e0b', fontSize:9, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>// projects</div>
            {B(r.projects).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:12, borderLeft:'2px solid #a78bfa', paddingLeft:10 }}>
                <p style={{ color:'#a78bfa', fontWeight:700, fontSize:11, margin:'0 0 4px' }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:9.5, color:'#94a3b8', margin:'2px 0' }}>{'> '}{l.replace(/^[-•]\s*/,'')}</p>)}
              </div>
            })}
          </div>}
        </div>
      </div>
    </div>
  )
}