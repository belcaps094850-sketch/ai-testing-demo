import { useState } from 'react'
import DemoShell, { Section, CodeBlock, SimButton, ResultPanel } from '../components/DemoShell'

const OLD_TEST = `// login.test.js — BEFORE UI change
test('user can login', async () => {
  await page.goto('/login');
  await page.click('#email-input');
  await page.type('#email-input', 'user@test.com');
  await page.click('#password-input');
  await page.type('#password-input', 'Pass123!');
  await page.click('#btn-submit');        // ❌ BROKEN
  await page.waitForSelector('.dashboard-welcome');
});`

const ERROR_LOG = `FAIL login.test.js
  ✕ user can login (3421ms)

  Error: Element #btn-submit not found
    waiting for selector "#btn-submit" 
    timeout 30000ms exceeded

  at Object.click (node_modules/playwright/lib/page.js:234:11)
  at login.test.js:7:14`

const NEW_HTML = `<!-- Current page HTML after UI refactor -->
<form class="auth-form" data-testid="login-form">
  <input 
    id="email" 
    data-testid="email-input"
    type="email" 
    placeholder="Email" />
  <input 
    id="password" 
    data-testid="password-input"
    type="password" 
    placeholder="Password" />
  <button 
    type="submit" 
    class="btn-primary"
    data-testid="submit-btn">     <!-- was #btn-submit -->
    Sign In
  </button>
</form>`

const HEALED_TEST = `// login.test.js — HEALED by AI ✅
test('user can login', async () => {
  await page.goto('/login');
  
  // Healed: #email-input → [data-testid="email-input"]
  await page.fill('[data-testid="email-input"]', 'user@test.com');
  
  // Healed: #password-input → [data-testid="password-input"]  
  await page.fill('[data-testid="password-input"]', 'Pass123!');
  
  // Healed: #btn-submit → [data-testid="submit-btn"]
  // AI found matching button via: type=submit + text "Sign In"
  await page.click('[data-testid="submit-btn"]');
  
  await page.waitForSelector('.dashboard-welcome');
});`

export default function SelfHealing() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1) }, 1000)
    setTimeout(() => { setStep(2) }, 2000)
    setTimeout(() => { setStep(3); setRunning(false) }, 3000)
  }

  return (
    <DemoShell useCase={3} icon="🔄" title="Self-Healing Test Automation"
      description="When UI changes break test selectors, AI analyzes the new DOM, finds matching elements, and updates your tests automatically."
      stats={[
        { value: '60%', label: 'Less Maintenance' },
        { value: '3', label: 'Selectors Healed' },
        { value: '0', label: 'Manual Fixes Needed' },
        { value: '< 3s', label: 'Healing Time' },
      ]}>

      <Section title="1. The Broken Test">
        <CodeBlock title="Original test (failing)" code={OLD_TEST} />
        <CodeBlock title="Error output" code={ERROR_LOG} />
      </Section>

      <Section title="2. Current Page HTML (After UI Refactor)">
        <CodeBlock title="New HTML structure" code={NEW_HTML} />
      </Section>

      <Section title="3. Run Self-Healing">
        <SimButton onClick={simulate} running={running}>🔄 Heal Broken Selectors</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="Healing Progress">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { old: '#email-input', new: '[data-testid="email-input"]', confidence: '98%', method: 'data-testid match' },
            { old: '#password-input', new: '[data-testid="password-input"]', confidence: '98%', method: 'data-testid match' },
            { old: '#btn-submit', new: '[data-testid="submit-btn"]', confidence: '95%', method: 'type=submit + text content' },
          ].map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem',
              background: step > i ? '#f1f8e9' : '#f5f5f5', borderRadius: 6, fontSize: '0.8rem',
              opacity: step > i ? 1 : 0.4, transition: 'all 0.3s'
            }}>
              <span>{step > i ? '✅' : '⏳'}</span>
              <code style={{ color: '#c62828', textDecoration: 'line-through' }}>{h.old}</code>
              <span>→</span>
              <code style={{ color: '#2e7d32' }}>{h.new}</code>
              <span style={{ marginLeft: 'auto', color: '#888', fontSize: '0.7rem' }}>
                {h.confidence} confidence • {h.method}
              </span>
            </div>
          ))}
        </div>
      </ResultPanel>

      <ResultPanel show={step >= 3} title="Healed Test Code">
        <CodeBlock code={HEALED_TEST} />
        <div style={{ fontSize: '0.82rem', color: '#555', marginTop: '0.5rem' }}>
          💡 <strong>Pro tip:</strong> The healed test uses <code>data-testid</code> selectors which are more resilient than ID selectors. 
          Ask Claude to also add these attributes to your component code.
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
