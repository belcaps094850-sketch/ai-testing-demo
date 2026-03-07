import { useState } from 'react'
import DemoShell, { Section, CodeBlock, SimButton, ResultPanel } from '../components/DemoShell'

const SCHEMA = `CREATE TABLE claims (
  id          SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) NOT NULL,
  claim_type  VARCHAR(3) CHECK (claim_type IN ('STD', 'LTD')),
  date_filed  DATE NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) DEFAULT 'pending',
  description TEXT,
  provider    VARCHAR(100)
);`

const GENERATED_DATA = [
  { id: 1, employee_id: 'EMP-0042', type: 'STD', date: '2026-02-15', amount: '$4,250.00', status: 'approved', desc: 'Knee surgery recovery', scenario: 'Happy path' },
  { id: 2, employee_id: 'EMP-0108', type: 'LTD', date: '2026-01-03', amount: '$36,500.00', status: 'pending', desc: 'Chronic back condition', scenario: 'High value' },
  { id: 3, employee_id: 'EMP-0000', type: 'STD', date: '2026-03-06', amount: '$0.00', status: 'rejected', desc: 'Zero amount claim', scenario: '⚠️ Edge: $0 amount' },
  { id: 4, employee_id: 'EMP-9999', type: 'STD', date: '2026-12-31', amount: '$50,000.00', status: 'pending', desc: 'At maximum STD limit', scenario: '⚠️ Boundary: max STD' },
  { id: 5, employee_id: 'EMP-9999', type: 'STD', date: '2026-12-31', amount: '$50,000.01', status: 'error', desc: 'Over maximum STD limit', scenario: '⚠️ Boundary: over max' },
  { id: 6, employee_id: 'EMP-0042', type: 'LTD', date: '2027-01-01', amount: '$15,000.00', status: 'error', desc: 'Future date claim', scenario: '⚠️ Edge: future date' },
  { id: 7, employee_id: 'EMP-0042', type: 'STD', date: '2025-11-01', amount: '$3,200.00', status: 'error', desc: 'Claim older than 90 days', scenario: '⚠️ Edge: >90 days' },
  { id: 8, employee_id: 'EMP-NONE', type: 'STD', date: '2026-02-20', amount: '$5,000.00', status: 'error', desc: 'Non-existent employee', scenario: '⚠️ Edge: bad employee' },
  { id: 9, employee_id: 'EMP-0108', type: 'STD', date: '2026-02-28', amount: '$8,500.00', status: 'approved', desc: "'; DROP TABLE claims; --", scenario: '🔴 Security: SQL injection' },
  { id: 10, employee_id: 'EMP-0077', type: 'LTD', date: '2026-03-01', amount: '$22,000.00', status: 'pending', desc: '<script>alert("xss")</script>', scenario: '🔴 Security: XSS' },
]

const JSON_OUTPUT = `[
  {
    "employee_id": "EMP-0042",
    "claim_type": "STD",
    "date_filed": "2026-02-15",
    "amount": 4250.00,
    "status": "approved",
    "description": "Knee surgery recovery — 6 week leave",
    "provider": "Orthopedic Associates of NJ"
  },
  {
    "employee_id": "EMP-0108",
    "claim_type": "LTD",
    "date_filed": "2026-01-03",
    "amount": 36500.00,
    "status": "pending",
    "description": "Chronic lumbar disc herniation",
    "provider": "Princeton Spine & Joint Center"
  },
  // ... 8 more records including edge cases
]`

export default function SyntheticData() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [format, setFormat] = useState('table')

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 1800)
  }

  return (
    <DemoShell useCase={5} icon="🧬" title="Synthetic Test Data Generation"
      description="AI generates realistic but fictional test data — correct formats, realistic distributions, edge cases, and security payloads — all GDPR/HIPAA compliant."
      stats={[
        { value: '10', label: 'Records Generated' },
        { value: '4', label: 'Edge Cases' },
        { value: '2', label: 'Security Payloads' },
        { value: '0', label: 'Real PII Used' },
      ]}>

      <Section title="1. Your Database Schema">
        <CodeBlock title="claims table" code={SCHEMA} />
      </Section>

      <Section title="2. Generate Test Data">
        <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
          "Generate 10 claims records including happy paths, boundary values, edge cases, and security test payloads."
        </div>
        <SimButton onClick={simulate} running={running}>🧬 Generate Synthetic Data</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title="Generated Test Data">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {['table', 'json'].map(f => (
            <button key={f} onClick={() => setFormat(f)} style={{
              padding: '4px 12px', border: '1px solid #ddd', borderRadius: 4,
              background: format === f ? '#333' : '#fff', color: format === f ? '#fff' : '#333',
              fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit'
            }}>{f.toUpperCase()}</button>
          ))}
        </div>

        {format === 'table' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  {['#', 'Employee', 'Type', 'Date', 'Amount', 'Status', 'Scenario'].map(h => (
                    <th key={h} style={{ padding: '0.4rem', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GENERATED_DATA.map(r => (
                  <tr key={r.id} style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: r.scenario.includes('🔴') ? '#fff5f5' : r.scenario.includes('⚠️') ? '#fffde7' : '#fff'
                  }}>
                    <td style={{ padding: '0.4rem' }}>{r.id}</td>
                    <td style={{ padding: '0.4rem', fontFamily: 'monospace', fontSize: '0.7rem' }}>{r.employee_id}</td>
                    <td style={{ padding: '0.4rem' }}>{r.type}</td>
                    <td style={{ padding: '0.4rem' }}>{r.date}</td>
                    <td style={{ padding: '0.4rem' }}>{r.amount}</td>
                    <td style={{ padding: '0.4rem' }}>
                      <span style={{
                        padding: '1px 6px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 500,
                        background: r.status === 'approved' ? '#e8f5e9' : r.status === 'pending' ? '#fff3e0' :
                          r.status === 'rejected' ? '#fce4ec' : '#ffebee',
                        color: r.status === 'approved' ? '#2e7d32' : r.status === 'pending' ? '#e65100' :
                          r.status === 'rejected' ? '#c62828' : '#b71c1c'
                      }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '0.4rem', fontSize: '0.7rem' }}>{r.scenario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CodeBlock code={JSON_OUTPUT} />
        )}

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Happy Path (2)', 'Boundary Values (2)', 'Edge Cases (4)', 'Security (2)'].map(tag => (
            <span key={tag} style={{ padding: '3px 10px', background: '#f5f5f5', borderRadius: 12, fontSize: '0.72rem' }}>{tag}</span>
          ))}
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
