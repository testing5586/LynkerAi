export default function Header() {
  return (
    <div style={{display:'flex', alignItems:'center', width:'100%'}}>
      <div style={{fontWeight:700}}>LynkerAi Knowledge Base</div>
      <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:10}}>
        <div className="muted">Master Lily</div>
        <div className="avatar" />
      </div>
    </div>
  )
}

