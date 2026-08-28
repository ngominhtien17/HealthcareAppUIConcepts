import { useState, useEffect, useRef } from 'react'

// ─── Stillwater Foundation Report ────────────────────────────────────────────
// Direction 4 · Clinical Trust Patient App · Production Handoff Document

const TOKEN = {
  // Primitives
  'blue-900':  '#0F172A',
  'blue-800':  '#1E3A5F',
  'blue-700':  '#1B5FA8',
  'blue-600':  '#2070C0',
  'blue-500':  '#3B82F6',
  'cyan-700':  '#0891B2',
  'cyan-500':  '#06B6D4',
  'cyan-100':  '#CFFAFE',
  'slate-50':  '#F8FAFC',
  'slate-100': '#F1F5F9',
  'slate-200': '#E2E8F0',
  'slate-300': '#CBD5E1',
  'slate-500': '#64748B',
  'slate-700': '#334155',
  'slate-900': '#0F172A',
  'white':     '#FFFFFF',
  'green-700': '#059669',
  'green-100': '#ECFDF5',
  'amber-700': '#B45309',
  'amber-100': '#FFFBEB',
  'red-600':   '#DC2626',
  'red-100':   '#FEF2F2',
}

const SEMANTIC = {
  '--background':        '#F7F9FC',
  '--surface':          '#FFFFFF',
  '--surface-raised':   '#FFFFFF',
  '--surface-overlay':  '#F1F5F9',
  '--primary':          '#1B5FA8',
  '--primary-hover':    '#1651A0',
  '--primary-active':   '#144090',
  '--primary-subtle':   '#EFF6FF',
  '--primary-border':   '#BFDBFE',
  '--cyan':             '#0891B2',
  '--cyan-subtle':      '#ECFEFF',
  '--text-default':     '#0F172A',
  '--text-secondary':   '#334155',
  '--text-muted':       '#64748B',
  '--text-disabled':    '#CBD5E1',
  '--text-inverse':     '#FFFFFF',
  '--border-default':   '#E2E8F0',
  '--border-strong':    '#CBD5E1',
  '--border-focus':     '#1B5FA8',
  '--success':          '#059669',
  '--success-subtle':   '#ECFDF5',
  '--warning':          '#B45309',
  '--warning-subtle':   '#FFFBEB',
  '--error':            '#DC2626',
  '--error-subtle':     '#FEF2F2',
}

const TYPE_SCALE = [
  { role: 'Display',    family: 'Fraunces', weight: '400 / 500', size: '32–40px', lh: '1.15', ls: '-0.01em', usage: 'Section hero titles only' },
  { role: 'Heading 1', family: 'Fraunces', weight: '400',        size: '26–28px', lh: '1.2',  ls: '-0.005em',usage: 'Screen title, primary h1' },
  { role: 'Heading 2', family: 'Fraunces', weight: '400',        size: '20–22px', lh: '1.25', ls: '0',        usage: 'Card headings, modal titles' },
  { role: 'Heading 3', family: 'Inter',    weight: '600',        size: '16–18px', lh: '1.3',  ls: '0',        usage: 'Section labels, list headers' },
  { role: 'Body L',    family: 'Inter',    weight: '400',        size: '16px',    lh: '1.6',  ls: '0',        usage: 'Primary reading text' },
  { role: 'Body M',    family: 'Inter',    weight: '400',        size: '14px',    lh: '1.55', ls: '0',        usage: 'Secondary text, descriptions' },
  { role: 'Body S',    family: 'Inter',    weight: '400',        size: '13px',    lh: '1.5',  ls: '0',        usage: 'Captions, timestamps' },
  { role: 'Label',     family: 'Inter',    weight: '600',        size: '11–12px', lh: '1.4',  ls: '0.05em',   usage: 'UPPERCASE section headers, tags' },
  { role: 'Metric',    family: 'Fraunces', weight: '400',        size: '24–28px', lh: '1.0',  ls: '-0.01em',  usage: 'Vital readings, statistics' },
]

const SPACING = [
  { token: '--space-1', px: '4px',  use: 'Icon gap, tight inline' },
  { token: '--space-2', px: '8px',  use: 'Internal padding (dense)' },
  { token: '--space-3', px: '12px', use: 'Compact card padding' },
  { token: '--space-4', px: '16px', use: 'Standard card padding' },
  { token: '--space-5', px: '20px', use: 'Generous card padding' },
  { token: '--space-6', px: '24px', use: 'Section padding, screen edge' },
  { token: '--space-7', px: '28px', use: 'Section gap' },
  { token: '--space-8', px: '32px', use: 'Large section gap' },
  { token: '--space-10', px: '40px', use: 'Screen top padding (below status bar)' },
  { token: '--space-12', px: '48px', use: 'Hero spacing' },
]

const RADIUS = [
  { token: '--radius-sm',  val: '8px',  use: 'Badges, tags, small chips' },
  { token: '--radius-md',  val: '12px', use: 'Input fields, small buttons' },
  { token: '--radius-lg',  val: '16px', use: 'Cards (standard)' },
  { token: '--radius-xl',  val: '20px', use: 'Cards (featured, appointment)' },
  { token: '--radius-2xl', val: '28px', use: 'Bottom sheets, modals' },
  { token: '--radius-full','val': '999px', use: 'Pills, status badges, avatars' },
]

const SHADOWS = [
  { token: '--shadow-xs', val: '0 1px 2px rgba(15,23,42,0.04)', use: 'Resting card — subtle lift' },
  { token: '--shadow-sm', val: '0 2px 8px rgba(15,23,42,0.06)', use: 'Default card depth' },
  { token: '--shadow-md', val: '0 4px 20px rgba(15,23,42,0.08)', use: 'Featured / active card' },
  { token: '--shadow-lg', val: '0 8px 32px rgba(15,23,42,0.12)', use: 'Modals, bottom sheets' },
  { token: '--shadow-focus', val: '0 0 0 3px rgba(27,95,168,0.18)', use: 'Focus ring (all interactive)' },
]

const MOTION = [
  { token: '--ease-out',    val: 'cubic-bezier(0.25,0.46,0.45,0.94)', use: 'Elements entering view' },
  { token: '--ease-in',     val: 'cubic-bezier(0.55,0.06,0.68,0.19)', use: 'Elements leaving view' },
  { token: '--ease-spring', val: 'cubic-bezier(0.34,1.56,0.64,1)',    use: 'Confirmations, success states' },
  { token: '--dur-fast',    val: '150ms', use: 'Hover, press states' },
  { token: '--dur-base',    val: '250ms', use: 'Most transitions' },
  { token: '--dur-slow',    val: '450ms', use: 'Page entrance, metric fill' },
  { token: '--dur-xslow',   val: '650ms', use: 'Stagger sequences, draw-check' },
]

const COMPONENTS = [
  {
    name: 'Button · Primary',
    spec: {
      height: '52px', padding: '0 24px', radius: 'var(--radius-lg)',
      bg: 'var(--primary)', color: 'white', font: 'Inter 600 15px',
      hover: 'bg → var(--primary-hover), shadow-sm',
      active: 'bg → var(--primary-active), scale(0.99)',
      focus: 'shadow-focus outline',
      disabled: 'bg → slate-200, color → slate-400, cursor: not-allowed',
    },
    note: 'Minimum touch target 52px height. Full-width on mobile by default.',
  },
  {
    name: 'Button · Secondary',
    spec: {
      height: '52px', padding: '0 24px', radius: 'var(--radius-lg)',
      bg: 'var(--primary-subtle)', color: 'var(--primary)', font: 'Inter 600 15px',
      border: '1.5px solid var(--primary-border)',
      hover: 'bg → #E0EEFF, border-color → var(--primary)',
      active: 'scale(0.99)',
      focus: 'shadow-focus outline',
      disabled: 'opacity: 0.45',
    },
    note: 'Use for secondary actions. Never stack two primary buttons.',
  },
  {
    name: 'Button · Ghost',
    spec: {
      height: '44px', padding: '0 16px', radius: 'var(--radius-md)',
      bg: 'transparent', color: 'var(--text-muted)', font: 'Inter 500 14px',
      hover: 'bg → slate-100',
      focus: 'shadow-focus outline',
    },
    note: 'Back navigation, cancel, tertiary actions only.',
  },
  {
    name: 'Card · Standard',
    spec: {
      padding: 'var(--space-4) var(--space-5)', radius: 'var(--radius-lg)',
      bg: 'var(--surface)', border: '1px solid var(--border-default)',
      shadow: 'var(--shadow-sm)',
      hover: 'shadow-md, translateY(-1px) — only on tappable cards',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
    },
    note: 'Add hover lift only when the card is a navigation target.',
  },
  {
    name: 'Card · Featured',
    spec: {
      padding: 'var(--space-5) var(--space-6)', radius: 'var(--radius-xl)',
      bg: 'var(--surface)', border: '1px solid var(--border-default)',
      shadow: 'var(--shadow-md)',
    },
    note: 'One per screen maximum. Used for the primary call-to-action (next appointment).',
  },
  {
    name: 'Input · Text Field',
    spec: {
      height: '52px', padding: '0 16px', radius: 'var(--radius-md)',
      bg: 'var(--surface)', border: '1.5px solid var(--border-default)',
      font: 'Inter 400 15px, color var(--text-default)',
      focus: 'border-color → var(--border-focus), shadow-focus',
      error: 'border-color → var(--error), shadow: 0 0 0 3px rgba(220,38,38,0.12)',
      label: 'Inter 600 11px UPPERCASE, color var(--text-muted), mb 6px',
    },
    note: 'Label always above the field, never floating. Placeholder text contrast ≥ 4.5:1.',
  },
  {
    name: 'Status Badge',
    spec: {
      height: '24px', padding: '0 10px', radius: 'var(--radius-full)',
      font: 'Inter 600 11px',
      variants: 'Normal → success/success-subtle | Review → warning/warning-subtle | Error → error/error-subtle',
      border: '1px solid (color with 40% opacity)',
    },
    note: 'Never convey status by color alone — always include the text label.',
  },
  {
    name: 'Metric Card',
    spec: {
      padding: 'var(--space-4) var(--space-5)', radius: 'var(--radius-lg)',
      value: 'Fraunces 400 26px, color text-default',
      unit: 'Inter 400 13px, color text-muted',
      label: 'Inter 400 12px, color text-muted, mb 8px',
      bar: 'h 4px, bg border-default, fill → linear-gradient(primary-subtle → primary)',
      entrance: 'opacity 0→1, translateY 8→0px, duration var(--dur-slow), stagger 80ms per card',
      fill: 'bar width 0→pct%, duration var(--dur-slow), cubic-bezier(0.25,0.46,0.45,0.94), delay +0.3s',
    },
    note: 'Bar animation plays once on mount only. No looping.',
  },
  {
    name: 'Bottom Navigation',
    spec: {
      height: '56px + safe-area-bottom', bg: 'var(--surface)',
      border: '1px solid var(--border-default) (top only)',
      items: '4 items, equal flex width',
      icon: '20×20px, color text-muted / primary (active)',
      label: 'Inter 400/600 10px, letter-spacing 0.03em',
      tap: 'minHeight 44px per item (full nav height)',
    },
    note: 'Active item: icon + label color = var(--primary), weight 600. No underline or pill indicator.',
  },
]

const ACCESSIBILITY = [
  { rule: 'WCAG AA (4.5:1)', scope: 'All body text ≥ 14px', check: 'text-default (#0F172A) on white → 19.1:1 ✓' },
  { rule: 'WCAG AA (3:1)',   scope: 'Large text ≥ 18px, icons, UI boundaries', check: 'primary (#1B5FA8) on white → 5.2:1 ✓' },
  { rule: 'WCAG AAA (7:1)', scope: 'Target for all body copy', check: 'text-default on background (#F7F9FC) → 16.4:1 ✓' },
  { rule: 'Touch target',   scope: 'All interactive elements', check: 'Min 52px height buttons, 44px min for nav items' },
  { rule: 'Focus visible',  scope: 'All keyboard / switch control', check: '3px solid ring: rgba(27,95,168,0.45) — AA 3:1 ✓' },
  { rule: 'Status + color', scope: 'All status badges and metric bars', check: 'Text label always present alongside color token' },
  { rule: 'Motion reduce',  scope: '@media (prefers-reduced-motion)', check: 'All transitions → immediate; animations disabled' },
  { rule: 'Font size floor', scope: 'Minimum rendered text', check: '11px for UPPERCASE labels only; body floor 13px' },
]

const SCREENS_ARCH = [
  {
    screen: 'Home / Dashboard',
    purpose: 'Single-glance health status + next appointment CTA',
    primary: 'Appointment card with countdown + primary button',
    secondary: 'Metric row cards (max 3), staggered entrance',
    avoid: 'No lists longer than 3 items. No secondary navigation.',
    entrance: 'Header fades up at 0ms, appointment card at 100ms, metrics stagger at 200/280/360ms',
  },
  {
    screen: 'Book Appointment',
    purpose: 'Friction-free slot selection',
    primary: 'Doctor/slot list with single-select radio cards',
    secondary: 'Confirm button (disabled until selection)',
    avoid: 'No calendar grid. No multi-step wizard. No upsells.',
    entrance: 'On confirm: replace view with confirmation state (no navigation). Checkmark draws at 600ms, pulse ring at 900ms.',
  },
  {
    screen: 'Health Tracking',
    purpose: 'Metric overview — not data analysis',
    primary: '4 metric cards with normalised range bar',
    secondary: 'Status badge per metric',
    avoid: 'No charts unless explicitly required. No date filters on main view.',
    entrance: 'Cards enter staggered (0, 80, 160, 240ms delay). Bars fill after 300ms. One entrance sequence per mount.',
  },
  {
    screen: 'Profile / Results',
    purpose: 'Record access and care team reference',
    primary: 'Test result list with hover lift and status badge',
    secondary: 'Care team block',
    avoid: 'No editable fields on this screen. No form patterns.',
    entrance: 'Avatar block fades up. Result rows enter at 100ms stagger.',
  },
]

// ─── Section primitives ───────────────────────────────────────────────────────

const F = {
  // Colors
  primary: '#1B5FA8',
  navy:    '#0F172A',
  muted:   '#64748B',
  border:  '#E2E8F0',
  bg:      '#F7F9FC',
  surface: '#FFFFFF',
  success: '#059669',
  warning: '#B45309',
  cyan:    '#0891B2',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.primary, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
      {children}
    </p>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: 16, padding: '20px', boxShadow: '0 2px 8px rgba(15,23,42,0.05)', ...style }}>
      {children}
    </div>
  )
}

function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '32px 0 24px' }}>
      {label && <span style={{ fontFamily: "'Inter'", fontSize: 10, fontWeight: 700, color: F.muted, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: F.border }} />
    </div>
  )
}

// ─── Section: Cover ───────────────────────────────────────────────────────────

function Cover() {
  return (
    <div style={{ background: F.primary, padding: '56px 28px 48px', position: 'relative', overflow: 'hidden' }}>
      {/* Watermark rings */}
      {[200, 320, 440].map((r, i) => (
        <div key={i} style={{ position: 'absolute', top: -r / 2, right: -r / 2, width: r, height: r, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
      ))}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Clinical Trust</span>
        </div>
        <h1 style={{ fontFamily: "'Fraunces'", fontSize: 36, fontWeight: 400, color: 'white', lineHeight: 1.15, marginBottom: 12 }}>
          Stillwater<br /><em>Foundation Report</em>
        </h1>
        <p style={{ fontFamily: "'Inter'", fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 32 }}>
          Design system specification for Direction 4 of the Clinical Trust Patient App. This document defines the complete token system, component behaviour, motion rules, and accessibility requirements for production implementation.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[['Version', '1.0'], ['Date', '27 Aug 2026'], ['Status', 'Ready for handoff']].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontFamily: "'Inter'", fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{k}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: 'white' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section: Concept ─────────────────────────────────────────────────────────

function ConceptSection() {
  const principles = [
    { title: 'Motion signals meaning', body: 'Every animation plays exactly once — on state change or mount. No looping. No decorative movement. The interface is still by default; motion is earned by context.' },
    { title: 'Serif anchors trust', body: 'Fraunces (Display) carries section titles and metric values. Its optical weight feels considered rather than clinical. Inter (Body) maintains legibility at small sizes without competing.' },
    { title: 'Depth without shadow', body: 'Cards use one drop shadow value. Hierarchy comes from background color shifts (surface → overlay) and border presence, not stacked shadow layers.' },
    { title: 'White space is therapeutic', body: 'Generous padding reduces cognitive load for patients under stress. No content appears without at least 22px screen margin. Never less than 16px between stacked cards.' },
  ]
  return (
    <section>
      <SectionLabel>01 · Concept</SectionLabel>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fraunces'", fontSize: 22, fontWeight: 400, color: F.navy, marginBottom: 10, lineHeight: 1.25 }}>Calm by constraint</h2>
        <p style={{ fontFamily: "'Inter'", fontSize: 14, color: F.muted, lineHeight: 1.7 }}>
          Stillwater is built around the observation that anxiety accompanies most healthcare interactions. The design response is structural restraint — fewer decisions per screen, motion that only appears when something has actually changed, and typography that feels handcrafted rather than generated.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {principles.map((p, i) => (
          <Card key={i} style={{ padding: '16px 18px' }}>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: F.navy, marginBottom: 6 }}>{p.title}</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6 }}>{p.body}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Color Tokens ────────────────────────────────────────────────────

function ColorSection() {
  const swatches = [
    { label: 'Primary', hex: '#1B5FA8', fg: 'white', desc: 'CTA buttons, active nav, link text on light' },
    { label: 'Primary Hover', hex: '#1651A0', fg: 'white', desc: 'Button hover state' },
    { label: 'Primary Subtle', hex: '#EFF6FF', fg: '#1B5FA8', desc: 'Card accent, soft badge bg' },
    { label: 'Cyan', hex: '#0891B2', fg: 'white', desc: 'Progress bars, range fill, secondary accent' },
    { label: 'Cyan Subtle', hex: '#ECFEFF', fg: '#0891B2', desc: 'Metric bar gradient start' },
    { label: 'Background', hex: '#F7F9FC', fg: '#0F172A', desc: 'App screen ground' },
    { label: 'Surface', hex: '#FFFFFF', fg: '#0F172A', desc: 'Cards, nav, modals' },
    { label: 'Surface Overlay', hex: '#F1F5F9', fg: '#334155', desc: 'Selected card bg, subtle sections' },
    { label: 'Text Default', hex: '#0F172A', fg: 'white', desc: 'Primary text — 19.1:1 on white' },
    { label: 'Text Secondary', hex: '#334155', fg: 'white', desc: 'Supporting text — 12.6:1 on white' },
    { label: 'Text Muted', hex: '#64748B', fg: 'white', desc: 'Placeholders, captions — 5.9:1 on white ✓' },
    { label: 'Border Default', hex: '#E2E8F0', fg: '#334155', desc: 'Card borders, dividers' },
    { label: 'Success', hex: '#059669', fg: 'white', desc: 'Normal status, confirmation' },
    { label: 'Success Subtle', hex: '#ECFDF5', fg: '#059669', desc: 'Normal badge background' },
    { label: 'Warning', hex: '#B45309', fg: 'white', desc: 'Review needed status' },
    { label: 'Warning Subtle', hex: '#FFFBEB', fg: '#B45309', desc: 'Review badge background' },
    { label: 'Error', hex: '#DC2626', fg: 'white', desc: 'Errors, destructive actions' },
    { label: 'Error Subtle', hex: '#FEF2F2', fg: '#DC2626', desc: 'Error badge background' },
  ]

  return (
    <section>
      <SectionLabel>02 · Color Tokens</SectionLabel>
      <Card style={{ padding: '14px 16px', marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6 }}>
          <strong style={{ color: F.navy }}>Two accent colors maximum:</strong> Primary Blue (#1B5FA8) and Cyan (#0891B2). All status colours (success, warning, error) are communicative, not decorative — they never appear for visual interest alone.
        </p>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {swatches.map((s, i) => (
          <div key={i} style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${F.border}` }}>
            <div style={{ width: 56, flexShrink: 0, background: s.hex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Inter'", fontSize: 9, color: s.fg, opacity: 0.8, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{s.hex}</span>
            </div>
            <div style={{ flex: 1, padding: '10px 14px', background: F.surface }}>
              <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: F.navy, marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: '14px 16px' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Implementation note</p>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
          Define all semantic tokens as CSS custom properties on <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 4px', borderRadius: 3 }}>:root</code>. Do not hardcode hex values inside component styles — always reference tokens so theming remains possible.
        </p>
      </div>
    </section>
  )
}

// ─── Section: Typography ──────────────────────────────────────────────────────

function TypographySection() {
  return (
    <section>
      <SectionLabel>03 · Typography</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { name: 'Fraunces', role: 'Display & Metrics', axes: 'opsz 9–144, wght 300–900', note: 'Variable font — request opsz,wght axes in Google Fonts CSS2 URL' },
          { name: 'Inter', role: 'Body, Labels, UI', axes: 'wght 300–700', note: 'Static or variable. Prefer variable for compression.' },
        ].map(f => (
          <Card key={f.name} style={{ padding: '14px' }}>
            <p style={{ fontFamily: f.name === 'Fraunces' ? "'Fraunces'" : "'Inter'", fontSize: f.name === 'Fraunces' ? 22 : 18, fontWeight: 400, color: F.navy, marginBottom: 8 }}>{f.name}</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, color: F.primary, marginBottom: 4 }}>{f.role}</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted, lineHeight: 1.5 }}>{f.note}</p>
          </Card>
        ))}
      </div>

      {/* Google Fonts URL */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontFamily: 'monospace', fontSize: 11, color: F.muted, wordBreak: 'break-all', lineHeight: 1.7 }}>
        <span style={{ color: F.primary, fontWeight: 700 }}>@import</span> url(<span style={{ color: '#059669' }}>'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap'</span>);
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TYPE_SCALE.map((t, i) => (
          <div key={i} style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14 }}>
            <div style={{ minWidth: 80 }}>
              <p style={{ fontFamily: "'Inter'", fontSize: 10, fontWeight: 700, color: F.primary, letterSpacing: '0.06em' }}>{t.role}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted, marginTop: 2 }}>{t.family}</p>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${F.border}`, paddingLeft: 14 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted }}>sz {t.size}</span>
                <span style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted }}>wt {t.weight}</span>
                <span style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted }}>lh {t.lh}</span>
                {t.ls !== '0' && <span style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted }}>ls {t.ls}</span>}
              </div>
              <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{t.usage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live type specimen */}
      <Card style={{ marginTop: 16, padding: '22px 20px' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 10, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Live specimen</p>
        <p style={{ fontFamily: "'Fraunces'", fontSize: 32, fontWeight: 400, color: F.navy, lineHeight: 1.15, marginBottom: 4 }}>Your health,<br/><em>clearly.</em></p>
        <p style={{ fontFamily: "'Inter'", fontSize: 14, color: F.muted, lineHeight: 1.7, marginBottom: 20 }}>Emma Lawson · Patient CL-2847. All metrics within normal range. Your next cardiology appointment is in 9 days.</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Fraunces'", fontSize: 28, fontWeight: 400, color: F.navy }}>68</span>
          <span style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted }}>bpm · Heart Rate</span>
        </div>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Normal range 60–100</p>
      </Card>
    </section>
  )
}

// ─── Section: Spacing & Geometry ──────────────────────────────────────────────

function SpacingSection() {
  return (
    <section>
      <SectionLabel>04 · Spacing & Geometry</SectionLabel>
      <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6, marginBottom: 20 }}>
        Base unit: <strong style={{ color: F.navy }}>4px</strong>. All spacing values are multiples. Component padding uses 4px multiples. Section gaps use 8px multiples. Never use odd values.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {SPACING.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: F.surface, border: `1px solid ${F.border}`, borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ width: parseInt(s.px) * 2, height: 16, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 3, flexShrink: 0, minWidth: 4, maxWidth: 64 }} />
            <div style={{ minWidth: 60 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: F.primary }}>{s.px}</p>
            </div>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{s.use}</p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: F.navy, marginBottom: 12 }}>Border Radius</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {RADIUS.map((r, i) => (
          <div key={i} style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: r.val === '999px' ? 999 : parseInt(r.val), padding: '10px 14px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: F.primary, marginBottom: 2 }}>{r.val}</p>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted, whiteSpace: 'nowrap' }}>{r.use.split(' ')[0]}</p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: F.navy, marginBottom: 12 }}>Elevation / Shadow Scale</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SHADOWS.map((s, i) => (
          <div key={i} style={{ background: F.surface, borderRadius: 10, padding: '12px 14px', boxShadow: s.val }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: F.primary }}>{s.token}</p>
            </div>
            <p style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted, marginBottom: 4 }}>{s.use}</p>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8' }}>{s.val}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Motion ──────────────────────────────────────────────────────────

function MotionSection() {
  const [played, setPlayed] = useState(false)
  const [barW, setBarW] = useState(0)
  const [cardVisible, setCardVisible] = useState(false)

  const demo = () => {
    setPlayed(false); setBarW(0); setCardVisible(false)
    setTimeout(() => { setCardVisible(true) }, 100)
    setTimeout(() => { setBarW(72) }, 500)
    setPlayed(true)
  }

  return (
    <section>
      <SectionLabel>05 · Motion System</SectionLabel>
      <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6, marginBottom: 20 }}>
        <strong style={{ color: F.navy }}>Motion rules:</strong> Animations trigger on mount (entrance) or state change (confirmation, selection). Never on idle. Always respect <code style={{ fontFamily: 'monospace', fontSize: 11, background: '#F1F5F9', padding: '1px 5px', borderRadius: 3 }}>prefers-reduced-motion: reduce</code> by setting all transition durations to 0.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {MOTION.map((m, i) => (
          <div key={i} style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 12 }}>
            <div style={{ minWidth: 110 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: F.primary }}>{m.token}</p>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${F.border}`, paddingLeft: 12 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: F.muted, marginBottom: 2 }}>{m.val}</p>
              <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{m.use}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live demo */}
      <Card style={{ padding: '20px' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Entrance sequence demo</p>
        <div style={{ opacity: cardVisible ? 1 : 0, transform: cardVisible ? 'none' : 'translateY(10px)', transition: 'all 450ms cubic-bezier(0.25,0.46,0.45,0.94)', marginBottom: 14 }}>
          <p style={{ fontFamily: "'Fraunces'", fontSize: 22, fontWeight: 400, color: F.navy, marginBottom: 4 }}>Heart Rate</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span style={{ fontFamily: "'Fraunces'", fontSize: 26, color: F.navy }}>68</span>
            <span style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted }}>bpm</span>
          </div>
          <div style={{ height: 4, background: F.border, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${barW}%`, background: `linear-gradient(90deg, #EFF6FF, #1B5FA8)`, borderRadius: 4, transition: 'width 650ms cubic-bezier(0.25,0.46,0.45,0.94) 0.3s' }} />
          </div>
        </div>
        <button onClick={demo} style={{ background: F.primary, color: 'white', border: 'none', borderRadius: 10, padding: '11px 20px', fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Play entrance ↻
        </button>
      </Card>

      {/* Stagger diagram */}
      <Card style={{ marginTop: 12, padding: '18px' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Stagger timing — Home screen</p>
        {[
          { label: 'Header (name + date)', delay: '0ms', dur: '500ms' },
          { label: 'Appointment card', delay: '100ms', dur: '500ms' },
          { label: 'Metric card 1', delay: '200ms', dur: '500ms' },
          { label: 'Metric card 2', delay: '280ms', dur: '500ms' },
          { label: 'Metric card 3', delay: '360ms', dur: '500ms' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ minWidth: 130 }}>
              <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{row.label}</p>
            </div>
            <div style={{ flex: 1, height: 6, background: F.border, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: `${parseInt(row.delay) / 9}%`, width: `${parseInt(row.dur) / 9}%`, height: '100%', background: F.primary, borderRadius: 3, opacity: 0.7 }} />
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: F.primary, minWidth: 40 }}>{row.delay}</p>
          </div>
        ))}
        <p style={{ fontFamily: "'Inter'", fontSize: 10, color: F.muted, marginTop: 8 }}>Timeline spans 0–860ms. All elements use ease-out curve.</p>
      </Card>
    </section>
  )
}

// ─── Section: Components ──────────────────────────────────────────────────────

function ComponentsSection() {
  const [btnHover, setBtnHover] = useState<number | null>(null)
  const [radioSel, setRadioSel] = useState(-1)

  return (
    <section>
      <SectionLabel>06 · Component Specifications</SectionLabel>

      {/* Button demos */}
      <Card style={{ padding: '20px', marginBottom: 12 }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Buttons</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onMouseEnter={() => setBtnHover(0)} onMouseLeave={() => setBtnHover(null)}
            style={{ height: 52, borderRadius: 12, background: btnHover === 0 ? '#1651A0' : F.primary, color: 'white', border: 'none', fontFamily: "'Inter'", fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms ease' }}>
            Primary · Confirm appointment
          </button>
          <button
            onMouseEnter={() => setBtnHover(1)} onMouseLeave={() => setBtnHover(null)}
            style={{ height: 52, borderRadius: 12, background: btnHover === 1 ? '#E0EEFF' : '#EFF6FF', color: F.primary, border: '1.5px solid #BFDBFE', fontFamily: "'Inter'", fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms ease' }}>
            Secondary · View details
          </button>
          <button style={{ height: 44, borderRadius: 10, background: 'transparent', color: F.muted, border: 'none', fontFamily: "'Inter'", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Ghost · Back
          </button>
          <button disabled style={{ height: 52, borderRadius: 12, background: '#E2E8F0', color: '#CBD5E1', border: 'none', fontFamily: "'Inter'", fontSize: 15, fontWeight: 600, cursor: 'not-allowed' }}>
            Disabled state
          </button>
        </div>
      </Card>

      {/* Radio cards */}
      <Card style={{ padding: '20px', marginBottom: 12 }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Selection card (radio)</p>
        {['Dr. Sarah Chen · Cardiology', 'Dr. James Okafor · General Practice'].map((s, i) => (
          <div key={i} onClick={() => setRadioSel(i)} style={{ background: radioSel === i ? '#EFF6FF' : F.surface, border: `1.5px solid ${radioSel === i ? F.primary : F.border}`, borderRadius: 14, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 8, boxShadow: radioSel === i ? '0 0 0 3px rgba(27,95,168,0.08)' : 'none', transition: 'all 200ms ease' }}>
            <p style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 500, color: F.navy }}>{s}</p>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${radioSel === i ? F.primary : F.border}`, background: radioSel === i ? F.primary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms ease', flexShrink: 0 }}>
              {radioSel === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            </div>
          </div>
        ))}
      </Card>

      {/* Status badges */}
      <Card style={{ padding: '20px', marginBottom: 12 }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Status badges</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Normal', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
            { label: 'Review needed', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
            { label: 'Pending', bg: '#EFF6FF', color: F.primary, border: '#BFDBFE' },
            { label: 'Error', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
          ].map((b, i) => (
            <span key={i} style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, color: b.color, background: b.bg, border: `1px solid ${b.border}`, padding: '5px 12px', borderRadius: 999 }}>
              {b.label}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted, marginTop: 12 }}>Rule: always pair with text label. Never rely on color alone for status communication.</p>
      </Card>

      {/* Component spec table */}
      {COMPONENTS.map((c, i) => (
        <div key={i} style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: `1px solid ${F.border}` }}>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 700, color: F.navy }}>{c.name}</p>
          </div>
          <div style={{ padding: '12px 16px' }}>
            {Object.entries(c.spec).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: `1px solid #F1F5F9` }}>
                <p style={{ fontFamily: 'monospace', fontSize: 11, color: F.cyan, minWidth: 70, flexShrink: 0 }}>{k}</p>
                <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted, lineHeight: 1.5 }}>{v as string}</p>
              </div>
            ))}
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.warning, marginTop: 10, fontStyle: 'italic' }}>⚠ {c.note}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

// ─── Section: Accessibility ───────────────────────────────────────────────────

function AccessibilitySection() {
  return (
    <section>
      <SectionLabel>07 · Accessibility</SectionLabel>
      <Card style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.7 }}>
          Target: <strong style={{ color: F.navy }}>WCAG 2.2 AA throughout, AAA for all body text.</strong> Patient demographics span 18–85+, including low-vision users and first-time digital healthcare users. Every decision must withstand scrutiny at 150% OS text scale.
        </p>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ACCESSIBILITY.map((a, i) => (
          <div key={i} style={{ background: F.surface, border: `1px solid ${F.border}`, borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: 6, background: i < 3 ? F.success : F.primary, flexShrink: 0 }} />
            <div style={{ padding: '12px 14px', flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: F.primary }}>{a.rule}</span>
                <span style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted }}>{a.scope}</span>
              </div>
              <p style={{ fontFamily: "'Inter'", fontSize: 12, color: F.success, fontWeight: 600 }}>{a.check}</p>
            </div>
          </div>
        ))}
      </div>
      <Card style={{ marginTop: 16, padding: '16px', background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 8 }}>Reduced motion implementation</p>
        <div style={{ background: '#ECFDF5', borderRadius: 8, padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: '#047857', lineHeight: 1.7 }}>
          {'@media (prefers-reduced-motion: reduce) {'}<br />
          {'  *, *::before, *::after {'}<br />
          {'    animation-duration: 0.01ms !important;'}<br />
          {'    transition-duration: 0.01ms !important;'}<br />
          {'  }'}<br />
          {'}'}
        </div>
      </Card>
    </section>
  )
}

// ─── Section: Screen Architecture ────────────────────────────────────────────

function ScreenArchSection() {
  return (
    <section>
      <SectionLabel>08 · Screen Architecture</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SCREENS_ARCH.map((s, i) => (
          <Card key={i} style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: F.primary }}>{i + 1}</span>
              </div>
              <p style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 700, color: F.navy }}>{s.screen}</p>
            </div>
            <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6, marginBottom: 10 }}>{s.purpose}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Primary', val: s.primary, color: F.primary },
                { label: 'Secondary', val: s.secondary, color: F.muted },
                { label: 'Avoid', val: s.avoid, color: '#DC2626' },
                { label: 'Entrance', val: s.entrance, color: F.cyan },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', gap: 10 }}>
                  <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: r.color, minWidth: 56, flexShrink: 0 }}>{r.label}</p>
                  <p style={{ fontFamily: "'Inter'", fontSize: 11, color: F.muted, lineHeight: 1.5 }}>{r.val}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Implementation Checklist ───────────────────────────────────────

function ChecklistSection() {
  const groups = [
    {
      title: 'Before first component',
      items: [
        'Define all CSS custom properties in :root (semantic tokens)',
        'Import Fraunces (opsz,wght axes) + Inter via Google Fonts CSS2',
        '@media prefers-reduced-motion block in global CSS',
        'Base font-size: 16px on <html>, line-height: 1.5 on body',
        'scrollbar-width: none on * (hide native scrollbars)',
        'box-sizing: border-box on *',
      ],
    },
    {
      title: 'Typography rules',
      items: [
        'All headings: Fraunces — never Inter',
        'All body, labels, UI: Inter — never Fraunces',
        'Minimum body font-size: 13px (labels only); body floor 14px',
        'UPPERCASE labels: Inter 700, font-size 11px, letter-spacing 0.06em+',
        'Metric values: Fraunces 400 24–28px with Inter unit suffix',
        'Line-height ≥ 1.5 for all body text',
      ],
    },
    {
      title: 'Component rules',
      items: [
        'All interactive elements: min height 44px (nav), 52px (buttons)',
        'Focus rings: box-shadow 0 0 0 3px rgba(27,95,168,0.18) — no outline: none',
        'Status badges: always text label + color, never color alone',
        'Cards: border + shadow-sm by default; shadow-md on featured/hover',
        'Bottom nav: 4 items max, active = primary color + weight 600',
        'Disabled state: opacity or muted color — never remove from tab order',
      ],
    },
    {
      title: 'Motion rules',
      items: [
        'Entrance animations: opacity 0→1 + translateY 8–12px → 0',
        'Stagger: 80ms delay increment between sibling cards',
        'Metric bar fill: delay 300ms after card entrance, dur 650ms ease-out',
        'Confirmation: draw-check at 600ms, pulse-ring at 900ms, both once only',
        'Hover states: 150ms transition — no longer',
        'Never animate on idle — motion = state change only',
      ],
    },
    {
      title: 'Content rules',
      items: [
        'No lorem ipsum — all placeholder content is realistic (real names, dates, values)',
        'Date format: DD Mon YYYY (27 Aug 2026), time: 10:30 AM (12-hour)',
        'Patient ID format: CL-XXXX',
        'Metric units: bpm, mmHg, kg, % — always appended as Inter 13px muted',
        'No stock medical imagery — no stethoscopes, no medical cross icons',
        'Screen headings: one per screen, Fraunces, max 3 words',
      ],
    },
  ]

  const [checked, setChecked] = useState<Set<string>>(new Set())
  const toggle = (key: string) => setChecked(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next })

  return (
    <section>
      <SectionLabel>09 · Implementation Checklist</SectionLabel>
      <p style={{ fontFamily: "'Inter'", fontSize: 13, color: F.muted, lineHeight: 1.6, marginBottom: 20 }}>
        Tap each item to mark complete. This checklist covers the minimum requirements before Stillwater can be considered production-ready.
      </p>
      {groups.map((g, gi) => (
        <div key={gi} style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, color: F.navy, marginBottom: 8 }}>{g.title}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {g.items.map((item, ii) => {
              const key = `${gi}-${ii}`
              const done = checked.has(key)
              return (
                <div key={ii} onClick={() => toggle(key)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: done ? '#F0FDF4' : F.surface, border: `1px solid ${done ? '#A7F3D0' : F.border}`, borderRadius: 10, padding: '10px 14px', cursor: 'pointer', transition: 'all 200ms ease' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${done ? F.success : F.border}`, background: done ? F.success : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 200ms ease' }}>
                    {done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>}
                  </div>
                  <p style={{ fontFamily: "'Inter'", fontSize: 12, color: done ? '#065F46' : F.muted, lineHeight: 1.5, textDecoration: done ? 'line-through' : 'none', transition: 'color 200ms ease' }}>{item}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Progress */}
      <Card style={{ marginTop: 8, padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 600, color: F.navy }}>Handoff progress</p>
          <p style={{ fontFamily: "'Inter'", fontSize: 13, fontWeight: 700, color: F.primary }}>{checked.size}/{groups.reduce((a, g) => a + g.items.length, 0)}</p>
        </div>
        <div style={{ height: 6, background: F.border, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(checked.size / groups.reduce((a, g) => a + g.items.length, 0)) * 100}%`, background: `linear-gradient(90deg, #EFF6FF, #1B5FA8)`, borderRadius: 6, transition: 'width 300ms ease' }} />
        </div>
      </Card>
    </section>
  )
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

function TableOfContents({ onNav }: { onNav: (id: string) => void }) {
  const sections = [
    { id: 'concept', n: '01', label: 'Concept' },
    { id: 'color', n: '02', label: 'Color Tokens' },
    { id: 'type', n: '03', label: 'Typography' },
    { id: 'spacing', n: '04', label: 'Spacing & Geometry' },
    { id: 'motion', n: '05', label: 'Motion System' },
    { id: 'components', n: '06', label: 'Components' },
    { id: 'a11y', n: '07', label: 'Accessibility' },
    { id: 'screens', n: '08', label: 'Screen Architecture' },
    { id: 'checklist', n: '09', label: 'Implementation Checklist' },
  ]
  return (
    <div style={{ padding: '24px 22px 20px', background: F.surface, borderBottom: `1px solid ${F.border}` }}>
      <p style={{ fontFamily: "'Inter'", fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Contents</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => onNav(s.id)} style={{ background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: F.primary, minWidth: 20 }}>{s.n}</span>
            <span style={{ fontFamily: "'Inter'", fontSize: 12, color: F.muted }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function FoundationReport() {
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    concept: useRef(null),
    color: useRef(null),
    type: useRef(null),
    spacing: useRef(null),
    motion: useRef(null),
    components: useRef(null),
    a11y: useRef(null),
    screens: useRef(null),
    checklist: useRef(null),
  }

  const scrollTo = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: F.bg, minHeight: '100%' }}>
      <Cover />
      <TableOfContents onNav={scrollTo} />

      <div style={{ padding: '32px 22px 60px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {([
          ['concept', <ConceptSection />],
          ['color', <ColorSection />],
          ['type', <TypographySection />],
          ['spacing', <SpacingSection />],
          ['motion', <MotionSection />],
          ['components', <ComponentsSection />],
          ['a11y', <AccessibilitySection />],
          ['screens', <ScreenArchSection />],
          ['checklist', <ChecklistSection />],
        ] as [string, React.ReactNode][]).map(([id, Component], i) => (
          <div key={id} ref={sectionRefs[id] as React.RefObject<HTMLDivElement>}>
            {i > 0 && <Divider />}
            {Component}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: F.primary, padding: '28px 22px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Fraunces'", fontSize: 18, fontWeight: 400, color: 'white', marginBottom: 6 }}>Clinical Trust · Stillwater</p>
        <p style={{ fontFamily: "'Inter'", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Foundation v1.0 · 27 Aug 2026 · Ready for production handoff</p>
      </div>
    </div>
  )
}
