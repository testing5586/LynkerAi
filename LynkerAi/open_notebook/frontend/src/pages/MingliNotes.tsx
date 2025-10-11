import { useState } from 'react'

export default function MingliNotes() {
  const [year, setYear] = useState('1990')
  const [month, setMonth] = useState('1')
  const [day, setDay] = useState('1')
  const [hour, setHour] = useState('12')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chart/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: Number(year), month: Number(month), day: Number(day), hour: Number(hour) }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e:any) {
      setError(e?.message || 'Failed to generate. Showing demo output.')
      setResult({ text: '示例命盘：庚午年 壬寅月 乙巳日 乙未时（示意）' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12}}>
        <div>
          <div className="muted">Year</div>
          <input value={year} onChange={e=>setYear(e.target.value)} className="input" style={{width:'100%', borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}}/>
        </div>
        <div>
          <div className="muted">Month</div>
          <input value={month} onChange={e=>setMonth(e.target.value)} className="input" style={{width:'100%', borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}}/>
        </div>
        <div>
          <div className="muted">Day</div>
          <input value={day} onChange={e=>setDay(e.target.value)} className="input" style={{width:'100%', borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}}/>
        </div>
        <div>
          <div className="muted">Hour</div>
          <input value={hour} onChange={e=>setHour(e.target.value)} className="input" style={{width:'100%', borderRadius:10, padding:10, background:'#0f1a2d', border:'1px solid #243656', color:'white'}}/>
        </div>
        <div style={{gridColumn:'span 4', textAlign:'right'}}>
          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : '生成命盘'}</button>
        </div>
      </div>

      {error && <div className="card" style={{border:'1px solid #743', color:'#ffcdcd'}}>{error}</div>}

      {result && (
        <div className="card" style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:16}}>
          <div style={{background:'#0f1a2d', borderRadius:12, height:220, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #243656'}}>
            <span className="muted">Chart Preview</span>
          </div>
          <div>
            <div className="muted">命盘</div>
            <pre style={{whiteSpace:'pre-wrap', background:'#0f1a2d', border:'1px solid #243656', borderRadius:12, padding:12}}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

