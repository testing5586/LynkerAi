import { useEffect, useState } from 'react'
import { fetchJson } from '../api/client'

type Settings = {
  default_content_processing_engine_doc?: string | null
  default_content_processing_engine_url?: string | null
  default_embedding_option?: string | null
  auto_delete_files?: string | null
  youtube_preferred_languages?: string[] | null
}

export default function SettingsPage(){
  const [s, setS] = useState<Settings>({})

  async function load(){
    setS(await fetchJson<Settings>('/api/settings', undefined, {} as any))
  }
  useEffect(()=>{ load() },[])

  async function save(){
    await fetch('/api/settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(s) })
    load()
  }

  return (
    <div className="card" style={{display:'grid', gap:12}}>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:10, alignItems:'center'}}>
        <div className="muted">Doc Processing Engine</div>
        <input value={s.default_content_processing_engine_doc || ''} onChange={e=>setS({...s, default_content_processing_engine_doc:e.target.value || null})} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:10, alignItems:'center'}}>
        <div className="muted">URL Processing Engine</div>
        <input value={s.default_content_processing_engine_url || ''} onChange={e=>setS({...s, default_content_processing_engine_url:e.target.value || null})} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:10, alignItems:'center'}}>
        <div className="muted">Embedding Option</div>
        <input value={s.default_embedding_option || ''} onChange={e=>setS({...s, default_embedding_option:e.target.value || null})} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:10, alignItems:'center'}}>
        <div className="muted">Auto Delete Files</div>
        <input value={s.auto_delete_files || ''} onChange={e=>setS({...s, auto_delete_files:e.target.value || null})} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:10, alignItems:'center'}}>
        <div className="muted">YouTube Preferred Languages (comma separated)</div>
        <input value={(s.youtube_preferred_languages || []).join(', ')} onChange={e=>setS({...s, youtube_preferred_languages: e.target.value.split(',').map(v=>v.trim()).filter(Boolean)})} />
      </div>
      <div style={{textAlign:'right', marginTop:8}}><button className="btn-primary" onClick={save}>Save Settings</button></div>
    </div>
  )
}

