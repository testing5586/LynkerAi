import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Point = { x: string | number; y: number }

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(String(r.status))
    return (await r.json()) as T
  } catch {
    return fallback
  }
}

export default function Dashboard() {
  const [past, setPast] = useState<Point[]>([])
  const [future, setFuture] = useState<Point[]>([])
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    fetchJson<Point[]>(
      '/api/chart/pastAccuracy',
      Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 40 + Math.random() * 40 }))
    ).then(setPast)
    fetchJson<Point[]>(
      '/api/chart/futureAccuracy',
      Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 30 + Math.random() * 50 }))
    ).then(setFuture)
    fetchJson<any[]>(
      '/api/report/baziCases',
      [
        { video: 'video', client: '蔡清梅女士\n51岁中国人在职老师...', accuracy: 55, date: '5 May 2025', remarks: '此命主四火大旺...', prediction: '2025年5月会有大财进账。' },
        { video: 'video', client: '杨老板\n65岁中国人...', accuracy: 72, date: '12 Dec 2024', remarks: '此命主七杀见官...', prediction: '2026年将会双火夺命主' },
      ]
    ).then(setCases)
  }, [])

  const pastData = useMemo(() => past.map(p => ({ name: String(p.x), value: p.y })), [past])
  const futureData = useMemo(() => future.map(p => ({ name: String(p.x), value: p.y })), [future])

  return (
    <div className="grid" style={{gap:16}}>
      <div className="grid grid-2">
        <div className="card">
          <div className="muted" style={{marginBottom:8}}>过往断言命中率曲线</div>
          <div style={{height:160}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pastData}>
                <XAxis dataKey="name" stroke="#9aa4b2"/>
                <YAxis stroke="#9aa4b2"/>
                <Tooltip contentStyle={{background:'#111a2a', border:'1px solid #2a3a5f', borderRadius:10, color:'#fff'}}/>
                <Line type="monotone" dataKey="value" stroke="#f16e6e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="muted" style={{marginBottom:8}}>未来断言命中率曲线</div>
          <div style={{height:160}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={futureData}>
                <XAxis dataKey="name" stroke="#9aa4b2"/>
                <YAxis stroke="#9aa4b2"/>
                <Tooltip contentStyle={{background:'#111a2a', border:'1px solid #2a3a5f', borderRadius:10, color:'#fff'}}/>
                <Line type="monotone" dataKey="value" stroke="#7bd1ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 260px'}}>
        <div />
        <div className="card energy">
          <div>
            <div className="muted" style={{textAlign:'center'}}>Energy Value</div>
            <div className="score" style={{textAlign:'center'}}>85</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="muted" style={{marginBottom:10}}>八字批命案例</div>
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Client</th>
                <th>Accuracy</th>
                <th>Date</th>
                <th>Remarks</th>
                <th>Prediction</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((row, idx) => (
                <tr key={idx}>
                  <td className="muted">{row.video}<br/>(click to view)</td>
                  <td style={{whiteSpace:'pre-line'}}>{row.client}</td>
                  <td style={{fontSize:22, fontWeight:700}}>{row.accuracy}</td>
                  <td>{row.date}</td>
                  <td style={{whiteSpace:'pre-line'}}>{row.remarks}</td>
                  <td style={{whiteSpace:'pre-line'}}>{row.prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="muted" style={{marginTop:10}}>Pagination: 1, 2, 3, 4, 5, 6...</div>
      </div>
    </div>
  )
}

