import { Link } from 'react-router-dom'

const CARDS = [
  { path: '/smart-selection', icon: '🎯', title: 'Smart Test Selection', desc: 'AI picks which tests to run based on your code changes', stat: '50% faster CI' },
  { path: '/visual-regression', icon: '👁️', title: 'Visual Regression', desc: 'AI compares UI screenshots and catches real regressions', stat: '80% less manual review' },
  { path: '/self-healing', icon: '🔄', title: 'Self-Healing Tests', desc: 'Tests auto-fix broken selectors when UI changes', stat: '60% less maintenance' },
  { path: '/test-generation', icon: '🧪', title: 'Test Case Generation', desc: 'AI writes tests from code, stories, or API specs', stat: '50% faster creation' },
  { path: '/synthetic-data', icon: '🧬', title: 'Synthetic Test Data', desc: 'Realistic fake data that\'s GDPR/HIPAA compliant', stat: 'Zero compliance risk' },
  { path: '/predictive-analysis', icon: '🔮', title: 'Predictive Analysis', desc: 'AI predicts where bugs will appear in your codebase', stat: '40% faster detection' },
  { path: '/security-testing', icon: '🔐', title: 'Security Testing', desc: 'AI-powered code review for OWASP Top 10 vulnerabilities', stat: '70% fewer false positives' },
  { path: '/triage', icon: '📊', title: 'Triage & Reporting', desc: 'AI clusters failures by root cause, detects flaky tests', stat: '50% faster triage' },
]

export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>🤖 AI in Software Testing</h1>
      <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        8 interactive demos showing how AI transforms software testing. Each demo includes simulated workflows, Claude prompts you can copy, and real industry data.
      </p>
      <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '2rem' }}>
        Market: $857M → $3.8B by 2032 • 60% of practitioners say testing is the #1 area for AI investment
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {CARDS.map(c => (
          <Link key={c.path} to={c.path} style={{
            border: '1px solid #ddd', borderRadius: 8, padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.35rem',
            transition: 'border-color 0.15s', textDecoration: 'none', color: '#333'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#999'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ddd'}
          >
            <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
            <strong style={{ fontSize: '0.95rem' }}>{c.title}</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>{c.desc}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', marginTop: '0.25rem' }}>{c.stat}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
