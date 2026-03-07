import { useState } from 'react'
import DemoShell, { Section, SimButton, ResultPanel } from '../components/DemoShell'

const BEFORE_FORM = { buttonColor: '#333', buttonText: 'Sign In', inputBorder: '1px solid #ccc', spacing: '1rem', fontSize: '14px', logoSize: 40 }
const AFTER_FORM = { buttonColor: '#1a73e8', buttonText: 'Log In', inputBorder: '2px solid #1a73e8', spacing: '1.2rem', fontSize: '14px', logoSize: 40 }
const REGRESSION = { buttonColor: '#1a73e8', buttonText: 'Log In', inputBorder: '2px solid #1a73e8', spacing: '1.2rem', fontSize: '14px', logoSize: 40, broken: true }

function MockLogin({ config, label }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1.5rem', width: 280, background: '#fff' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#888', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ textAlign: 'center', marginBottom: config.spacing }}>
        <div style={{ width: config.logoSize, height: config.logoSize, background: '#eee', borderRadius: '50%', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔒</div>
        <div style={{ fontWeight: 600 }}>Welcome Back</div>
      </div>
      <div style={{ marginBottom: config.spacing }}>
        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>Email</div>
        <div style={{ border: config.inputBorder, borderRadius: 4, padding: '8px 10px', fontSize: config.fontSize, color: '#999' }}>user@company.com</div>
      </div>
      <div style={{ marginBottom: config.spacing }}>
        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: 4 }}>Password</div>
        <div style={{ border: config.inputBorder, borderRadius: 4, padding: '8px 10px', fontSize: config.fontSize, color: '#999' }}>••••••••</div>
      </div>
      <div style={{
        background: config.buttonColor, color: '#fff', padding: '10px', borderRadius: 4,
        textAlign: 'center', fontWeight: 500, fontSize: config.fontSize,
        ...(config.broken ? { position: 'relative', left: 120, width: 200 } : {})
      }}>
        {config.buttonText}
      </div>
      {config.broken && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -44, left: 110, border: '2px solid #e53935', borderRadius: 4, padding: '2px 6px', fontSize: '0.65rem', color: '#e53935', fontWeight: 600, background: '#fff' }}>
            🔴 REGRESSION
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '0.75rem' }}>Forgot password?</div>
    </div>
  )
}

export default function VisualRegression() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 2000)
  }

  return (
    <DemoShell useCase={2} icon="👁️" title="Visual Regression Testing"
      description="AI compares before/after screenshots, identifies intentional changes vs regressions, and ignores noise like font rendering differences."
      stats={[
        { value: '80%', label: 'Less Manual Review (Meta)' },
        { value: '3', label: 'Changes Detected' },
        { value: '1', label: 'Regression Found' },
        { value: '2', label: 'Intentional Changes' },
      ]}>

      <Section title="1. Before / After Screenshots">
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <MockLogin config={BEFORE_FORM} label="Before (v2.3)" />
          <MockLogin config={REGRESSION} label="After (v2.4)" />
        </div>
      </Section>

      <Section title="2. Run Visual Analysis">
        <SimButton onClick={simulate} running={running}>👁️ Analyze Visual Differences</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="Visual Regression Report">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Button color changed: #333 → #1a73e8</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#e8f5e9', borderRadius: 10, color: '#2e7d32' }}>Intentional</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Button color updated from dark gray to Google blue. Matches new brand guidelines.</div>
          </div>
          <div style={{ padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Button text changed: "Sign In" → "Log In"</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#e8f5e9', borderRadius: 10, color: '#2e7d32' }}>Intentional</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Copy updated. Verify with UX team that this was intended.</div>
          </div>
          <div style={{ padding: '0.75rem', border: '1px solid #fee', borderRadius: 6, borderColor: '#e53935' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#c62828' }}>🔴 Button overflows container on right side</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#ffebee', borderRadius: 10, color: '#c62828' }}>Regression — Critical</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              The "Log In" button extends 120px beyond its container. Likely caused by a CSS width change.
              This will break on mobile viewports (&lt;375px). <strong>Fix: add <code>max-width: 100%</code> to .login-btn</strong>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.82rem', padding: '0.5rem 0.75rem', background: '#f5f5f5', borderRadius: 4 }}>
          <strong>Summary:</strong> 2 intentional changes, 1 critical regression. <span style={{ color: '#c62828', fontWeight: 600 }}>Do not ship without fixing the button overflow.</span>
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
