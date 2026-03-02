const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

function H({ title }) {
  return <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #111', paddingBottom:3, marginBottom:8 }}>{title}</div>
}

export default function MinimalATS({ r }) {
  return (
    <div style={{ fontFamily:"'Arial',sans-serif", width:794, minHeight:1122, background:'#fff', padding:'56px 64px', color:'#111' }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:900, margin:'0 0 6px', letterSpacing:-0.5 }}>{r.name}</h1>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'3px 18px' }}>
          {[r.email, r.phone, r.address, r.linkedin, r.github, r.website].filter(Boolean).map((v,i)=>(
            <span key={i} style={{ fontSize:10, color:'#333' }}>{v}</span>
          ))}
        </div>
        {r.summary && <p style={{ marginTop:10, fontSize:10.5, lineHeight:1.8, color:'#222', maxWidth:560 }}>{r.summary}</p>}
      </div>

      {r.skills && <div style={{ marginBottom:20 }}><H title="Skills" /><p style={{ fontSize:10.5, lineHeight:1.8, margin:0 }}>{r.skills}</p></div>}

      {r.experience && <div style={{ marginBottom:20 }}>
        <H title="Experience" />
        {B(r.experience).map((b,i)=>{
          const ls=L(b)
          return <div key={i} style={{ marginBottom:14 }}>
            <p style={{ fontWeight:700, fontSize:11, margin:'0 0 3px' }}>{ls[0]}</p>
            {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10.5, margin:'2px 0 2px 14px', lineHeight:1.6 }}>• {l.replace(/^[-•]\s*/,'')}</p>)}
          </div>
        })}
      </div>}

      {r.education && <div style={{ marginBottom:20 }}>
        <H title="Education" />
        {B(r.education).map((b,i)=>(
          <div key={i} style={{ marginBottom:10 }}>
            {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?11:10, fontWeight:j===0?700:400, margin:'1px 0' }}>{l}</p>)}
          </div>
        ))}
      </div>}

      {r.projects && <div style={{ marginBottom:20 }}>
        <H title="Projects" />
        {B(r.projects).map((b,i)=>{
          const ls=L(b)
          return <div key={i} style={{ marginBottom:12 }}>
            <p style={{ fontWeight:700, fontSize:11, margin:'0 0 3px' }}>{ls[0]}</p>
            {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10.5, margin:'2px 0 2px 14px', lineHeight:1.6 }}>• {l.replace(/^[-•]\s*/,'')}</p>)}
          </div>
        })}
      </div>}

      {r.languages && <div><H title="Languages" /><p style={{ fontSize:10.5 }}>{r.languages}</p></div>}
    </div>
  )
}