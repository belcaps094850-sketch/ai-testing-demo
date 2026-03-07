import { useState } from 'react'
import DemoShell, { Section, SimButton, ResultPanel } from '../components/DemoShell'

const RAW_FAILURES = [
  { test: 'enrollment.test.js > submits enrollment form', error: 'Error: connect ECONNREFUSED 127.0.0.1:5432', type: 'db' },
  { test: 'claims.test.js > creates new claim', error: 'Error: connect ECONNREFUSED 127.0.0.1:5432', type: 'db' },
  { test: 'reports.test.js > generates monthly report', error: 'Error: connect ECONNREFUSED 127.0.0.1:5432', type: 'db' },
  { test: 'auth.test.js > login with valid creds', error: 'Error: connect ECONNREFUSED 127.0.0.1:5432', type: 'db' },
  { test: 'Dashboard.test.jsx > renders loading state', error: 'Error: connect ECONNREFUSED 127.0.0.1:5432', type: 'db' },
  { test: 'BenefitsForm.test.jsx > shows error on timeout', error: 'Timeout: test exceeded 5000ms', type: 'flaky' },
  { test: 'upload.test.js > handles large file', error: 'Timeout: test exceeded 5000ms', type: 'flaky' },
  { test: 'notification.test.js > sends email', error: 'Timeout: test exceeded 5000ms', type: 'flaky' },
  { test: 'LoginForm.test.jsx > validates email format', error: 'Expected: "Invalid email" / Received: "Email is not valid"', type: 'real' },
  { test: 'enrollment.test.js > validates SSN format', error: 'Expected: true / Received: false', type: 'real' },
  { test: 'search.test.js > filters by date range', error: 'Expected array length 3, received 0', type: 'real' },
]

const CLUSTERS = [
  {
    id: 'db',
    title: 'Database Connection Refused',
    icon: '🔌',
    type: 'Infrastructure',
    color: '#e65100',
    count: 5,
    rootCause: 'PostgreSQL is not running on port 5432. All 5 failures are from tests that require a database connection.',
    fix: 'Start the database: docker compose up -d postgres — or check if the CI service container is configured.',
    tests: ['enrollment.test.js', 'claims.test.js', 'reports.test.js', 'auth.test.js', 'Dashboard.test.jsx'],
  },
  {
    id: 'flaky',
    title: 'Timeout — Flaky Tests',
    icon: '⏱️',
    type: 'Flaky',
    color: '#f9a825',
    count: 3,
    rootCause: 'These tests have timed out in 4 of the last 10 runs. They depend on async operations with no proper wait/retry logic.',
    fix: 'Add explicit waitFor() or increase timeout. Consider quarantining to a separate non-blocking suite.',
    tests: ['BenefitsForm.test.jsx', 'upload.test.js', 'notification.test.js'],
    flakyRate: '40%',
  },
  {
    id: 'real',
    title: 'Real Defects — Code Changes',
    icon: '🐛',
    type: 'Bug',
    color: '#c62828',
    count: 3,
    rootCause: 'These are genuine test failures caused by recent code changes (commit a1b2c3d).',
    fix: 'Review the specific assertion failures and fix the code or update the tests.',
    tests: ['LoginForm.test.jsx', 'enrollment.test.js', 'search.test.js'],
  },
]

export default function TriageReporting() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [expandedCluster, setExpandedCluster] = useState(null)

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 2000)
  }

  return (
    <DemoShell useCase={8} icon="📊" title="Test Failure Triage & Reporting"
      description="AI clusters related failures by root cause, identifies flaky tests, and generates clear triage reports — turning 11 confusing failures into 3 actionable items."
      stats={[
        { value: '11', label: 'Total Failures' },
        { value: '3', label: 'Root Causes' },
        { value: '5', label: 'Same Root Cause' },
        { value: '3', label: 'Flaky Tests' },
      ]}>

      <Section title="1. Raw CI Output — 11 Failures">
        <div style={{ maxHeight: 250, overflow: 'auto', border: '1px solid #eee', borderRadius: 6, background: '#1e1e1e', padding: '0.75rem' }}>
          {RAW_FAILURES.map((f, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#ccc', marginBottom: '0.35rem' }}>
              <span style={{ color: '#f44' }}>✕</span> {f.test}
              <div style={{ color: '#888', paddingLeft: '1rem', fontSize: '0.68rem' }}>{f.error}</div>
            </div>
          ))}
          <div style={{ color: '#f44', fontFamily: 'monospace', fontSize: '0.75rem', marginTop: '0.75rem', fontWeight: 600 }}>
            Tests: 11 failed, 247 passed | Time: 3m 42s
          </div>
        </div>
      </Section>

      <Section title="2. AI Triage">
        <SimButton onClick={simulate} running={running}>📊 Analyze & Cluster Failures</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="Triage Report">
        <div style={{
          padding: '0.75rem 1rem', background: '#f5f5f5', borderRadius: 6, marginBottom: '1rem',
          fontSize: '0.85rem', lineHeight: 1.5
        }}>
          <strong>Summary:</strong> 11 failures from 3 root causes. <span style={{ color: '#e65100' }}>5 are from a dead database</span> (fix infrastructure first),{' '}
          <span style={{ color: '#f9a825' }}>3 are known flaky tests</span> (quarantine recommended),{' '}
          <span style={{ color: '#c62828' }}>3 are real bugs</span> (needs developer attention).
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CLUSTERS.map(c => (
            <div key={c.id} style={{
              border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden',
              borderLeftColor: c.color, borderLeftWidth: 4,
            }}>
              <button onClick={() => setExpandedCluster(expandedCluster === c.id ? null : c.id)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{c.count} tests • {c.type}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{expandedCluster === c.id ? '▲' : '▼'}</span>
              </button>

              {expandedCluster === c.id && (
                <div style={{ padding: '0 1rem 1rem', fontSize: '0.82rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#888', marginBottom: 2 }}>Root Cause</div>
                    <div style={{ color: '#444' }}>{c.rootCause}</div>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#888', marginBottom: 2 }}>Recommended Fix</div>
                    <div style={{ color: '#444' }}>{c.fix}</div>
                  </div>
                  {c.flakyRate && (
                    <div style={{ marginBottom: '0.75rem', padding: '0.4rem 0.75rem', background: '#fffde7', borderRadius: 4, fontSize: '0.78rem' }}>
                      ⚠️ Flakiness rate: <strong>{c.flakyRate}</strong> over last 10 runs
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#888', marginBottom: 4 }}>Affected Tests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {c.tests.map(t => (
                        <span key={t} style={{
                          padding: '2px 8px', background: '#f5f5f5', borderRadius: 4,
                          fontSize: '0.72rem', fontFamily: 'monospace'
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#e8f5e9', borderRadius: 6, fontSize: '0.82rem' }}>
          <strong>💡 Priority Order:</strong>
          <ol style={{ paddingLeft: '1.25rem', marginTop: '0.35rem' }}>
            <li>Fix the database connection (unblocks 5 tests in &lt;2 min)</li>
            <li>Fix the 3 real bugs from commit a1b2c3d</li>
            <li>Quarantine the 3 flaky tests and create tickets to fix them properly</li>
          </ol>
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
