import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import SmartSelection from './pages/SmartSelection'
import VisualRegression from './pages/VisualRegression'
import SelfHealing from './pages/SelfHealing'
import TestGeneration from './pages/TestGeneration'
import SyntheticData from './pages/SyntheticData'
import PredictiveAnalysis from './pages/PredictiveAnalysis'
import SecurityTesting from './pages/SecurityTesting'
import TriageReporting from './pages/TriageReporting'

const NAV = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/smart-selection', label: 'Smart Selection', icon: '🎯' },
  { path: '/visual-regression', label: 'Visual Regression', icon: '👁️' },
  { path: '/self-healing', label: 'Self-Healing', icon: '🔄' },
  { path: '/test-generation', label: 'Test Generation', icon: '🧪' },
  { path: '/synthetic-data', label: 'Synthetic Data', icon: '🧬' },
  { path: '/predictive-analysis', label: 'Predictive Analysis', icon: '🔮' },
  { path: '/security-testing', label: 'Security Testing', icon: '🔐' },
  { path: '/triage', label: 'Triage & Reporting', icon: '📊' },
]

export default function App() {
  const { pathname } = useLocation()
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: 220, background: '#fafafa', borderRight: '1px solid #eee',
        padding: '1.5rem 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
      }}>
        <div style={{ padding: '0 1rem 1.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
          🤖 AI Testing Demo
        </div>
        {NAV.map(n => (
          <Link key={n.path} to={n.path} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', fontSize: '0.82rem',
            background: pathname === n.path ? '#eee' : 'transparent',
            fontWeight: pathname === n.path ? 600 : 400,
            borderLeft: pathname === n.path ? '3px solid #333' : '3px solid transparent',
          }}>
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
      </nav>
      <main style={{ flex: 1, padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smart-selection" element={<SmartSelection />} />
          <Route path="/visual-regression" element={<VisualRegression />} />
          <Route path="/self-healing" element={<SelfHealing />} />
          <Route path="/test-generation" element={<TestGeneration />} />
          <Route path="/synthetic-data" element={<SyntheticData />} />
          <Route path="/predictive-analysis" element={<PredictiveAnalysis />} />
          <Route path="/security-testing" element={<SecurityTesting />} />
          <Route path="/triage" element={<TriageReporting />} />
        </Routes>
      </main>
    </div>
  )
}
