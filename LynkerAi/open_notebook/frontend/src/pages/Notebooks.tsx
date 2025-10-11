import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchJson, postJson } from '../api/client'
import type { Notebook } from '../types'

export default function Notebooks() {
  const [items, setItems] = useState<Notebook[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function load() {
    const data = await fetchJson<Notebook[]>(
      '/api/notebooks',
      undefined,
      []
    )
    setItems(data)
  }

  useEffect(() => { load() }, [])

  async function createNotebook() {
    setLoading(true)
    try {
      const n = await postJson<Notebook>('/api/notebooks', { name, description })
      setName(''); setDescription('')
      setItems(prev => [n, ...prev])
      if (n?.id) navigate(`/notebooks/${encodeURIComponent(n.id)}`)
    } catch (e) {
      console.error(e)
      alert('Failed to create notebook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div className="muted" style={{marginBottom:8}}>Create Notebook</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 160px', gap:12}}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}} />
          <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}} />
          <button className="btn-primary" onClick={createNotebook} disabled={loading || !name.trim()}>{loading ? 'Creating...' : 'Create'}</button>
        </div>
      </div>

      <div className="card">
        <div className="muted" style={{marginBottom:8}}>My Notebooks</div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Description</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {items.map(n => (
              <tr key={n.id}>
                <td><Link to={`/notebooks/${encodeURIComponent(n.id)}`} style={{color:'inherit'}}>{n.name}</Link></td>
                <td>{n.description}</td>
                <td>{n.updated || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

