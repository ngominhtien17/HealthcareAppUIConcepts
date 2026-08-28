import { useState, useEffect, useRef } from 'react'
import FoundationReport from './FoundationReport'

type Screen = 'home' | 'book' | 'health' | 'profile'
type DirId = 1 | 2 | 3 | 4

const PATIENT = { name: 'Emma Lawson', age: 42, id: 'CL-2847', gp: 'Dr. James Okafor' }

const DIRECTIONS = [
  { id: 1 as DirId, name: 'Paper Weight', tag: 'Quiet Skeuomorphism' },
  { id: 2 as DirId, name: 'Night Clinic', tag: 'Adaptive Dark Contrast' },
  { id: 3 as DirId, name: 'One Step', tag: 'Single-Path Flow' },
  { id: 4 as DirId, name: 'Stillwater', tag: 'Restrained Micro-Motion' },
]

const CAPTIONS: Record<DirId, string> = {
  1: 'Quiet skeuomorphism uses warm cream grounds and journal-ruled health views to ground digital data in familiar physical metaphors, reducing anxiety for less tech-fluent patients.',
  2: 'Adaptive dark contrast optimises legibility under clinical lighting conditions — bright ward overhead lights or dim consultation rooms — with a navy ground, cyan data markers, and monospace vitals.',
  3: 'Single-path flow removes all non-essential choices from booking: one decision per screen, huge tap targets, and a linear date strip that never shows a calendar grid.',
  4: 'Stillwater uses restrained micro-motion on state change only — card entrance, metric tick-up, confirmation draw — so motion communicates meaning rather than decorating the interface.',
}

// ─── Shared icon primitives ──────────────────────────────────────────────────

const Icon = {
  heart: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  calendar: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  home: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/>
    </svg>
  ),
  user: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  chevron: (c = 'currentColor') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  check: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  activity: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  file: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  arrow: (c = 'currentColor') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
}

// ─── Direction 1: Paper Weight ───────────────────────────────────────────────

const D1_VARS = {
  '--bg': '#F3EDE0',
  '--card': '#FDFAF3',
  '--primary': '#1B5FA8',
  '--navy': '#0A2342',
  '--accent': '#D4E8F8',
  '--border': '#D4C9B4',
  '--text': '#1C1610',
  '--muted': '#7B6E5E',
  '--ink': '#0A2342',
} as React.CSSProperties

function D1Home() {
  return (
    <div style={{ padding: '52px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: "'Source Sans 3'", fontSize: 13, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Good morning</p>
          <h1 style={{ fontFamily: "'Lora'", fontSize: 26, fontWeight: 500, color: 'var(--navy)', lineHeight: 1.2 }}>Emma</h1>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)' }}>
          <span style={{ fontFamily: "'Lora'", fontWeight: 600, color: 'var(--primary)', fontSize: 16 }}>EL</span>
        </div>
      </div>

      {/* Next appointment — paper card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 20px 16px', boxShadow: '0 2px 8px rgba(10,35,66,0.07), 0 0 0 1px rgba(212,201,180,0.4)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--primary)', borderRadius: '12px 12px 0 0' }} />
        <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Next Appointment</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 48, textAlign: 'center', background: 'var(--accent)', borderRadius: 8, padding: '8px 4px', border: '1px solid var(--border)' }}>
            <p style={{ fontFamily: "'Lora'", fontSize: 20, fontWeight: 600, color: 'var(--primary)', lineHeight: 1 }}>05</p>
            <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--primary)', marginTop: 2 }}>Sep</p>
          </div>
          <div>
            <p style={{ fontFamily: "'Lora'", fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>Dr. Sarah Chen</p>
            <p style={{ fontFamily: "'Source Sans 3'", fontSize: 14, color: 'var(--muted)', marginTop: 2 }}>Cardiology · 10:30 AM</p>
            <p style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Harley Wing, Room 204</p>
          </div>
        </div>
      </div>

      {/* Vital summary — ruled-line style */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,35,66,0.07)' }}>
        <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Today's Vitals</p>
        </div>
        {[
          { label: 'Heart Rate', value: '68', unit: 'bpm', status: 'Normal' },
          { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'Normal' },
          { label: 'SpO₂', value: '98', unit: '%', status: 'Excellent' },
        ].map((v, i) => (
          <div key={i} style={{ padding: '12px 20px', borderBottom: i < 2 ? '1px solid rgba(212,201,180,0.5)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 14, color: 'var(--text)' }}>{v.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'Lora'", fontSize: 16, fontWeight: 500, color: 'var(--navy)' }}>{v.value}</span>
              <span style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>{v.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Book Appointment', icon: Icon.calendar },
          { label: 'View Results', icon: Icon.file },
        ].map((a, i) => (
          <button key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', boxShadow: '0 1px 4px rgba(10,35,66,0.06)', textAlign: 'left' }}>
            <span style={{ color: 'var(--primary)' }}>{a.icon()}</span>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function D1Book() {
  const [step, setStep] = useState(0)
  const specialties = ['Cardiology', 'General Practice', 'Dermatology', 'Neurology']
  const [sel, setSel] = useState('')
  return (
    <div style={{ padding: '52px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Book Appointment</p>
        <h2 style={{ fontFamily: "'Lora'", fontSize: 22, fontWeight: 500, color: 'var(--navy)' }}>Choose a Specialty</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {specialties.map(s => (
          <button key={s} onClick={() => setSel(s)} style={{ background: sel === s ? 'var(--accent)' : 'var(--card)', border: `1.5px solid ${sel === s ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{s}</span>
            {sel === s && <span style={{ color: 'var(--primary)' }}>{Icon.check()}</span>}
          </button>
        ))}
      </div>
      {/* Paper form preview */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', boxShadow: '0 2px 8px rgba(10,35,66,0.07)' }}>
        <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Referral Summary</p>
        {[
          { label: 'Patient', value: 'Emma Lawson · CL-2847' },
          { label: 'Requested by', value: 'Dr. James Okafor' },
          { label: 'Specialty', value: sel || '—' },
          { label: 'Priority', value: 'Routine' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--border)' : 'none' }}>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>{f.label}</span>
            <span style={{ fontFamily: "'Lora'", fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{f.value}</span>
          </div>
        ))}
      </div>
      <button disabled={!sel} style={{ background: sel ? 'var(--primary)' : 'var(--border)', color: sel ? 'white' : 'var(--muted)', borderRadius: 10, padding: '16px', fontFamily: "'Source Sans 3'", fontSize: 15, fontWeight: 600, border: 'none', cursor: sel ? 'pointer' : 'default', letterSpacing: '0.02em' }}>
        Find Available Doctors
      </button>
    </div>
  )
}

function D1Health() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const bpm  = [66, 70, 68, 72, 65, 68, 68]
  const max = Math.max(...bpm), min = Math.min(...bpm)
  return (
    <div style={{ padding: '52px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Health Journal</p>
        <h2 style={{ fontFamily: "'Lora'", fontSize: 22, fontWeight: 500, color: 'var(--navy)' }}>Heart Rate · 7 days</h2>
      </div>

      {/* Graph-paper style chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(10,35,66,0.07)', position: 'relative' }}>
        <div style={{ position: 'relative', height: 120, display: 'flex', alignItems: 'flex-end', gap: 0 }}>
          {/* Ruled lines */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${i * 33}%`, borderTop: '1px solid rgba(212,201,180,0.6)', zIndex: 0 }} />
          ))}
          {days.map((d, i) => {
            const h = ((bpm[i] - min) / (max - min)) * 80 + 20
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 }}>
                <div style={{ width: 8, height: h, background: i === 6 ? 'var(--primary)' : 'rgba(27,95,168,0.25)', borderRadius: 4, transition: 'height 0.3s ease' }} />
                <span style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)' }}>{d}</span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <div><p style={{ fontFamily: "'Lora'", fontSize: 28, fontWeight: 500, color: 'var(--navy)' }}>68 <span style={{ fontFamily: "'Source Sans 3'", fontSize: 14, color: 'var(--muted)', fontWeight: 300 }}>bpm</span></p><p style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>Today</p></div>
          <div style={{ textAlign: 'right' }}><p style={{ fontFamily: "'Source Sans 3'", fontSize: 13, color: '#2E8B57', fontWeight: 600 }}>● Normal range</p><p style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>60–100 bpm</p></div>
        </div>
      </div>

      {/* Journal-entry list */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,35,66,0.07)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Other Readings</p>
        </div>
        {[
          { label: 'Blood Pressure', val: '118/76', unit: 'mmHg', note: '26 Aug' },
          { label: 'Weight', val: '64.2', unit: 'kg', note: '25 Aug' },
          { label: 'SpO₂', val: '98', unit: '%', note: '24 Aug' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < 2 ? '1px dashed rgba(212,201,180,0.7)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: "'Source Sans 3'", fontSize: 14, color: 'var(--text)' }}>{r.label}</p>
              <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.note}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: "'Lora'", fontSize: 18, fontWeight: 500, color: 'var(--navy)' }}>{r.val}</span>
              <span style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>{r.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function D1Profile() {
  return (
    <div style={{ padding: '52px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Lora'", fontSize: 22, fontWeight: 600, color: 'var(--primary)' }}>EL</span>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Lora'", fontSize: 20, fontWeight: 500, color: 'var(--navy)' }}>Emma Lawson</h2>
          <p style={{ fontFamily: "'Source Sans 3'", fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Patient · CL-2847 · Age 42</p>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,35,66,0.07)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Test Results</p>
        </div>
        {[
          { name: 'Full Blood Count', date: '30 Jul 2026', status: 'Normal', color: '#2E8B57' },
          { name: 'Lipid Panel', date: '15 Jun 2026', status: 'Review', color: '#B8860B' },
          { name: 'Thyroid Function', date: '02 May 2026', status: 'Normal', color: '#2E8B57' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: i < 2 ? '1px solid rgba(212,201,180,0.5)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: "'Source Sans 3'", fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{r.name}</p>
              <p style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.date}</p>
            </div>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 12, fontWeight: 600, color: r.color, background: r.color + '18', padding: '4px 10px', borderRadius: 20 }}>{r.status}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', boxShadow: '0 2px 8px rgba(10,35,66,0.07)' }}>
        <p style={{ fontFamily: "'Source Sans 3'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Care Team</p>
        {[
          { role: 'GP', name: 'Dr. James Okafor' },
          { role: 'Cardiologist', name: 'Dr. Sarah Chen' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i === 0 ? '1px dashed var(--border)' : 'none' }}>
            <span style={{ fontFamily: "'Source Sans 3'", fontSize: 12, color: 'var(--muted)' }}>{m.role}</span>
            <span style={{ fontFamily: "'Lora'", fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Direction 2: Night Clinic ────────────────────────────────────────────────

const D2_VARS = {
  '--bg': '#0D1B2A',
  '--card': '#162234',
  '--surface': '#1E2F47',
  '--primary': '#00C9C8',
  '--blue': '#4DABF7',
  '--text': '#EEF4FF',
  '--muted': '#7EAAD4',
  '--border': '#243449',
  '--warn': '#F59E0B',
} as React.CSSProperties

function D2Home() {
  return (
    <div style={{ padding: '52px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>22:14 · WARD-A</p>
          <h1 style={{ fontFamily: "'DM Sans'", fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>Emma Lawson</h1>
        </div>
        <div style={{ border: '1.5px solid var(--primary)', borderRadius: 8, padding: '6px 10px' }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--primary)', letterSpacing: '0.08em' }}>CL-2847</p>
        </div>
      </div>

      {/* Monitor-style vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'HR', val: '68', unit: 'bpm', color: 'var(--primary)', status: 'NRM' },
          { label: 'SpO₂', val: '98', unit: '%', color: 'var(--primary)', status: 'NRM' },
          { label: 'BP SYS', val: '118', unit: 'mmHg', color: 'var(--blue)', status: 'NRM' },
          { label: 'WEIGHT', val: '64.2', unit: 'kg', color: 'var(--blue)', status: '—' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: m.color }} />
            <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 26, fontWeight: 500, color: m.color, lineHeight: 1 }}>{m.val}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)' }}>{m.unit}</p>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, color: m.color, letterSpacing: '0.1em' }}>{m.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next appointment */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>NEXT APPOINTMENT</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Dr. Sarah Chen</p>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>CARDIOLOGY · 05 SEP · 10:30</p>
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 18, fontWeight: 500, color: 'var(--primary)', lineHeight: 1 }}>9</p>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>DAYS</p>
          </div>
        </div>
      </div>

      {/* ECG-style wave decoration */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>ECG RHYTHM</p>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--primary)' }}>SINUS NRM ●</p>
        </div>
        <svg viewBox="0 0 300 40" style={{ width: '100%', height: 40 }}>
          <polyline fill="none" stroke="var(--primary)" strokeWidth="1.5"
            points="0,20 30,20 35,20 40,5 45,35 50,20 60,20 90,20 95,20 100,5 105,35 110,20 120,20 150,20 155,20 160,5 165,35 170,20 180,20 210,20 215,20 220,5 225,35 230,20 240,20 270,20 275,20 280,5 285,35 290,20 300,20" />
        </svg>
      </div>
    </div>
  )
}

function D2Book() {
  const [sel, setSel] = useState('')
  const doctors = ['Dr. Sarah Chen', 'Dr. James Okafor', 'Dr. Priya Mehta', 'Dr. Thomas Reade']
  return (
    <div style={{ padding: '52px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>BOOK APPOINTMENT</p>
        <h2 style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Select Clinician</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {doctors.map((d, i) => (
          <button key={i} onClick={() => setSel(d)} style={{ background: sel === d ? 'rgba(0,201,200,0.1)' : 'var(--card)', border: `1px solid ${sel === d ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{d}</p>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                {['CARDIOLOGY', 'GENERAL PRACTICE', 'DERMATOLOGY', 'NEUROLOGY'][i]} · NEXT: {['05 SEP','03 SEP','10 SEP','15 SEP'][i]}
              </p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel === d ? 'var(--primary)' : 'var(--border)'}`, background: sel === d ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {sel === d && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg)' }} />}
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div style={{ background: 'rgba(0,201,200,0.08)', border: '1px solid var(--primary)', borderRadius: 10, padding: '14px 18px' }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: 8 }}>SELECTED SLOT</p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>05 Sep 2026 · 10:30 AM</p>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>HARLEY WING · ROOM 204</p>
        </div>
      )}
      <button disabled={!sel} style={{ background: sel ? 'var(--primary)' : 'var(--border)', color: sel ? 'var(--bg)' : 'var(--muted)', borderRadius: 10, padding: '16px', fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 700, border: 'none', cursor: sel ? 'pointer' : 'default', letterSpacing: '0.04em' }}>
        CONFIRM BOOKING
      </button>
    </div>
  )
}

function D2Health() {
  return (
    <div style={{ padding: '52px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>HEALTH MONITOR</p>
        <h2 style={{ fontFamily: "'DM Sans'", fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Weekly Overview</h2>
      </div>
      {/* Radial metric */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', display: 'flex', gap: 20, alignItems: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface)" strokeWidth="8"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" strokeWidth="8"
            strokeDasharray="213" strokeDashoffset="53" strokeLinecap="round"
            transform="rotate(-90 40 40)"/>
          <text x="40" y="38" textAnchor="middle" fontFamily="'DM Mono'" fontSize="14" fontWeight="500" fill="#00C9C8">68</text>
          <text x="40" y="52" textAnchor="middle" fontFamily="'DM Mono'" fontSize="9" fill="#7EAAD4">BPM</text>
        </svg>
        <div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Heart Rate</p>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 11, color: 'var(--primary)', marginTop: 4 }}>● NORMAL SINUS</p>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>RANGE: 60–100 BPM</p>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)' }}>7-DAY AVG: 68.1</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'BLOOD PRESSURE', sys: '118', dia: '76', unit: 'mmHg', status: 'OPTIMAL', color: 'var(--primary)' },
          { label: 'SpO₂ SATURATION', sys: '98', dia: null, unit: '%', status: 'EXCELLENT', color: 'var(--primary)' },
          { label: 'BODY WEIGHT', sys: '64.2', dia: null, unit: 'kg', status: 'STABLE', color: 'var(--blue)' },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>{m.label}</p>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 22, fontWeight: 500, color: 'var(--text)', marginTop: 4 }}>{m.sys}{m.dia ? `/${m.dia}` : ''} <span style={{ fontSize: 11, color: 'var(--muted)' }}>{m.unit}</span></p>
            </div>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 9, color: m.color, border: `1px solid ${m.color}`, padding: '4px 8px', borderRadius: 4 }}>{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function D2Profile() {
  return (
    <div style={{ padding: '52px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 18, color: 'var(--primary)' }}>EL</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Emma Lawson</h2>
            <p style={{ fontFamily: "'DM Mono'", fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>CL-2847 · F · 42Y</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>LAB RESULTS</p>
        </div>
        {[
          { test: 'Full Blood Count', date: '30 JUL 2026', status: 'NORMAL', c: 'var(--primary)' },
          { test: 'Lipid Panel', date: '15 JUN 2026', status: 'REVIEW', c: 'var(--warn)' },
          { test: 'Thyroid Function', date: '02 MAY 2026', status: 'NORMAL', c: 'var(--primary)' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '12px 18px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{r.test}</p>
              <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{r.date}</p>
            </div>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 9, color: r.c, border: `1px solid ${r.c}`, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>{r.status}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
        <p style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 12 }}>CARE TEAM</p>
        {[
          { role: 'GP', name: 'Dr. James Okafor' },
          { role: 'CARDIO', name: 'Dr. Sarah Chen' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: 'var(--muted)' }}>{m.role}</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Direction 3: One Step ────────────────────────────────────────────────────

const D3_VARS = {
  '--bg': '#FFFFFF',
  '--card': '#F0F7FF',
  '--primary': '#1B5FA8',
  '--progress': '#00B4D8',
  '--navy': '#0A2342',
  '--text': '#0A2342',
  '--muted': '#6B7D99',
  '--border': '#DDE6F0',
  '--success': '#059669',
} as React.CSSProperties

function D3Home() {
  return (
    <div style={{ padding: '52px 28px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <p style={{ fontFamily: "'Instrument Sans'", fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Wednesday 27 Aug</p>
        <h1 style={{ fontFamily: "'Instrument Sans'", fontSize: 32, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.15 }}>Good morning,{'\n'}Emma.</h1>
      </div>

      {/* Single focus card */}
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '24px', border: '1.5px solid var(--border)' }}>
        <p style={{ fontFamily: "'Instrument Sans'", fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Your Next Step</p>
        <h2 style={{ fontFamily: "'Instrument Sans'", fontSize: 22, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 8 }}>Cardiology appointment in 9 days</h2>
        <p style={{ fontFamily: "'Instrument Sans'", fontSize: 15, color: 'var(--muted)', lineHeight: 1.5 }}>Dr. Sarah Chen · Fri 5 Sep · 10:30 AM</p>
        <button style={{ marginTop: 20, width: '100%', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 14, padding: '16px', fontFamily: "'Instrument Sans'", fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          View details {Icon.arrow('white')}
        </button>
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Heart Rate', val: '68 bpm', good: true },
          { label: 'SpO₂', val: '98%', good: true },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: 'var(--card)', borderRadius: 16, padding: '16px', border: '1.5px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Instrument Sans'", fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: "'Instrument Sans'", fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>{s.val}</p>
            <p style={{ fontFamily: "'Instrument Sans'", fontSize: 11, color: 'var(--success)', marginTop: 4 }}>● Good</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function D3Book() {
  const [step, setStep] = useState(0)
  const [specialty, setSpecialty] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const total = 3

  const dates = ['Mon 1 Sep', 'Tue 2 Sep', 'Wed 3 Sep', 'Thu 4 Sep', 'Fri 5 Sep', 'Mon 8 Sep']

  return (
    <div style={{ padding: '52px 28px 24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? 'var(--progress)' : 'var(--border)', transition: 'background 0.4s ease' }} />
        ))}
      </div>

      {step === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: "'Instrument Sans'", fontSize: 28, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 8 }}>What do you need help with?</h2>
          <p style={{ fontFamily: "'Instrument Sans'", fontSize: 15, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.5 }}>Select a specialty. We'll find you the right doctor.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {['Cardiology', 'General Practice', 'Dermatology', 'Neurology'].map(s => (
              <button key={s} onClick={() => { setSpecialty(s); setStep(1) }} style={{ background: specialty === s ? 'var(--card)' : 'var(--bg)', border: `2px solid ${specialty === s ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 16, padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 17, fontWeight: 600, color: 'var(--navy)' }}>{s}</span>
                {Icon.chevron('var(--muted)')}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: "'Instrument Sans'", fontSize: 28, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 8 }}>Choose a date</h2>
          <p style={{ fontFamily: "'Instrument Sans'", fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>{specialty} · soonest availability</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {dates.map(d => (
              <button key={d} onClick={() => { setDate(d); setStep(2) }} style={{ background: date === d ? 'var(--primary)' : 'var(--card)', border: `2px solid ${date === d ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 14, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 16, fontWeight: 600, color: date === d ? 'white' : 'var(--navy)' }}>{d}</span>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 13, color: date === d ? 'rgba(255,255,255,0.8)' : 'var(--muted)' }}>10:30 available</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(0)} style={{ marginTop: 16, background: 'none', border: 'none', fontFamily: "'Instrument Sans'", fontSize: 14, color: 'var(--muted)', cursor: 'pointer', padding: '8px 0' }}>← Back</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E6F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'fadeUp 0.4s ease' }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Instrument Sans'", fontSize: 26, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>You're booked.</h2>
            <p style={{ fontFamily: "'Instrument Sans'", fontSize: 16, color: 'var(--muted)', lineHeight: 1.5 }}>Dr. Sarah Chen<br/>{specialty} · {date} · 10:30 AM</p>
          </div>
          <button onClick={() => { setStep(0); setSpecialty(''); setDate('') }} style={{ marginTop: 12, background: 'var(--card)', color: 'var(--primary)', border: '2px solid var(--border)', borderRadius: 14, padding: '14px 28px', fontFamily: "'Instrument Sans'", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Book another
          </button>
        </div>
      )}
    </div>
  )
}

function D3Health() {
  return (
    <div style={{ padding: '52px 28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'Instrument Sans'", fontSize: 28, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>Your health looks good.</h1>
        <p style={{ fontFamily: "'Instrument Sans'", fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>All key metrics in normal range · 27 Aug</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { metric: 'Heart Rate', val: '68', unit: 'bpm', low: 60, high: 100, current: 68, status: 'Normal' },
          { metric: 'Blood Pressure', val: '118/76', unit: 'mmHg', low: 90, high: 140, current: 118, status: 'Optimal' },
          { metric: 'SpO₂', val: '98', unit: '%', low: 94, high: 100, current: 98, status: 'Excellent' },
        ].map((m, i) => {
          const pct = ((m.current - m.low) / (m.high - m.low)) * 100
          return (
            <div key={i} style={{ background: 'var(--card)', borderRadius: 18, padding: '20px 22px', border: '1.5px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <p style={{ fontFamily: "'Instrument Sans'", fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{m.metric}</p>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 12, fontWeight: 600, color: 'var(--success)', background: '#E6F9F4', padding: '3px 10px', borderRadius: 20 }}>{m.status}</span>
              </div>
              <p style={{ fontFamily: "'Instrument Sans'", fontSize: 28, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>{m.val} <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>{m.unit}</span></p>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 6, position: 'relative' }}>
                <div style={{ position: 'absolute', left: `${pct}%`, top: -3, width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)', transform: 'translateX(-50%)', border: '2.5px solid white', boxShadow: '0 0 0 2px var(--primary)' }} />
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #e0edff, var(--primary))`, borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 11, color: 'var(--muted)' }}>{m.low}</span>
                <span style={{ fontFamily: "'Instrument Sans'", fontSize: 11, color: 'var(--muted)' }}>{m.high}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function D3Profile() {
  return (
    <div style={{ padding: '52px 28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--card)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Instrument Sans'", fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>EL</span>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Instrument Sans'", fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>Emma Lawson</h2>
          <p style={{ fontFamily: "'Instrument Sans'", fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>ID CL-2847 · Age 42</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontFamily: "'Instrument Sans'", fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Test Results</p>
        {[
          { name: 'Full Blood Count', date: '30 Jul 2026', status: 'Normal', ok: true },
          { name: 'Lipid Panel', date: '15 Jun 2026', status: 'Needs review', ok: false },
          { name: 'Thyroid Function', date: '2 May 2026', status: 'Normal', ok: true },
        ].map((r, i) => (
          <button key={i} style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: "'Instrument Sans'", fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>{r.name}</p>
              <p style={{ fontFamily: "'Instrument Sans'", fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{r.date}</p>
            </div>
            <span style={{ fontFamily: "'Instrument Sans'", fontSize: 12, fontWeight: 600, color: r.ok ? 'var(--success)' : '#B45309', background: r.ok ? '#E6F9F4' : '#FFF7E6', padding: '5px 12px', borderRadius: 20 }}>{r.status}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Direction 4: Stillwater ──────────────────────────────────────────────────

const D4_VARS = {
  '--bg': '#F7F9FC',
  '--card': '#FFFFFF',
  '--primary': '#1B5FA8',
  '--cyan': '#0891B2',
  '--navy': '#0F172A',
  '--text': '#0F172A',
  '--muted': '#64748B',
  '--border': '#E2E8F0',
  '--soft': '#EFF6FF',
  '--success': '#059669',
} as React.CSSProperties

function D4Home() {
  const [entered, setEntered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setEntered(true), 100); return () => clearTimeout(t) }, [])

  const cards = [
    { delay: 0, label: 'Heart Rate', val: '68', unit: 'bpm', sub: 'Last 30 min', dot: 'var(--success)' },
    { delay: 80, label: 'Blood Pressure', val: '118/76', unit: 'mmHg', sub: '26 Aug', dot: 'var(--success)' },
    { delay: 160, label: 'SpO₂', val: '98', unit: '%', sub: 'Today', dot: 'var(--success)' },
  ]

  return (
    <div style={{ padding: '52px 22px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(10px)', transition: 'all 0.5s ease' }}>
        <div>
          <p style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Wednesday, 27 Aug</p>
          <h1 style={{ fontFamily: "'Fraunces'", fontSize: 28, fontWeight: 400, color: 'var(--navy)', lineHeight: 1.2 }}>Good morning,<br /><em>Emma</em></h1>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}>
          <span style={{ fontFamily: "'Fraunces'", fontSize: 16, fontWeight: 600, color: 'var(--primary)' }}>EL</span>
        </div>
      </div>

      {/* Appointment card */}
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,23,42,0.06)', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease 0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Upcoming</p>
            <p style={{ fontFamily: "'Fraunces'", fontSize: 18, fontWeight: 400, color: 'var(--navy)' }}>Dr. Sarah Chen</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Cardiology · Fri 5 Sep · 10:30 AM</p>
          </div>
          <div style={{ background: 'var(--soft)', borderRadius: 12, padding: '10px 14px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <p style={{ fontFamily: "'Fraunces'", fontSize: 24, fontWeight: 500, color: 'var(--primary)', lineHeight: 1 }}>9</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>days</p>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 1, background: 'var(--border)' }} />
        <button style={{ marginTop: 12, width: '100%', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontFamily: "'Inter'", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s ease, transform 0.15s ease' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = '#1651A0' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'var(--primary)' }}>
          View appointment details
        </button>
      </div>

      {/* Metric cards */}
      {cards.map((c, i) => (
        <div key={i} style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', opacity: entered ? 1 : 0, transform: entered ? 'none' : 'translateY(10px)', transition: `all 0.5s ease ${0.2 + c.delay * 0.001}s` }}>
          <div>
            <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontFamily: "'Fraunces'", fontSize: 22, fontWeight: 400, color: 'var(--navy)' }}>{c.val} <span style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>{c.unit}</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: c.dot, fontWeight: 600 }}>● Normal</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function D4Book() {
  const [sel, setSel] = useState(-1)
  const [confirmed, setConfirmed] = useState(false)
  const slots = [
    { doc: 'Dr. Sarah Chen', spec: 'Cardiology', date: 'Fri 5 Sep', time: '10:30 AM' },
    { doc: 'Dr. James Okafor', spec: 'General Practice', date: 'Tue 2 Sep', time: '9:00 AM' },
    { doc: 'Dr. Priya Mehta', spec: 'Dermatology', date: 'Wed 10 Sep', time: '2:15 PM' },
  ]

  if (confirmed) return (
    <div style={{ padding: '52px 22px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" strokeDasharray="60" strokeDashoffset="0" style={{ animation: 'drawCheck 0.6s ease forwards' }}/>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '2px solid var(--primary)', animation: 'pulseRing 1.2s ease-out 0.3s forwards', opacity: 0 }} />
      </div>
      <div>
        <h2 style={{ fontFamily: "'Fraunces'", fontSize: 26, fontWeight: 400, color: 'var(--navy)', marginBottom: 8 }}>Appointment confirmed</h2>
        <p style={{ fontFamily: "'Inter'", fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{slots[sel]?.doc}<br/>{slots[sel]?.date} · {slots[sel]?.time}</p>
      </div>
      <button onClick={() => { setConfirmed(false); setSel(-1) }} style={{ background: 'var(--soft)', color: 'var(--primary)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '13px 24px', fontFamily: "'Inter'", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
        Back to booking
      </button>
    </div>
  )

  return (
    <div style={{ padding: '52px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Book Appointment</p>
        <h2 style={{ fontFamily: "'Fraunces'", fontSize: 24, fontWeight: 400, color: 'var(--navy)' }}>Available soon</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {slots.map((s, i) => (
          <button key={i} onClick={() => setSel(i)} style={{ background: sel === i ? 'var(--soft)' : 'var(--card)', border: `1.5px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 16, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: sel === i ? '0 0 0 3px rgba(27,95,168,0.08)' : '0 2px 6px rgba(15,23,42,0.04)' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontFamily: "'Fraunces'", fontSize: 16, fontWeight: 400, color: 'var(--navy)' }}>{s.doc}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.spec} · {s.date} · {s.time}</p>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`, background: sel === i ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}>
              {sel === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => sel >= 0 && setConfirmed(true)} disabled={sel < 0} style={{ background: sel >= 0 ? 'var(--primary)' : 'var(--border)', color: sel >= 0 ? 'white' : 'var(--muted)', borderRadius: 14, padding: '16px', fontFamily: "'Inter'", fontSize: 15, fontWeight: 600, border: 'none', cursor: sel >= 0 ? 'pointer' : 'default', transition: 'all 0.25s ease' }}>
        Confirm appointment
      </button>
    </div>
  )
}

function D4Health() {
  const [ticked, setTicked] = useState(false)
  useEffect(() => { const t = setTimeout(() => setTicked(true), 200); return () => clearTimeout(t) }, [])
  const metrics = [
    { label: 'Heart Rate', raw: 68, display: '68', unit: 'bpm', range: '60–100', pct: 53, good: true },
    { label: 'Blood Pressure', raw: 118, display: '118/76', unit: 'mmHg', range: '90–140', pct: 56, good: true },
    { label: 'Weight', raw: 64.2, display: '64.2', unit: 'kg', range: '55–75', pct: 46, good: true },
    { label: 'SpO₂', raw: 98, display: '98', unit: '%', range: '94–100', pct: 67, good: true },
  ]
  return (
    <div style={{ padding: '52px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Health Tracking</p>
        <h2 style={{ fontFamily: "'Fraunces'", fontSize: 24, fontWeight: 400, color: 'var(--navy)' }}>All metrics stable</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', opacity: ticked ? 1 : 0, transform: ticked ? 'none' : 'translateY(8px)', transition: `all 0.5s ease ${i * 0.08}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)' }}>{m.label}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, color: 'var(--success)' }}>● Normal</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Fraunces'", fontSize: 26, fontWeight: 400, color: 'var(--navy)', animation: ticked ? 'countUp 0.4s ease' : 'none' }}>{m.display}</span>
              <span style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)' }}>{m.unit}</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: ticked ? `${m.pct}%` : '0%', background: `linear-gradient(90deg, var(--soft), var(--primary))`, borderRadius: 4, transition: `width 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.1 + 0.3}s` }} />
            </div>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>Normal: {m.range} {m.unit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function D4Profile() {
  return (
    <div style={{ padding: '52px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Profile hero */}
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--border)' }}>
            <span style={{ fontFamily: "'Fraunces'", fontSize: 20, fontWeight: 500, color: 'var(--primary)' }}>EL</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Fraunces'", fontSize: 20, fontWeight: 400, color: 'var(--navy)' }}>Emma Lawson</h2>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Patient CL-2847 · Age 42</p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Results</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Full Blood Count', date: '30 Jul 2026', status: 'Normal', ok: true },
            { name: 'Lipid Panel', date: '15 Jun 2026', status: 'Review needed', ok: false },
            { name: 'Thyroid Function', date: '2 May 2026', status: 'Normal', ok: true },
          ].map((r, i) => (
            <div key={i} style={{ background: 'var(--card)', borderRadius: 14, padding: '14px 16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s ease, transform 0.2s ease', cursor: 'pointer', boxShadow: '0 2px 6px rgba(15,23,42,0.04)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 6px 20px rgba(15,23,42,0.1)'; el.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 6px rgba(15,23,42,0.04)'; el.style.transform = 'none' }}>
              <div>
                <p style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>{r.name}</p>
                <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.date}</p>
              </div>
              <span style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, color: r.ok ? 'var(--success)' : '#B45309', background: r.ok ? '#ECFDF5' : '#FFFBEB', padding: '4px 10px', borderRadius: 20, border: `1px solid ${r.ok ? '#A7F3D0' : '#FDE68A'}` }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Care team */}
      <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>Care Team</p>
        {[
          { role: 'GP', name: 'Dr. James Okafor' },
          { role: 'Cardiologist', name: 'Dr. Sarah Chen' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontFamily: "'Inter'", fontSize: 12, color: 'var(--muted)' }}>{m.role}</span>
            <span style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Nav bars ────────────────────────────────────────────────────────────────

function NavBar({ screen, onSelect, dir }: { screen: Screen; onSelect: (s: Screen) => void; dir: DirId }) {
  const items: { id: Screen; label: string; Icon: () => React.ReactNode }[] = [
    { id: 'home', label: 'Home', Icon: () => Icon.home() },
    { id: 'book', label: 'Book', Icon: () => Icon.calendar() },
    { id: 'health', label: 'Health', Icon: () => Icon.activity() },
    { id: 'profile', label: 'Profile', Icon: () => Icon.user() },
  ]

  const styles: Record<DirId, { bg: string; border: string; activeColor: string; inactiveColor: string; font: string }> = {
    1: { bg: '#FDFAF3', border: '#D4C9B4', activeColor: '#1B5FA8', inactiveColor: '#7B6E5E', font: "'Source Sans 3'" },
    2: { bg: '#162234', border: '#243449', activeColor: '#00C9C8', inactiveColor: '#7EAAD4', font: "'DM Sans'" },
    3: { bg: '#FFFFFF', border: '#DDE6F0', activeColor: '#1B5FA8', inactiveColor: '#6B7D99', font: "'Instrument Sans'" },
    4: { bg: '#FFFFFF', border: '#E2E8F0', activeColor: '#1B5FA8', inactiveColor: '#64748B', font: "'Inter'" },
  }
  const s = styles[dir]

  return (
    <div style={{ background: s.bg, borderTop: `1px solid ${s.border}`, display: 'flex', padding: '8px 0 4px' }}>
      {items.map(item => {
        const active = screen === item.id
        return (
          <button key={item.id} onClick={() => onSelect(item.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', color: active ? s.activeColor : s.inactiveColor, minHeight: 44 }}>
            <span style={{ color: active ? s.activeColor : s.inactiveColor }}>{item.Icon()}</span>
            <span style={{ fontFamily: s.font, fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: '0.03em' }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [dir, setDir] = useState<DirId>(1)
  const [screen, setScreen] = useState<Screen>('home')
  const [prevDir, setPrevDir] = useState<DirId>(1)
  const [showReport, setShowReport] = useState(false)

  if (showReport) return (
    <div style={{ minHeight: '100%', background: '#E4E9F0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 40px' }}>
      <button onClick={() => setShowReport(false)} style={{ marginBottom: 20, background: '#1B5FA8', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
        ← Back to demo
      </button>
      <div style={{ width: '100%', maxWidth: 375, borderRadius: 32, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.18)', height: 760, overflowY: 'auto' }}>
        <FoundationReport />
      </div>
    </div>
  )

  const handleDirChange = (d: DirId) => {
    setPrevDir(dir)
    setDir(d)
    setScreen('home')
  }

  const dirVars: Record<DirId, React.CSSProperties> = { 1: D1_VARS, 2: D2_VARS, 3: D3_VARS, 4: D4_VARS }
  const statusBarBg: Record<DirId, string> = { 1: '#F3EDE0', 2: '#0D1B2A', 3: '#FFFFFF', 4: '#F7F9FC' }
  const statusBarColor: Record<DirId, string> = { 1: '#0A2342', 2: '#EEF4FF', 3: '#0A2342', 4: '#0F172A' }

  return (
    <div style={{ minHeight: '100%', background: '#E4E9F0', fontFamily: 'Inter, sans-serif', padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Fraunces'", fontSize: 22, fontWeight: 400, color: '#1E293B', marginBottom: 4 }}>Clinical Trust · UI Directions</h1>
        <p style={{ fontFamily: "'Inter'", fontSize: 13, color: '#64748B' }}>4 distinct visual systems · same 4 screens</p>
      </div>

      {/* Direction tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, width: '100%', maxWidth: 375 }}>
        {DIRECTIONS.map(d => (
          <button key={d.id} onClick={() => handleDirChange(d.id)} style={{ padding: '10px 12px', borderRadius: 10, border: `2px solid ${dir === d.id ? '#1B5FA8' : '#CBD5E1'}`, background: dir === d.id ? '#1B5FA8' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}>
            <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: dir === d.id ? 'white' : '#334155', marginBottom: 2 }}>{d.name}</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: dir === d.id ? 'rgba(255,255,255,0.75)' : '#94A3B8', lineHeight: 1.3 }}>{d.tag}</p>
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{ width: 375, borderRadius: 44, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)', background: 'white', transition: 'box-shadow 0.3s ease' }}>
        {/* Status bar */}
        <div style={{ ...dirVars[dir], background: statusBarBg[dir], padding: '14px 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.4s ease' }}>
          <span style={{ fontFamily: dir === 2 ? "'DM Mono'" : "'Inter'", fontSize: 12, fontWeight: 600, color: statusBarColor[dir] }}>9:41</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[5,4,3].map(w => <div key={w} style={{ width: 3, height: w + 4, background: statusBarColor[dir], opacity: 0.8, borderRadius: 1 }} />)}
            <div style={{ width: 16, height: 8, border: `1.5px solid ${statusBarColor[dir]}`, borderRadius: 3, marginLeft: 4, position: 'relative', opacity: 0.8 }}>
              <div style={{ position: 'absolute', left: 1, top: 1, right: 3, bottom: 1, background: statusBarColor[dir], borderRadius: 1 }} />
              <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2, height: 5, background: statusBarColor[dir], borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ ...dirVars[dir], height: 620, overflowY: 'auto', background: 'var(--bg)', transition: 'background 0.4s ease' }}>
          {dir === 1 && screen === 'home'    && <D1Home />}
          {dir === 1 && screen === 'book'    && <D1Book />}
          {dir === 1 && screen === 'health'  && <D1Health />}
          {dir === 1 && screen === 'profile' && <D1Profile />}
          {dir === 2 && screen === 'home'    && <D2Home />}
          {dir === 2 && screen === 'book'    && <D2Book />}
          {dir === 2 && screen === 'health'  && <D2Health />}
          {dir === 2 && screen === 'profile' && <D2Profile />}
          {dir === 3 && screen === 'home'    && <D3Home />}
          {dir === 3 && screen === 'book'    && <D3Book />}
          {dir === 3 && screen === 'health'  && <D3Health />}
          {dir === 3 && screen === 'profile' && <D3Profile />}
          {dir === 4 && screen === 'home'    && <D4Home />}
          {dir === 4 && screen === 'book'    && <D4Book />}
          {dir === 4 && screen === 'health'  && <D4Health />}
          {dir === 4 && screen === 'profile' && <D4Profile />}
        </div>

        {/* Nav bar */}
        <div style={dirVars[dir]}>
          <NavBar screen={screen} onSelect={setScreen} dir={dir} />
        </div>

        {/* Home indicator */}
        <div style={{ ...dirVars[dir] as object, background: statusBarBg[dir], padding: '8px 0 12px', display: 'flex', justifyContent: 'center', transition: 'background 0.4s ease' }}>
          <div style={{ width: 120, height: 4, borderRadius: 4, background: statusBarColor[dir], opacity: 0.15 }} />
        </div>
      </div>

      {/* Foundation report button — only for D4 */}
      {dir === 4 && (
        <button onClick={() => setShowReport(true)} style={{ marginTop: 16, width: '100%', maxWidth: 375, background: '#0F172A', color: 'white', border: 'none', borderRadius: 12, padding: '14px 20px', fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          View Stillwater Foundation Report
        </button>
      )}

      {/* Caption */}
      <div style={{ marginTop: 12, maxWidth: 375, width: '100%', background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid #E2E8F0' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: '#1B5FA8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          {DIRECTIONS.find(d => d.id === dir)?.name} · {DIRECTIONS.find(d => d.id === dir)?.tag}
        </p>
        <p style={{ fontFamily: "'Inter'", fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{CAPTIONS[dir]}</p>
      </div>
    </div>
  )
}
