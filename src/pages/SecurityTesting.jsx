import { useState } from 'react'
import DemoShell, { Section, CodeBlock, SimButton, ResultPanel } from '../components/DemoShell'

const VULNERABLE_CODE = `// src/api/routes/claims.js
app.get('/api/claims', async (req, res) => {
  const { status, employeeId } = req.query;
  
  // Build query dynamically
  let query = 'SELECT * FROM claims WHERE 1=1';
  if (status) {
    query += \` AND status = '\${status}'\`;     // Line 7
  }
  if (employeeId) {
    query += \` AND employee_id = '\${employeeId}'\`;
  }
  
  const results = await db.query(query);
  
  res.json({
    claims: results.rows,
    query: query,    // Line 16
    server: process.env.DB_HOST   // Line 17
  });
});`

const FINDINGS = [
  {
    type: 'SQL Injection',
    severity: 'Critical',
    sevColor: '#c62828',
    line: 'Line 7',
    desc: 'User input directly concatenated into SQL query without parameterization.',
    exploit: `GET /api/claims?status=approved' OR '1'='1' --`,
    exploitResult: 'Returns ALL claims regardless of status — full data breach.',
    fix: `// Use parameterized queries
const query = 'SELECT * FROM claims WHERE status = $1 AND employee_id = $2';
const results = await db.query(query, [status, employeeId]);`,
    real: true,
  },
  {
    type: 'Information Disclosure',
    severity: 'High',
    sevColor: '#e65100',
    line: 'Line 16-17',
    desc: 'Raw SQL query and database hostname exposed in API response.',
    exploit: 'Any authenticated request reveals internal query structure and DB host.',
    exploitResult: 'Attacker learns table/column names and network topology.',
    fix: `// Remove debug info from response
res.json({ claims: results.rows });
// Use a logger instead: logger.debug({ query, host: process.env.DB_HOST });`,
    real: true,
  },
  {
    type: 'Missing Rate Limiting',
    severity: 'Medium',
    sevColor: '#f9a825',
    line: 'Endpoint',
    desc: 'No rate limiting on the claims endpoint. Vulnerable to enumeration attacks.',
    exploit: 'Script iterates through all employee IDs to extract claims data.',
    exploitResult: 'Mass data exfiltration possible at high speed.',
    fix: `// Add rate limiting middleware
const rateLimit = require('express-rate-limit');
app.use('/api/claims', rateLimit({ windowMs: 60000, max: 30 }));`,
    real: true,
  },
  {
    type: 'Broken Access Control',
    severity: 'High',
    sevColor: '#e65100',
    line: 'Endpoint',
    desc: 'No authorization check — any authenticated user can view any employee\'s claims.',
    exploit: 'GET /api/claims?employeeId=EMP-0001 (as a different user)',
    exploitResult: 'Employee A can view Employee B\'s disability claims — privacy violation.',
    fix: `// Add authorization check
const currentUser = req.user;
if (employeeId && employeeId !== currentUser.employeeId && !currentUser.isHR) {
  return res.status(403).json({ error: 'Unauthorized' });
}`,
    real: true,
  },
]

export default function SecurityTesting() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const simulate = () => {
    setRunning(true)
    setTimeout(() => { setStep(1); setRunning(false) }, 2500)
  }

  return (
    <DemoShell useCase={7} icon="🔐" title="AI Security Testing"
      description="AI reviews your code for OWASP Top 10 vulnerabilities, shows proof-of-concept exploits, and generates the exact fix + test for each finding."
      stats={[
        { value: '4', label: 'Vulnerabilities Found' },
        { value: '1', label: 'Critical' },
        { value: '2', label: 'High' },
        { value: '100%', label: 'With Fix + PoC' },
      ]}>

      <Section title="1. Code to Review">
        <CodeBlock title="claims.js — API endpoint" code={VULNERABLE_CODE} />
      </Section>

      <Section title="2. Run Security Analysis">
        <SimButton onClick={simulate} running={running}>🔐 Scan for Vulnerabilities</SimButton>
      </Section>

      <ResultPanel show={step >= 1} title={`Security Report — ${FINDINGS.length} Findings`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {FINDINGS.map((f, i) => (
            <div key={i} style={{
              border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden',
              borderLeftColor: f.sevColor, borderLeftWidth: 4,
            }}>
              <button onClick={() => setExpanded(expanded === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left'
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f.type}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>{f.line}</span>
                </div>
                <span style={{
                  fontSize: '0.7rem', padding: '2px 10px', borderRadius: 10, fontWeight: 600,
                  background: f.severity === 'Critical' ? '#ffebee' : f.severity === 'High' ? '#fff3e0' : '#fff8e1',
                  color: f.sevColor,
                }}>{f.severity}</span>
              </button>

              {expanded === i && (
                <div style={{ padding: '0 1rem 1rem', fontSize: '0.82rem' }}>
                  <p style={{ color: '#555', marginBottom: '0.75rem' }}>{f.desc}</p>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#c62828', marginBottom: 4 }}>💥 Proof of Concept</div>
                    <pre style={{ background: '#fff5f5', padding: '0.5rem', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto' }}>
                      <code>{f.exploit}</code>
                    </pre>
                    <div style={{ fontSize: '0.78rem', color: '#c62828', marginTop: 4 }}>{f.exploitResult}</div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#2e7d32', marginBottom: 4 }}>✅ Recommended Fix</div>
                    <pre style={{ background: '#f1f8e9', padding: '0.5rem', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto' }}>
                      <code>{f.fix}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ResultPanel>
    </DemoShell>
  )
}
