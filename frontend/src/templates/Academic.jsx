const B = (t) => (t||'').split(/\n\n+/).filter(Boolean)
const L = (t) => (t||'').split('\n').filter(Boolean)

function H({ title }) {
  return <h2 style={{ fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1, borderBottom:'1px solid #ccc', paddingBottom:4, marginBottom:10 }}>{title}</h2>
}

export default function Academic({ r }) {
  return (
    <div style={{ fontFamily:"'Times New Roman',serif", width:794, minHeight:1122, background:'#fff', padding:'56px 64px', color:'#1a1a1a' }}>

      {/* Centered header */}
      <div style={{ textAlign:'center', borderBottom:'2px solid #1a1a1a', paddingBottom:18, marginBottom:24 }}>
        {r.photo && <img src={r.photo} alt="" style={{ width:70, height:70, borderRadius:'50%', objectFit:'cover', border:'2px solid #1a1a1a', marginBottom:8 }} />}
        <h1 style={{ fontSize:26, fontWeight:900, margin:0, textTransform:'uppercase', letterSpacing:2 }}>{r.name}</h1>
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:8, flexWrap:'wrap' }}>
          {[r.email, r.phone, r.address, r.linkedin].filter(Boolean).map((v,i)=>(
            <span key={i} style={{ fontSize:10 }}>{v}</span>
          ))}
        </div>
      </div>

      {r.summary && <div style={{ marginBottom:20 }}><H title="Summary" /><p style={{ fontSize:10.5, lineHeight:1.8, textAlign:'justify' }}>{r.summary}</p></div>}

      {r.education && <div style={{ marginBottom:20 }}>
        <H title="Education" />
        {B(r.education).map((b,i)=>(
          <div key={i} style={{ marginBottom:10 }}>
            {L(b).map((l,j)=><p key={j} style={{ fontSize:j===0?11:10, fontWeight:j===0?700:400, margin:'2px 0', fontStyle:j>0?'italic':'normal' }}>{l}</p>)}
          </div>
        ))}
      </div>}

      {r.experience && <div style={{ marginBottom:20 }}>
        <H title="Experience" />
        {B(r.experience).map((b,i)=>{
          const ls=L(b)
          return <div key={i} style={{ marginBottom:12 }}>
            <p style={{ fontWeight:700, fontSize:11, margin:0 }}>{ls[0]}</p>
            {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, margin:'2px 0 2px 16px', lineHeight:1.6 }}>• {l.replace(/^[-•]\s*/,'')}</p>)}
          </div>
        })}
      </div>}

      {r.skills && <div style={{ marginBottom:20 }}><H title="Skills & Competencies" /><p style={{ fontSize:10.5, lineHeight:1.8 }}>{r.skills}</p></div>}

      {r.projects && <div style={{ marginBottom:20 }}>
        <H title="Research & Projects" />
        {B(r.projects).map((b,i)=>{
          const ls=L(b)
          return <div key={i} style={{ marginBottom:10 }}>
            <p style={{ fontWeight:700, fontSize:11, margin:0 }}>{ls[0]}</p>
            {ls.slice(1).map((l,j)=><p key={j} style={{ fontSize:10, margin:'2px 0 2px 16px' }}>• {l.replace(/^[-•]\s*/,'')}</p>)}
          </div>
        })}
      </div>}

      {r.languages && <div><H title="Languages" /><p style={{ fontSize:10.5 }}>{r.languages}</p></div>}
    </div>
  )
}