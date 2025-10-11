import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchJson, postJson } from '../api/client'
import type { Notebook, Note, Source } from '../types'

export default function NotebookDetail() {
  const { id } = useParams()
  const [notebook, setNotebook] = useState<Notebook | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [newSource, setNewSource] = useState({ title: '', content: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchJson<Notebook>(`/api/notebooks/${encodeURIComponent(id)}`, undefined, null as any).then(setNotebook)
    fetchJson<Note[]>(`/api/notes?notebook_id=${encodeURIComponent(id)}`, undefined, []).then(setNotes)
    fetchJson<Source[]>(`/api/sources?notebook_id=${encodeURIComponent(id)}`, undefined, []).then(setSources)
  }, [id])

  if (!id) return <div className="card">Invalid notebook id.</div>

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div style={{display:'flex', alignItems:'center'}}>
          <h2 style={{margin:0}}>{notebook?.name || 'Notebook'}</h2>
          <div style={{marginLeft:'auto'}}><Link to="/notebooks" style={{color:'inherit'}}>Back</Link></div>
        </div>
        <div className="muted">{notebook?.description}</div>
      </div>

      <div style={{display:'grid', gap:16, gridTemplateColumns:'1fr 1fr'}}>
        <div className="card">
          <h3>Sources</h3>
          <div className="card" style={{background:'#0f1a2d', border:'1px solid #243656', marginBottom:12}}>
            <div className="muted" style={{marginBottom:6}}>Add Text Source</div>
            <input placeholder="Title" value={newSource.title} onChange={e=>setNewSource({...newSource, title:e.target.value})} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white', width:'100%', marginBottom:8}} />
            <textarea placeholder="Content" value={newSource.content} onChange={e=>setNewSource({...newSource, content:e.target.value})} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white', width:'100%', height:100}} />
            <div style={{textAlign:'right', marginTop:8}}>
              <button className="btn-primary" disabled={busy || !newSource.content.trim()} onClick={async()=>{
                if (!id) return
                setBusy(true)
                try{
                  await postJson('/api/sources', { notebook_id: id, type: 'text', title: newSource.title || undefined, content: newSource.content, embed: false })
                  setNewSource({ title:'', content:'' })
                  const s = await fetchJson<Source[]>(`/api/sources?notebook_id=${encodeURIComponent(id)}`, undefined, [])
                  setSources(s)
                }catch(e){ alert('Failed to add source') } finally{ setBusy(false) }
              }}>Add Source</button>
            </div>
          </div>
          <div style={{display:'grid', gap:10}}>
            {sources.map(s => (
              <div key={s.id} className="card" style={{background:'#0f1a2d', border:'1px solid #243656'}}>
                <div style={{fontWeight:600}}>{s.title || s.id}</div>
                <div className="muted" style={{whiteSpace:'pre-line'}}>{(s as any).full_text?.slice(0,240)}</div>
              </div>
            ))}
            {sources.length === 0 && <div className="muted">No sources yet.</div>}
          </div>
        </div>
        <div className="card">
          <h3>Notes</h3>
          <div className="card" style={{background:'#0f1a2d', border:'1px solid #243656', marginBottom:12}}>
            <div className="muted" style={{marginBottom:6}}>Add Note</div>
            <input placeholder="Title (optional)" value={newNote.title} onChange={e=>setNewNote({...newNote, title:e.target.value})} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white', width:'100%', marginBottom:8}} />
            <textarea placeholder="Content" value={newNote.content} onChange={e=>setNewNote({...newNote, content:e.target.value})} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white', width:'100%', height:100}} />
            <div style={{textAlign:'right', marginTop:8}}>
              <button className="btn-primary" disabled={busy || !newNote.content.trim()} onClick={async()=>{
                if (!id) return
                setBusy(true)
                try{
                  await postJson('/api/notes', { title: newNote.title || undefined, content: newNote.content, note_type:'human', notebook_id: id })
                  setNewNote({ title:'', content:'' })
                  const n = await fetchJson<Note[]>(`/api/notes?notebook_id=${encodeURIComponent(id)}`, undefined, [])
                  setNotes(n)
                }catch(e){ alert('Failed to add note') } finally{ setBusy(false) }
              }}>Add Note</button>
            </div>
          </div>
          <div style={{display:'grid', gap:10}}>
            {notes.map(n => (
              <div key={n.id} className="card" style={{background:'#0f1a2d', border:'1px solid #243656'}}>
                <div style={{fontWeight:600}}>{n.title || n.id}</div>
                <div className="muted" style={{whiteSpace:'pre-line'}}>{n.content?.slice(0,240)}</div>
              </div>
            ))}
            {notes.length === 0 && <div className="muted">No notes yet.</div>}
          </div>
        </div>
      </div>
      <div className="card" style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
        <button className="btn-primary" onClick={async()=>{
          if (!id) return
          try { await postJson(`/api/notebooks/${encodeURIComponent(id)}`, { archived: !(notebook?.archived) }) } catch {}
          const nb = await fetchJson<Notebook>(`/api/notebooks/${encodeURIComponent(id)}`, undefined, notebook as any)
          setNotebook(nb)
        }}>Toggle Archive</button>
        <button className="btn-primary" style={{background:'#e66', color:'#fff'}} onClick={async()=>{
          if (!id) return
          if (!confirm('Delete this notebook?')) return
          try { await fetch(`/api/notebooks/${encodeURIComponent(id)}`, { method:'DELETE' }) } catch {}
          window.location.href = '/notebooks'
        }}>Delete Notebook</button>
      </div>
    </div>
  )
}
