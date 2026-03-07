import { useState } from 'react'
import DemoShell, { Section, SimButton, ResultPanel } from '../components/DemoShell'

const MODULES = [
  { name: 'src/services/claims.js', churn: 14, bugs: 8, coverage: 42, complexity: 47, risk: null },
  { name: 'src/api/routes/enrollment.js', churn: 11, bugs: 6, coverage: 38, complexity: 35, risk: null },
  { name: 'src/components/BenefitsForm.jsx', churn: 9, bugs: 5, coverage: 55, complexity: 28, risk: null },
  { name: 'src/services/auth.js', churn: 7, bugs: 3, coverage: 78, complexity: 22, risk: null },
  { name: 'src/utils/validators.js', churn: 12, bugs: 2, coverage: 91, complexity: 15, risk: null },
  { name: 'src/components/Dashboard.jsx', churn: 5, bugs: 1, coverage: 67, complexity: 19, risk: null },
  { name: 'src/api/routes/reports.js', churn: 3, bugs: 1, coverage: 73, complexity: 12, risk: null },
  { name: 'src/components/Header.jsx', churn: 2, bugs: 0, coverage: 85, complexity: 8, risk: null },
]

function riskScore(m) {
  return Math.round(m.churn * 2.5 + m.bugs * 8 + (100 - m.coverage) * 0.5 + m.complexity * 0.3)
}

export default function PredictiveAnalysis() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const scored = MODULES.map(m => ({ ...m, risk: riskScore(m) }))
    .sort((a, b) => b.risk - a.risk)

  const maxRisk = Math.max(...scored.map(s => s.risk))

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 2000)
  }

  const riskColor = (score) => {
    const pct = score / maxRisk
    if (pct > 0.7) return '#c62828'
    if (pct > 0.4) return '#e65100'
    return '#2e7d32'
  }

  return (
    <DemoShell useCase={6} icon="🔮" title="Predictive Defect Analysis"
      description="AI analyzes code churn, historical bugs, test coverage, and complexity to predict where defects are most likely to hide — so you focus testing where it matters."
      stats={[
        { value: '40%', label: 'Faster Detection (Accenture)' },
        { value: '8', label: 'Modules Analyzed' },
        { value: '2', label: 'Critical Risk' },
        { value: '26', label: 'Bugs in History' },
      ]}>

      <Section title="1. Codebase Metrics">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Module</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Churn (3mo)</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Historical Bugs</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Test Coverage</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map(m => (
                <tr key={m.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.72rem' }}>{m.name}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{m.churn} changes</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{m.bugs}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <span style={{ color: m.coverage < 50 ? '#c62828' : m.coverage < 70 ? '#e65100' : '#2e7d32' }}>
                      {m.coverage}%
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>{m.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="2. Run Predictive Analysis">
        <SimButton onClick={simulate} running={running}>🔮 Predict Bug Hotspots</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="Risk Assessment — Ranked by Bug Probability">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {scored.map((m, i) => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem',
              border: '1px solid #eee', borderRadius: 6,
              borderLeftColor: riskColor(m.risk), borderLeftWidth: 4,
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: riskColor(m.risk), minWidth: 24 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>
                  {m.churn} changes • {m.bugs} bugs • {m.coverage}% coverage • complexity {m.complexity}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: riskColor(m.risk) }}>{m.risk}</div>
                <div style={{ fontSize: '0.6rem', color: '#888' }}>risk score</div>
              </div>
              <div style={{ width: 80 }}>
                <div style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(m.risk / maxRisk) * 100}%`, height: '100%', background: riskColor(m.risk), borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: 6 }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>🎯 Recommended Action</div>
          <ul style={{ fontSize: '0.82rem', color: '#555', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li><strong>claims.js:</strong> High churn + low coverage + high complexity. Add 20+ unit tests immediately. Consider refactoring the 47-complexity function.</li>
            <li><strong>enrollment.js:</strong> Second highest risk. Coverage is only 38% — write integration tests for the enrollment flow.</li>
            <li><strong>BenefitsForm.jsx:</strong> 5 historical bugs. Add component tests for form validation and submission edge cases.</li>
            <li><strong>validators.js:</strong> High churn but 91% coverage — this module is well-protected despite frequent changes. Low risk.</li>
          </ul>
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
