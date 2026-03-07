import { useState } from 'react'

const s = {
  page: { },
  header: { marginBottom: '1.5rem' },
  badge: { fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#888' },
  h1: { fontSize: '1.4rem', fontWeight: 700, margin: '0.25rem 0 0.5rem' },
  desc: { color: '#555', fontSize: '0.9rem', lineHeight: 1.5 },
  stat: { display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' },
  statCard: { padding: '0.75rem 1rem', border: '1px solid #eee', borderRadius: 6, flex: '1 1 120px', textAlign: 'center' },
  statVal: { fontSize: '1.3rem', fontWeight: 700, display: 'block' },
  statLabel: { fontSize: '0.7rem', color: '#888' },
  section: { marginTop: '2rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' },
}

export function Section({ title, children }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}

export function StatRow({ stats }) {
  return (
    <div style={s.stat}>
      {stats.map((st, i) => (
        <div key={i} style={s.statCard}>
          <span style={s.statVal}>{st.value}</span>
          <span style={s.statLabel}>{st.label}</span>
        </div>
      ))}
    </div>
  )
}

export function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ position: 'relative', margin: '0.75rem 0' }}>
      {title && <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600, marginBottom: 4 }}>{title}</div>}
      <pre style={{
        background: '#f5f5f5', padding: '1rem', borderRadius: 6, fontSize: '0.8rem',
        overflow: 'auto', maxHeight: 400, lineHeight: 1.5, border: '1px solid #eee'
      }}>
        <code>{code}</code>
      </pre>
      <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        style={{
          position: 'absolute', top: title ? 24 : 8, right: 8, background: '#fff', border: '1px solid #ddd',
          borderRadius: 4, padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer'
        }}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

export function SimButton({ children, onClick, running, style: extraStyle }) {
  return (
    <button onClick={onClick} disabled={running} style={{
      padding: '0.6rem 1.5rem', background: running ? '#999' : '#333', color: '#fff',
      border: 'none', borderRadius: 6, fontSize: '0.85rem', cursor: running ? 'wait' : 'pointer',
      fontFamily: 'inherit', fontWeight: 500, ...extraStyle
    }}>
      {running ? '⏳ Running...' : children}
    </button>
  )
}

export function ResultPanel({ title, children, show }) {
  if (!show) return null
  return (
    <div style={{
      marginTop: '1rem', border: '1px solid #ddd', borderRadius: 8,
      overflow: 'hidden', animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ padding: '0.5rem 1rem', background: '#f9f9f9', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '0.85rem' }}>
        {title}
      </div>
      <div style={{ padding: '1rem' }}>{children}</div>
    </div>
  )
}

export default function DemoShell({ useCase, icon, title, description, stats, children }) {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.badge}>Use Case {useCase}</div>
        <h1 style={s.h1}>{icon} {title}</h1>
        <p style={s.desc}>{description}</p>
        {stats && <StatRow stats={stats} />}
      </div>
      {children}
    </div>
  )
}
