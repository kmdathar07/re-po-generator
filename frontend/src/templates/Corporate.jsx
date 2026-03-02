const B = (t, sep = /\n\n+/) => (t || '').split(sep).filter(Boolean)
const L = (t) => (t || '').split('\n').filter(Boolean)

function Divider({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
      <div style={{ flex:1, height:2, background:'#1e3a5f' }} />
      <h2 style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', color:'#1e3a5f', margin:0, whiteSpace:'nowrap' }}>{title}</h2>
      <div style={{ flex:1, height:2, background:'#1e3a5f' }} />
    </div>
  )
}

export default function Corporate({ r }) {
  return (
    <div style={{ fontFamily:'Georgia, serif', width:794, minHeight:1122, background:'#fff', padding:'48px 56px', color:'#1f2937' }}>

      {/* Header */}
      <div style={{ borderBottom:'3px solid #1e3a5f', paddingBottom:20, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, color:'#1e3a5f', margin:0 }}>{r.name}</h1>
            {r.summary && <p style={{ fontSize:10.5, color:'#6b7280', marginTop:6, maxWidth:420, lineHeight:1.6 }}>{r.summary}</p>}
          </div>
          {r.photo && <img src={r.photo} alt="" style={{ width:80, height:80, borderRadius:8, objectFit:'cover', border:'3px solid #1e3a5f' }} />}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 18px', marginTop:12 }}>
          {[r.email&&`✉ ${r.email}`, r.phone&&`📞 ${r.phone}`, r.address&&`📍 ${r.address}`, r.linkedin&&`🔗 ${r.linkedin}`, r.github&&`💻 ${r.github}`].filter(Boolean).map((c,i)=>(
            <span key={i} style={{ fontSize:9.5, color:'#4b5563' }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.7fr', gap:28 }}>
        {/* Left */}
        <div>
          {r.skills && <div style={{ marginBottom:20 }}>
            <Divider title="Skills" />
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {r.skills.split(/[,，]/).map((s,i)=>(
                <span key={i} style={{ background:'#e8eef8', color:'#1e3a5f', padding:'3px 9px', borderRadius:20, fontSize:9.5, fontWeight:600 }}>{s.trim()}</span>
              ))}
            </div>
          </div>}

          {r.education && <div style={{ marginBottom:20 }}>
            <Divider title="Education" />
            {B(r.education).map((b,i)=>(
              <div key={i} style={{ marginBottom:10 }}>
                {L(b).map((l,j)=>(
                  <p key={j} style={{ fontSize:j===0?10.5:9.5, fontWeight:j===0?700:400, color:j===0?'#1f2937':'#6b7280', margin:'1px 0' }}>{l}</p>
                ))}
              </div>
            ))}
          </div>}

          {r.languages && <div style={{ marginBottom:20 }}>
            <Divider title="Languages" />
            {r.languages.split(/[,，]/).map((l,i)=>(
              <p key={i} style={{ fontSize:10, margin:'2px 0' }}>{l.trim()}</p>
            ))}
          </div>}

          {(r.website||r.instagram) && <div>
            <Divider title="Links" />
            {[r.website, r.instagram].filter(Boolean).map((v,i)=>(
              <p key={i} style={{ fontSize:9.5, margin:'3px 0', wordBreak:'break-all' }}>{v}</p>
            ))}
          </div>}
        </div>

        {/* Right */}
        <div>
          {r.experience && <div style={{ marginBottom:20 }}>
            <Divider title="Work Experience" />
            {B(r.experience).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:14 }}>
                <p style={{ fontWeight:700, fontSize:11, margin:0, color:'#1e3a5f' }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=>(
                  <p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0', paddingLeft:12 }}>▸ {l.replace(/^[-•]\s*/,'')}</p>
                ))}
              </div>
            })}
          </div>}

          {r.projects && <div>
            <Divider title="Projects" />
            {B(r.projects).map((b,i)=>{
              const ls=L(b)
              return <div key={i} style={{ marginBottom:12 }}>
                <p style={{ fontWeight:700, fontSize:11, margin:0, color:'#1e3a5f' }}>{ls[0]}</p>
                {ls.slice(1).map((l,j)=>(
                  <p key={j} style={{ fontSize:10, color:'#374151', margin:'2px 0', paddingLeft:12 }}>▸ {l.replace(/^[-•]\s*/,'')}</p>
                ))}
              </div>
            })}
          </div>}
        </div>
      </div>
    </div>
  )
}