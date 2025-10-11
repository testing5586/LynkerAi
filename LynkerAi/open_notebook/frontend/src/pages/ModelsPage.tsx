import { useEffect, useState } from 'react'
import { fetchJson, postJson } from '../api/client'

type Model = { id:string, name:string, provider:string, type:string }
type Defaults = {
  default_chat_model?: string | null
  default_transformation_model?: string | null
  large_context_model?: string | null
  default_text_to_speech_model?: string | null
  default_speech_to_text_model?: string | null
  default_embedding_model?: string | null
  default_tools_model?: string | null
}

export default function ModelsPage(){
  const [items,setItems] = useState<Model[]>([])
  const [defaults,setDefaults] = useState<Defaults>({})
  const [newModel,setNewModel] = useState({ name:'', provider:'', type:'language' })

  async function load(){
    setItems(await fetchJson<Model[]>('/api/models',undefined,[]))
    setDefaults(await fetchJson<Defaults>('/api/models/defaults',undefined,{} as any))
  }
  useEffect(()=>{ load() },[])

  async function addModel(){
    await postJson<Model>('/api/models', newModel)
    setNewModel({ name:'', provider:'', type:'language' })
    load()
  }
  async function delModel(id:string){
    await fetch(`/api/models/${encodeURIComponent(id)}`, { method:'DELETE' })
    load()
  }
  async function saveDefaults(){
    await fetch('/api/models/defaults', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(defaults) })
    load()
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>Models</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 120px', gap:10}}>
          <input placeholder="name" value={newModel.name} onChange={e=>setNewModel({...newModel,name:e.target.value})} />
          <input placeholder="provider" value={newModel.provider} onChange={e=>setNewModel({...newModel,provider:e.target.value})} />
          <select value={newModel.type} onChange={e=>setNewModel({...newModel,type:e.target.value})}>
            <option value="language">language</option>
            <option value="embedding">embedding</option>
            <option value="text_to_speech">text_to_speech</option>
            <option value="speech_to_text">speech_to_text</option>
          </select>
          <button className="btn-primary" onClick={addModel} disabled={!newModel.name || !newModel.provider}>Add</button>
        </div>
        <table className="table" style={{marginTop:12}}>
          <thead><tr><th>Name</th><th>Provider</th><th>Type</th><th></th></tr></thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id}><td>{m.name}</td><td>{m.provider}</td><td>{m.type}</td>
                <td style={{textAlign:'right'}}><button className="btn-primary" style={{background:'#e66',color:'#fff'}} onClick={()=>delModel(m.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Default Models</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          {Object.entries({
            default_chat_model:'Chat',
            default_transformation_model:'Transformation',
            large_context_model:'Large Context',
            default_text_to_speech_model:'TTS',
            default_speech_to_text_model:'STT',
            default_embedding_model:'Embedding',
            default_tools_model:'Tools'
          }).map(([key,label]) => (
            <div key={key} style={{display:'grid', gridTemplateColumns:'180px 1fr', alignItems:'center', gap:8}}>
              <div className="muted">{label}</div>
              <input value={(defaults as any)[key] || ''} onChange={e=>setDefaults(prev=>({ ...prev, [key]: e.target.value || null }))} />
            </div>
          ))}
        </div>
        <div style={{textAlign:'right', marginTop:10}}><button className="btn-primary" onClick={saveDefaults}>Save Defaults</button></div>
      </div>
    </div>
  )
}

