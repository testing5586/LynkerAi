import { useState } from 'react'
import { fetchJson, postJson } from '../api/client'

type SearchResult = { [k:string]: any }

export default function SearchAsk(){
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'text'|'vector'>('text')
  const [includeSources, setIncludeSources] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(true)
  const [limit, setLimit] = useState(50)
  const [minScore, setMinScore] = useState(0.2)
  const [results, setResults] = useState<SearchResult[]>([])

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string>('')
  const [models, setModels] = useState({ strategy:'', answer:'', final:'' })

  async function runSearch(){
    const payload:any = { query, type: mode, limit, search_sources: includeSources, search_notes: includeNotes, minimum_score: minScore }
    const r = await postJson<{results:SearchResult[]}>(`/api/search`, payload)
    setResults(r.results || [])
  }

  async function runAsk(){
    try{
      const r = await postJson<{answer:string}>(`/api/search/ask/simple`, { question, strategy_model: models.strategy, answer_model: models.answer, final_answer_model: models.final })
      setAnswer(r.answer)
    }catch(e:any){ setAnswer('Ask failed: '+(e?.message||'')) }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>Search</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 120px 120px 120px 120px', gap:10}}>
          <input placeholder="Type query..." value={query} onChange={e=>setQuery(e.target.value)} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'#fff'}} />
          <select value={mode} onChange={e=>setMode(e.target.value as any)} style={{borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'#fff'}}>
            <option value="text">text</option>
            <option value="vector">vector</option>
          </select>
          <label style={{display:'flex', alignItems:'center', gap:6}}><input type="checkbox" checked={includeSources} onChange={e=>setIncludeSources(e.target.checked)} /> Sources</label>
          <label style={{display:'flex', alignItems:'center', gap:6}}><input type="checkbox" checked={includeNotes} onChange={e=>setIncludeNotes(e.target.checked)} /> Notes</label>
          <button className="btn-primary" onClick={runSearch}>Search</button>
        </div>
        {mode==='vector' && (
          <div className="muted" style={{marginTop:8}}>Min score: <input type="number" step="0.05" value={minScore} onChange={e=>setMinScore(parseFloat(e.target.value))} style={{width:100, marginLeft:6}} /></div>
        )}
        <div className="muted" style={{marginTop:6}}>Limit: <input type="number" value={limit} onChange={e=>setLimit(parseInt(e.target.value||'0',10))} style={{width:100, marginLeft:6}} /></div>
      </div>

      <div className="card">
        <h3>Results</h3>
        <div style={{display:'grid', gap:8}}>
          {results.map((r,idx)=> (
            <div key={idx} className="card" style={{background:'#0f1a2d', border:'1px solid #243656'}}>
              <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(r,null,2)}</pre>
            </div>
          ))}
          {results.length===0 && <div className="muted">No results yet.</div>}
        </div>
      </div>

      <div className="card">
        <h3>Ask</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
          <input placeholder="Strategy model ID" value={models.strategy} onChange={e=>setModels({...models, strategy:e.target.value})} />
          <input placeholder="Answer model ID" value={models.answer} onChange={e=>setModels({...models, answer:e.target.value})} />
          <input placeholder="Final answer model ID" value={models.final} onChange={e=>setModels({...models, final:e.target.value})} />
        </div>
        <textarea placeholder="Ask a question..." value={question} onChange={e=>setQuestion(e.target.value)} style={{width:'100%', height:80, marginTop:8, borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'#fff'}} />
        <div style={{textAlign:'right'}}><button className="btn-primary" onClick={runAsk}>Ask</button></div>
        {answer && <div className="card" style={{background:'#0f1a2d', border:'1px solid #243656', marginTop:10}}>{answer}</div>}
      </div>
    </div>
  )
}

