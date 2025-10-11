import { NavLink } from 'react-router-dom'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="nav-section">
    <div className="title">{title}</div>
    <div>{children}</div>
  </div>
)

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? 'active' : ''}`
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:8, padding:'8px 8px 12px'}}>
        <div style={{fontWeight:800, letterSpacing:0.5}}>Lynker<span className="accent">Ai</span></div>
      </div>
      <Section title="Dashboard">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      </Section>
      <Section title="General">
        <NavLink to="/mingli" className={linkClass}>命理笔记模式</NavLink>
      </Section>
      <div className="divider" />
      <Section title="Original">
        <NavLink to="/notebooks" className={linkClass}>Notebooks</NavLink>
        <NavLink to="/search" className={linkClass}>Ask and Search</NavLink>
        <NavLink to="/models" className={linkClass}>Models</NavLink>
        <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      </Section>
    </div>
  )
}
