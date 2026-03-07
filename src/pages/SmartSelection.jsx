import { useState } from 'react'
import DemoShell, { Section, CodeBlock, SimButton, ResultPanel } from '../components/DemoShell'

const MOCK_DIFF = `src/services/auth.js        | 12 +++---
src/components/LoginForm.jsx | 34 +++++++++---
src/api/routes/session.js    |  8 ++-
src/utils/validators.js      |  3 +-`

const ALL_TESTS = [
  { file: 'auth.test.js', tests: 24, time: '4.2s', relevant: true, reason: 'Direct: tests auth.js functions' },
  { file: 'LoginForm.test.jsx', tests: 18, time: '3.8s', relevant: true, reason: 'Direct: tests LoginForm component' },
  { file: 'session.test.js', tests: 12, time: '2.1s', relevant: true, reason: 'Direct: tests session routes' },
  { file: 'validators.test.js', tests: 31, time: '1.5s', relevant: true, reason: 'Direct: tests validator utils' },
  { file: 'Dashboard.test.jsx', tests: 22, time: '5.1s', relevant: true, reason: 'Indirect: uses auth context' },
  { file: 'ProtectedRoute.test.jsx', tests: 8, time: '1.2s', relevant: true, reason: 'Indirect: depends on session' },
  { file: 'Header.test.jsx', tests: 14, time: '2.3s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'Footer.test.jsx', tests: 6, time: '0.8s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'UserProfile.test.jsx', tests: 19, time: '3.4s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'Settings.test.jsx', tests: 16, time: '2.9s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'Reports.test.jsx', tests: 28, time: '6.2s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'Claims.test.jsx', tests: 35, time: '7.4s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'Enrollment.test.jsx', tests: 21, time: '4.8s', relevant: false, reason: 'No dependency on changed files' },
  { file: 'api-integration.test.js', tests: 42, time: '12.3s', relevant: false, reason: 'Integration: not affected' },
  { file: 'e2e-checkout.test.js', tests: 8, time: '45.0s', relevant: false, reason: 'E2E: different flow' },
]

const PROMPT = `I made the following code changes. Analyze the diff and tell me which test files I should prioritize running first, ranked by likelihood of being affected.

## Changed Files:
src/services/auth.js
src/components/LoginForm.jsx
src/api/routes/session.js
src/utils/validators.js

## Our Test Structure:
- src/__tests__/unit/ — unit tests, mirror src/ structure
- src/__tests__/integration/ — API integration tests
- src/__tests__/e2e/ — end-to-end tests

For each recommended test, explain WHY it's relevant.
Also flag any areas where we might be MISSING test coverage.`

export default function SmartSelection() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 1500)
  }

  const relevant = ALL_TESTS.filter(t => t.relevant)
  const skipped = ALL_TESTS.filter(t => !t.relevant)
  const totalTime = ALL_TESTS.reduce((s, t) => s + parseFloat(t.time), 0)
  const selectedTime = relevant.reduce((s, t) => s + parseFloat(t.time), 0)

  return (
    <DemoShell useCase={1} icon="🎯" title="Smart Test Selection"
      description="AI analyzes your code changes and predicts which tests are most likely to be affected. Run only what matters instead of the full suite."
      stats={[
        { value: '50%', label: 'Faster CI (Google)' },
        { value: ALL_TESTS.length, label: 'Total Tests' },
        { value: relevant.length, label: 'AI Selected' },
        { value: `${Math.round((1 - selectedTime/totalTime) * 100)}%`, label: 'Time Saved' },
      ]}>

      <Section title="1. Your Code Changes (Git Diff)">
        <CodeBlock title="Changed files" code={MOCK_DIFF} />
      </Section>

      <Section title="2. Ask AI to Select Tests">
        <CodeBlock title="Claude Prompt" code={PROMPT} />
        <SimButton onClick={simulate} running={running}>🎯 Run Smart Selection</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="AI Analysis Result">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2a7', marginBottom: '0.5rem' }}>
            ✅ Run These ({relevant.length} test files — {selectedTime.toFixed(1)}s)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.4rem 0.5rem' }}>Test File</th>
                <th style={{ padding: '0.4rem 0.5rem' }}>Tests</th>
                <th style={{ padding: '0.4rem 0.5rem' }}>Time</th>
                <th style={{ padding: '0.4rem 0.5rem' }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {relevant.map(t => (
                <tr key={t.file} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>{t.file}</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{t.tests}</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{t.time}</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#666' }}>{t.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#999', marginBottom: '0.5rem' }}>
            ⏭️ Skip These ({skipped.length} test files — {(totalTime - selectedTime).toFixed(1)}s saved)
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>
            {skipped.map(t => t.file).join(', ')}
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff8e1', borderRadius: 6, fontSize: '0.82rem' }}>
          ⚠️ <strong>Coverage Gap:</strong> No test found for the session expiration edge case in <code>session.js:L42</code>. Consider adding a test for expired token handling.
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
