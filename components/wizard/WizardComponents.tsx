'use client';

import React, { useState } from 'react';
import { OptionConfig, ProgressStep } from '@/lib/types';

// ─── Design tokens ────────────────────────────────────────────────

export const WC = {
  green: '#1A3C34',
  terra: '#C4552A',
  bg: '#EBEBEB',
  white: '#FFFFFF',
  greenLight: 'rgba(26, 60, 52, 0.08)',
  greenMid: 'rgba(26, 60, 52, 0.15)',
  border: '#E0E0E0',
  textPrimary: '#1a1a1a',
  textMuted: '#888888',
  textLight: '#aaaaaa',
} as const;

// ─── ProgressBar ─────────────────────────────────────────────────

export function ProgressBar({ steps, currentStep }: { steps: ProgressStep[]; currentStep: number }) {
  return (
    <div>
      {/* Desktop */}
      <div
        className="progress-desktop"
        style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '28px 32px 20px', position: 'sticky', top: 0, zIndex: 100,
          background: WC.bg,
        }}
      >
        {steps.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <React.Fragment key={step.id}>
              {i > 0 && (
                <div style={{
                  flex: 1, height: '1.5px', marginTop: '16px', flexShrink: 1, minWidth: '8px',
                  background: isDone ? WC.green : '#d4d4d4',
                  transition: 'background 0.3s',
                }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {isDone ? (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: WC.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: isActive ? WC.terra : '#e0e0e0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? '0 0 0 5px rgba(196,85,42,0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: isActive ? WC.white : '#aaa' }}>
                      {i + 1}
                    </span>
                  </div>
                )}
                <span style={{
                  letterSpacing: '0.05em', fontWeight: isActive ? '600' : '400',
                  color: isActive ? WC.terra : isDone ? WC.green : WC.textLight,
                  textTransform: 'uppercase', whiteSpace: 'nowrap', fontSize: '12px',
                }}>
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* Mobile */}
      <div
        className="progress-mobile"
        style={{
          display: 'none', background: WC.white, borderBottom: '1px solid #e8e8e8',
          padding: '14px 20px', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}
      >
        <span style={{ fontSize: '13px', color: WC.textMuted }}>Stap {currentStep + 1} van {steps.length}</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: WC.terra, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {steps[currentStep]?.label}
        </span>
      </div>
    </div>
  );
}

// ─── BlockHeader ─────────────────────────────────────────────────

export function BlockHeader({ title, subtitle, note }: { title: string; subtitle?: string; note?: string }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h2 style={{ fontSize: '26px', fontWeight: '500', color: WC.green, margin: '0 0 8px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: '16px', color: '#777', margin: '0', lineHeight: 1.5 }}>{subtitle}</p>}
      {note && <p style={{ fontSize: '13px', color: WC.terra, margin: '8px 0 0', fontStyle: 'italic' }}>{note}</p>}
    </div>
  );
}

// ─── SectionLabel ────────────────────────────────────────────────

export function SectionLabel({ label, hint, subPrompts, required }: {
  label: string; hint?: string; subPrompts?: string[]; required?: boolean;
}) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '15px', fontWeight: '500', color: WC.textPrimary, marginBottom: hint ? '4px' : 0 }}>
        {label}{required && <span style={{ color: WC.terra, marginLeft: '3px' }}>*</span>}
      </div>
      {hint && <p style={{ fontSize: '13px', color: WC.textMuted, margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>{hint}</p>}
      {subPrompts?.map((p, i) => (
        <p key={i} style={{ fontSize: '13px', color: '#bbb', margin: '3px 0 0', fontStyle: 'italic', lineHeight: 1.4 }}>— {p}</p>
      ))}
    </div>
  );
}

// ─── TextInput ───────────────────────────────────────────────────

export function TextInput({ label, type, placeholder, value, onChange, required, note }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; note?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ fontSize: '14px', fontWeight: '500', color: WC.textPrimary, marginBottom: '7px' }}>
        {label}{required && <span style={{ color: WC.terra, marginLeft: '3px' }}>*</span>}
      </div>
      <input
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px', fontSize: '15px', lineHeight: 1.4,
          border: `1.5px solid ${focused ? WC.green : WC.border}`, borderRadius: '7px',
          outline: 'none', fontFamily: 'Questrial, sans-serif',
          background: WC.white, color: WC.textPrimary,
          transition: 'border-color 0.15s', boxSizing: 'border-box',
        }}
      />
      {note && <p style={{ fontSize: '12px', color: WC.textMuted, margin: '5px 0 0', fontStyle: 'italic' }}>{note}</p>}
    </div>
  );
}

// ─── SingleSelectCards ───────────────────────────────────────────

export function SingleSelectCards({ options, value, onChange }: {
  options: OptionConfig[]; value: string | null; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
      {options.map(opt => {
        const sel = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '15px 18px', borderRadius: '7px', cursor: 'pointer',
              border: `1.5px solid ${sel ? WC.green : WC.border}`,
              background: sel ? WC.greenLight : WC.white,
              display: 'flex', alignItems: 'flex-start', gap: '13px',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
              border: `2px solid ${sel ? WC.green : '#ccc'}`,
              background: sel ? WC.green : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              {sel && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: WC.white }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: sel ? '500' : '400', color: WC.textPrimary, marginBottom: opt.description ? '3px' : 0 }}>
                {opt.label}
              </div>
              {opt.description && <div style={{ fontSize: '13px', color: WC.textMuted, lineHeight: 1.4 }}>{opt.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Top3Select ──────────────────────────────────────────────────

export function Top3Select({ options, value, onChange, maxSelect = 3, allowCustom }: {
  options: string[]; value: string[]; onChange: (v: string[]) => void;
  maxSelect?: number; allowCustom?: boolean;
}) {
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [equalWeight, setEqualWeight] = useState(false);

  const getRank = (opt: string) => {
    const idx = value.indexOf(opt);
    return idx === -1 ? null : idx + 1;
  };

  const handleClick = (opt: string) => {
    const rank = getRank(opt);
    if (rank !== null) {
      onChange(value.filter(v => v !== opt));
    } else if (value.length < maxSelect) {
      onChange([...value, opt]);
    }
  };

  const addCustom = () => {
    const t = customText.trim();
    if (t && value.length < maxSelect && !value.includes(t)) {
      onChange([...value, t]);
      setCustomText('');
      setShowCustom(false);
    }
  };

  const allOptions = [...options, ...value.filter(v => !options.includes(v))];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {allOptions.map(opt => {
          const rank = getRank(opt);
          const disabled = rank === null && value.length >= maxSelect;
          return (
            <div
              key={opt}
              onClick={() => !disabled && handleClick(opt)}
              style={{
                padding: '12px 16px', borderRadius: '7px', cursor: disabled ? 'default' : 'pointer',
                border: `1.5px solid ${rank !== null ? WC.green : disabled ? '#eee' : WC.border}`,
                background: rank !== null ? WC.greenLight : disabled ? '#fafafa' : WC.white,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: disabled ? 0.45 : 1, transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '14px', color: rank !== null ? WC.green : WC.textPrimary, fontWeight: rank !== null ? '500' : '400' }}>
                {opt}
              </span>
              {rank !== null && (
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: WC.terra, color: WC.white, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700',
                }}>{rank}</div>
              )}
            </div>
          );
        })}
        {allowCustom && (
          <div style={{ marginTop: '4px' }}>
            {!showCustom ? (
              <button
                type="button"
                onClick={() => setShowCustom(true)}
                style={{
                  background: 'none', border: 'none', color: WC.terra, fontSize: '13px',
                  cursor: value.length < maxSelect ? 'pointer' : 'default',
                  fontFamily: 'Questrial, sans-serif', padding: 0,
                  opacity: value.length < maxSelect ? 1 : 0.4, textDecoration: 'underline',
                }}
              >
                + Eigen optie toevoegen
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  autoFocus
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom()}
                  placeholder="Typ je eigen optie…"
                  style={{
                    flex: 1, padding: '10px 12px', fontSize: '14px',
                    border: `1.5px solid ${WC.green}`, borderRadius: '6px',
                    outline: 'none', fontFamily: 'Questrial, sans-serif',
                  }}
                />
                <button type="button" onClick={addCustom} style={{
                  padding: '10px 16px', background: WC.green, color: WC.white,
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  fontFamily: 'Questrial, sans-serif', fontSize: '14px',
                }}>Voeg toe</button>
                <button type="button" onClick={() => { setShowCustom(false); setCustomText(''); }} style={{
                  padding: '10px', background: 'transparent', border: `1.5px solid ${WC.border}`,
                  borderRadius: '6px', cursor: 'pointer', color: WC.textMuted, fontSize: '14px',
                }}>✕</button>
              </div>
            )}
          </div>
        )}
      </div>
      {value.length > 0 && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', marginTop: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={equalWeight}
            onChange={e => setEqualWeight(e.target.checked)}
            style={{ marginTop: '2px', accentColor: WC.green, width: '15px', height: '15px', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', color: WC.green, lineHeight: 1.45 }}>
            Deze drie zijn voor ons ongeveer even belangrijk, volgorde maakt niet veel uit
          </span>
        </label>
      )}
    </div>
  );
}

// ─── MultiSelectCards ────────────────────────────────────────────

export function MultiSelectCards({ options, value, onChange, maxSelect }: {
  options: (OptionConfig | string)[]; value: string[];
  onChange: (v: string[]) => void; maxSelect?: number;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v));
    } else if (!maxSelect || value.length < maxSelect) {
      onChange([...value, v]);
    }
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const v = typeof opt === 'string' ? opt : opt.value;
        const sel = value.includes(v);
        const disabled = !sel && !!maxSelect && value.length >= maxSelect;
        return (
          <div
            key={v}
            onClick={() => !disabled && toggle(v)}
            style={{
              padding: '10px 16px', borderRadius: '6px', cursor: disabled ? 'default' : 'pointer',
              border: `1.5px solid ${sel ? WC.green : disabled ? '#eee' : WC.border}`,
              background: sel ? WC.greenLight : disabled ? '#fafafa' : WC.white,
              fontSize: '14px', color: sel ? WC.green : disabled ? '#ccc' : WC.textPrimary,
              fontWeight: sel ? '500' : '400', opacity: disabled ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >{label}</div>
        );
      })}
    </div>
  );
}

// ─── TextareaField ───────────────────────────────────────────────

export function TextareaField({ label, hint, subPrompts, placeholder, value, onChange, required, toneHint }: {
  label: string; hint?: string; subPrompts?: string[]; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; toneHint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <SectionLabel label={label} hint={hint} subPrompts={subPrompts} required={required} />
      {toneHint && <p style={{ fontSize: '13px', color: '#bbb', fontStyle: 'italic', margin: '-6px 0 10px', lineHeight: 1.4 }}>{toneHint}</p>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        style={{
          width: '100%', padding: '14px', fontSize: '15px', lineHeight: 1.6,
          border: `1.5px solid ${focused ? WC.green : WC.border}`, borderRadius: '7px',
          resize: 'vertical', outline: 'none',
          fontFamily: 'Questrial, sans-serif', color: WC.textPrimary,
          background: WC.white, minHeight: '120px', transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// ─── MonthGrid ───────────────────────────────────────────────────

type MonthState = 'druk' | 'rustig' | null;

export function MonthGrid({ months, value, onChange }: {
  months: string[]; value: Record<string, MonthState>; onChange: (v: Record<string, MonthState>) => void;
}) {
  const STATES: MonthState[] = [null, 'druk', 'rustig'];
  const COLORS: Record<string, { bg: string; border: string; color: string; label: string }> = {
    none: { bg: WC.white, border: WC.border, color: WC.textPrimary, label: '' },
    druk: { bg: 'rgba(196,85,42,0.1)', border: WC.terra, color: WC.terra, label: 'Druk' },
    rustig: { bg: WC.greenLight, border: WC.green, color: WC.green, label: 'Rustig' },
  };

  const toggle = (m: string) => {
    const cur = value[m] ?? null;
    const next = STATES[(STATES.indexOf(cur) + 1) % STATES.length];
    onChange({ ...value, [m]: next });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {(['druk', 'rustig'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: WC.textMuted }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: COLORS[s].border }} />
            {COLORS[s].label}
          </div>
        ))}
        <span style={{ fontSize: '12px', color: WC.textLight }}>Neutraal = niet aangeklikt · klik om te wisselen</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
        {months.map(m => {
          const state = value[m] ?? null;
          const c = state ? COLORS[state] : COLORS.none;
          return (
            <div
              key={m}
              onClick={() => toggle(m)}
              style={{
                padding: '13px 0', textAlign: 'center', borderRadius: '6px', cursor: 'pointer',
                border: `1.5px solid ${c.border}`, background: c.bg, color: c.color,
                fontSize: '14px', fontWeight: state ? '500' : '400', transition: 'all 0.15s',
              }}
            >{m}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DayTimeSelect ───────────────────────────────────────────────

export function DayTimeSelect({ days, times, value, onChange }: {
  days: string[];
  times: Array<{ value: string; label: string }>;
  value: { day: string | null; time: string | null };
  onChange: (v: { day: string | null; time: string | null }) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: '11px', color: WC.textMuted, margin: '0 0 10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dag</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '24px' }}>
        {days.map(d => {
          const sel = value.day === d;
          return (
            <div
              key={d}
              onClick={() => onChange({ ...value, day: d })}
              style={{
                padding: '10px 15px', borderRadius: '6px', cursor: 'pointer',
                border: `1.5px solid ${sel ? WC.green : WC.border}`,
                background: sel ? WC.green : WC.white,
                color: sel ? WC.white : WC.textPrimary,
                fontSize: '14px', fontWeight: sel ? '500' : '400',
                transition: 'all 0.15s',
              }}
            >{d}</div>
          );
        })}
      </div>
      <p style={{ fontSize: '11px', color: WC.textMuted, margin: '0 0 10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tijdstip</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {times.map(t => {
          const sel = value.time === t.value;
          return (
            <div
              key={t.value}
              onClick={() => onChange({ ...value, time: t.value })}
              style={{
                padding: '12px 16px', borderRadius: '6px', cursor: 'pointer',
                border: `1.5px solid ${sel ? WC.green : WC.border}`,
                background: sel ? WC.greenLight : WC.white,
                display: 'flex', alignItems: 'center', gap: '12px',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${sel ? WC.green : '#ccc'}`,
                background: sel ? WC.green : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {sel && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: WC.white }} />}
              </div>
              <span style={{ fontSize: '14px', color: sel ? WC.green : WC.textPrimary, fontWeight: sel ? '500' : '400' }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DatePickerMulti ─────────────────────────────────────────────

export function DatePickerMulti({ count, labels, hint, notesField, value, onChange, notesValue, onNotesChange }: {
  count: number; labels: string[]; hint?: string;
  notesField?: { label: string; placeholder: string; required: boolean };
  value: string[]; onChange: (v: string[]) => void;
  notesValue: string; onNotesChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState<number | null>(null);
  return (
    <div>
      {hint && <p style={{ fontSize: '13px', color: WC.textMuted, fontStyle: 'italic', margin: '0 0 18px', lineHeight: 1.5 }}>{hint}</p>}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: WC.textPrimary, marginBottom: '6px' }}>{labels[i]}</div>
          <input
            type="date"
            value={value[i] || ''}
            onChange={e => { const n = [...value]; n[i] = e.target.value; onChange(n); }}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            style={{
              width: '100%', padding: '12px 14px', fontSize: '15px',
              border: `1.5px solid ${focused === i ? WC.green : WC.border}`, borderRadius: '7px',
              outline: 'none', fontFamily: 'Questrial, sans-serif',
              background: WC.white, color: WC.textPrimary, transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
      {notesField && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: WC.textPrimary, marginBottom: '6px' }}>{notesField.label}</div>
          <input
            type="text"
            placeholder={notesField.placeholder}
            value={notesValue}
            onChange={e => onNotesChange(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', fontSize: '15px',
              border: `1.5px solid ${WC.border}`, borderRadius: '7px',
              outline: 'none', fontFamily: 'Questrial, sans-serif', background: WC.white,
              transition: 'border-color 0.15s', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = WC.green)}
            onBlur={e => (e.target.style.borderColor = WC.border)}
          />
        </div>
      )}
    </div>
  );
}

// ─── GuardrailModal ──────────────────────────────────────────────

export function GuardrailModal({ option, onConfirm, onCancel }: {
  option: OptionConfig; onConfirm: () => void; onCancel: () => void;
}) {
  if (!option.guardrail) return null;
  const { checks, fallbackHint } = option.guardrail;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: WC.white, borderRadius: '8px', padding: '40px', maxWidth: '500px', width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: WC.terra, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Even checken</div>
        <h3 style={{ fontSize: '20px', fontWeight: '500', color: WC.green, margin: '0 0 10px', lineHeight: 1.25 }}>
          Past dit profiel echt bij {option.label}?
        </h3>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 22px', lineHeight: 1.6 }}>
          Dit profiel vereist dat alle onderstaande punten van toepassing zijn:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px' }}>
          {checks.map((c, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '14px', color: WC.textPrimary, lineHeight: 1.45 }}>
              <span style={{ color: WC.green, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
              {c}
            </li>
          ))}
        </ul>
        {fallbackHint && (
          <p style={{ fontSize: '13px', color: WC.textMuted, fontStyle: 'italic', margin: '0 0 26px', lineHeight: 1.5 }}>{fallbackHint}</p>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onConfirm} style={{
            flex: 1, padding: '13px', background: WC.green, color: WC.white,
            border: 'none', borderRadius: '7px', fontSize: '15px', cursor: 'pointer',
            fontFamily: 'Questrial, sans-serif', fontWeight: '500',
          }}>
            Ja, dit klopt
          </button>
          <button type="button" onClick={onCancel} style={{
            flex: 1, padding: '13px', background: 'transparent', color: WC.textPrimary,
            border: `1.5px solid ${WC.border}`, borderRadius: '7px', fontSize: '15px',
            cursor: 'pointer', fontFamily: 'Questrial, sans-serif',
          }}>
            Iets anders kiezen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── InlineNote ──────────────────────────────────────────────────

export function InlineNote({ text }: { text: string }) {
  return (
    <div style={{
      padding: '14px 18px', background: 'rgba(26,60,52,0.05)', borderRadius: '7px',
      borderLeft: `3px solid ${WC.green}`, fontSize: '13px', color: '#555',
      lineHeight: 1.65, marginTop: '10px', whiteSpace: 'pre-line',
    }}>{text}</div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────

export function Divider() {
  return <div style={{ height: '1px', background: '#f0f0f0', margin: '32px 0' }} />;
}
