const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

export default function Startup({ r }) {
  return (
    <div style={{ fontFamily:"'Arial',sans-serif", width:794, minHeight:1122, background:'#fff' }}>

      {/* Top banner */}
      <div style={{ background:'linear-gradient(135deg,#f97316 0%,#ef4444 100%)', padding:'36px 48px 28px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h1 style={{ fontSize:30, fontWeight:900, margin:0 }}>{r.name}</h1>
            {r.summary && <p style={{ fontSize:10, marginTop:6, opacity:.9, maxWidth:420, lineHeight:1.5 }}>{r.summary}</p>}
          </div>
          {r.photo && <img src={r.photo} alt="" style={{ width:80, height:80, borderRadius:12, objectFit:'cover', border:'3px solid rgba(255,255,255,0.45)' }} />}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 16px', marginTop:14 }}>
          {[r.email, r.phone, r.address, r.linkedin, r.github].filter(Boolean).map((v,i)=>(
            <span key={i} style={{ fontSize:9.5, opacity:.9 }}>{v}</span>
          ))}
        </div>
      </div>

      <div style={{ padding:'28px 48px', display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:24 }}>
        <div>
          {r.skills && <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:10, fontWeight:800, color:'#f97316', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Skills</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {r.skills.split(/[,，]/).map((s,i)=>(
                <span key={i} style={{ background:'#fff7ed', color:'#c2410c', padding:'2px 8px', borderRadius:20, fontSize:9.5, fontWeight:600 }}>{s.trim()}</span>
              ))}
            </div>
          </div>}
          {r.education && <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:10, fontWeight:800, color:'#f97316', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Education</h2>
            {B(r.education).map((b,i)=>(
              <div key={i} style={{ marginBottom:10, borderLeft:'3px solid #fed7aa', paddingLeft:10 }}>
                {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?10.5:9.5, fontWeight:j===0?700:400, color:j===0?'#1f2937':'#6b7280', margin:'1px 0' }}>{l}</p>)}
              </div>
            ))}
          </div>}
          {r.languages && <div>
            <h2 style={{ fontSize:10, fontWeight:800, color:'#f97316', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Languages</h2>
            {r.languages.split(/[,，]/).map((l,i)=><p key={i} style={{ fontSize:10, margin:'3px 0' }}>{l.trim()}</p>)}
          </div>}
        </div>

        <div>
          {r.experience && <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:10, fontWeight:800, color:'#f97316', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Experience</h2>
            {B(r.experience).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:14, borderLeft:'3px solid #f97316', paddingLeft:12 }}>
                <p style={{ fontWeight:700, fontSize:11, color:'#f97316', margin:0 }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
              </div>
            })}
          </div>}
          {r.projects && <div>
            <h2 style={{ fontSize:10, fontWeight:800, color:'#f97316', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>Projects</h2>
            {B(r.projects).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:12, borderLeft:'3px solid #fed7aa', paddingLeft:12 }}>
                <p style={{ fontWeight:700, fontSize:11, color:'#ea580c', margin:0 }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0' }}>▸ {l.replace(/^[-•]\s*/,'')}</p>)}
              </div>
            })}
          </div>}
        </div>
      </div>
    </div>
  )
}