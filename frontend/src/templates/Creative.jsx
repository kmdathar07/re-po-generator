const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

export default function Creative({ r }) {
  return (
    <div style={{ fontFamily:"'Arial',sans-serif", width:794, minHeight:1122, background:'#18181b', color:'#fafafa', display:'grid', gridTemplateColumns:'220px 1fr' }}>

      {/* Yellow sidebar */}
      <div style={{ background:'#f59e0b', padding:'44px 20px', minHeight:1122 }}>
        {r.photo
          ? <img src={r.photo} alt="" style={{ width:100, height:100, borderRadius:12, objectFit:'cover', border:'4px solid #fff', marginBottom:16, display:'block' }} />
          : <div style={{ width:100, height:100, borderRadius:12, background:'#fff', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, color:'#f59e0b' }}>
              {(r.name||'?').split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>}
        <h1 style={{ fontSize:20, fontWeight:900, color:'#18181b', margin:'0 0 4px', lineHeight:1.2 }}>{r.name}</h1>
        <div style={{ height:3, background:'#18181b', width:40, marginBottom:16 }} />
        {[r.email, r.phone, r.address].filter(Boolean).map((v,i)=>(
          <p key={i} style={{ fontSize:9, color:'#18181b', margin:'4px 0', wordBreak:'break-all' }}>{v}</p>
        ))}

        {r.skills && <div style={{ marginTop:18 }}>
          <p style={{ fontSize:8, fontWeight:800, letterSpacing:2, color:'#18181b', opacity:.7, textTransform:'uppercase', marginBottom:6 }}>Skills</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {r.skills.split(/[,，]/).map((s,i)=>(
              <span key={i} style={{ background:'rgba(0,0,0,0.14)', padding:'2px 7px', borderRadius:3, fontSize:9, fontWeight:700, color:'#18181b' }}>{s.trim()}</span>
            ))}
          </div>
        </div>}

        {r.education && <div style={{ marginTop:18 }}>
          <p style={{ fontSize:8, fontWeight:800, letterSpacing:2, color:'#18181b', opacity:.7, textTransform:'uppercase', marginBottom:6 }}>Education</p>
          {B(r.education).map((b,i)=>(
            <div key={i} style={{ marginBottom:8 }}>
              {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?10:9, fontWeight:j===0?800:400, color:'#18181b', margin:'1px 0' }}>{l}</p>)}
            </div>
          ))}
        </div>}

        {r.languages && <div style={{ marginTop:18 }}>
          <p style={{ fontSize:8, fontWeight:800, letterSpacing:2, color:'#18181b', opacity:.7, textTransform:'uppercase', marginBottom:6 }}>Languages</p>
          {r.languages.split(/[,，]/).map((l,i)=><p key={i} style={{ fontSize:9.5, color:'#18181b', margin:'3px 0' }}>{l.trim()}</p>)}
        </div>}

        {[r.linkedin, r.github, r.website].filter(Boolean).length > 0 && <div style={{ marginTop:18 }}>
          <p style={{ fontSize:8, fontWeight:800, letterSpacing:2, color:'#18181b', opacity:.7, textTransform:'uppercase', marginBottom:6 }}>Links</p>
          {[r.linkedin, r.github, r.website].filter(Boolean).map((v,i)=>(
            <p key={i} style={{ fontSize:8.5, color:'#18181b', margin:'3px 0', wordBreak:'break-all' }}>{v}</p>
          ))}
        </div>}
      </div>

      {/* Dark main */}
      <div style={{ padding:'40px 30px' }}>
        {r.summary && <div style={{ marginBottom:24, padding:'14px 18px', background:'#27272a', borderLeft:'4px solid #f59e0b', borderRadius:'0 8px 8px 0' }}>
          <p style={{ fontSize:10.5, color:'#d4d4d8', lineHeight:1.7, margin:0 }}>{r.summary}</p>
        </div>}

        {r.experience && <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:8, color:'#f59e0b', fontWeight:800, letterSpacing:2.5, textTransform:'uppercase', marginBottom:12 }}>Experience</div>
          {B(r.experience).map((b,i)=>{
            const ls=L(b)
            return <div key={i} style={{ marginBottom:14, borderLeft:'2px solid #f59e0b', paddingLeft:12 }}>
              <p style={{ fontWeight:700, fontSize:11, color:'#f59e0b', margin:0 }}>{ls[0]}</p>
              {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:9.5, color:'#a1a1aa', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
            </div>
          })}
        </div>}

        {r.projects && <div>
          <div style={{ fontSize:8, color:'#f59e0b', fontWeight:800, letterSpacing:2.5, textTransform:'uppercase', marginBottom:12 }}>Projects</div>
          {B(r.projects).map((b,i)=>{
            const ls=L(b)
            return <div key={i} style={{ marginBottom:12, background:'#27272a', borderRadius:8, padding:'10px 14px' }}>
              <p style={{ fontWeight:700, fontSize:11, color:'#fafafa', margin:'0 0 5px' }}>{ls[0]}</p>
              {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:9.5, color:'#71717a', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
            </div>
          })}
        </div>}
      </div>
    </div>
  )
}