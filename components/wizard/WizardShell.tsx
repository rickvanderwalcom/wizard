'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  WizardFormData, INITIAL_FORM_DATA,
  block1Schema, Block1Data,
  block2Schema, Block2Data,
  block3Schema, Block3Data,
  block4Schema, Block4Data,
  block5Schema, Block5Data,
  block6Schema, Block6Data,
  block7Schema, Block7Data,
  block8Schema, Block8Data,
  OptionConfig,
} from '@/lib/types';
import wizardConfigRaw from '@/lib/wizard-config.json';
import { WizardConfig } from '@/lib/types';
const wizardConfig = wizardConfigRaw as unknown as WizardConfig;
import {
  WC, ProgressBar, BlockHeader, SectionLabel, TextInput,
  SingleSelectCards, Top3Select, MultiSelectCards,
  TextareaField, MonthGrid, DayTimeSelect, DatePickerMulti,
  GuardrailModal, InlineNote, Divider,
} from './WizardComponents';

const cfg = wizardConfig;

// ─── Helpers ─────────────────────────────────────────────────────

const getByType = (map: Record<string, string[]>, type: string): string[] =>
  map[type] || map['bistro'] || map['pannenkoeken'] || Object.values(map)[0] || [];

const TYPE_LABELS: Record<string, string> = {
  bistro: 'Bistro', brasserie: 'Brasserie', fine_dining: 'Fine dining',
  gastronomisch: 'Gastronomisch restaurant', pannenkoeken: 'Pannenkoekenhuis',
  thema_eten: 'Themarestaurant', anders_eten: 'Restaurant',
  cafe: 'Café', bar: 'Bar', wijnbar: 'Wijnbar', anders_drinken: 'Horecazaak',
  lunchroom: 'Lunchroom', koffiehuis: 'Koffiehuis', brunch: 'Brunchzaak',
  anders_overdag: 'Dagzaak', fast_casual: 'Fast casual', afhaal: 'Afhaal & bezorging',
  anders_snel: 'Snackbar', thema_beleving: 'Themarestaurant',
  dinner_experience: 'Dinner experience', popup: 'Pop-up concept',
  anders_beleving: 'Belevingsconcept',
};

// ─── NavButtons ──────────────────────────────────────────────────

function NavButtons({ block, total, onPrev, onNext, onSubmit, isSubmitting }: {
  block: number; total: number; onPrev: () => void;
  onNext: () => void; onSubmit: () => void; isSubmitting?: boolean;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '44px', paddingTop: '28px', borderTop: '1px solid #f0f0f0' }}>
      {block > 0 ? (
        <button type="button" onClick={onPrev} style={{
          padding: '12px 22px', background: 'transparent', color: WC.textPrimary,
          border: `1.5px solid ${WC.border}`, borderRadius: '7px', fontSize: '15px',
          cursor: 'pointer', fontFamily: 'Questrial, sans-serif', letterSpacing: '0.01em',
        }}>← Vorige</button>
      ) : <div />}
      {block < total - 1 ? (
        <button type="submit" onClick={onNext} style={{
          padding: '13px 32px', background: WC.green, color: WC.white, border: 'none',
          borderRadius: '7px', fontSize: '15px', cursor: 'pointer',
          fontFamily: 'Questrial, sans-serif', fontWeight: '500', letterSpacing: '0.01em',
        }}>Volgende →</button>
      ) : (
        <button type="submit" onClick={onSubmit} disabled={isSubmitting} style={{
          padding: '13px 32px', background: WC.terra, color: WC.white, border: 'none',
          borderRadius: '7px', fontSize: '15px', cursor: isSubmitting ? 'default' : 'pointer',
          fontFamily: 'Questrial, sans-serif', fontWeight: '500', letterSpacing: '0.01em',
          opacity: isSubmitting ? 0.7 : 1,
        }}>{isSubmitting ? 'Verzenden…' : 'Verzenden'}</button>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div style={{
      marginTop: '24px', padding: '13px 16px',
      background: 'rgba(196,85,42,0.08)', border: `1.5px solid ${WC.terra}`,
      borderRadius: '7px', fontSize: '14px', color: WC.terra,
      display: 'flex', alignItems: 'center', gap: '9px',
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.25" stroke="#C4552A" strokeWidth="1.5" />
        <path d="M8 4.5v4M8 10.5v1" stroke="#C4552A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {message}
    </div>
  );
}

// ─── Block 1 — Basisinformatie ───────────────────────────────────

function Block1({ data, onNext, onPrev, isFirst }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void; isFirst: boolean;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block1Data>({
    resolver: zodResolver(block1Schema),
    defaultValues: {
      restaurantName: data.restaurantName,
      contactName: data.contactName,
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      website: data.website,
    },
  });

  const firstError = Object.values(errors)[0]?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={cfg.blocks[0].title} subtitle={cfg.blocks[0].subtitle} />

      {cfg.blocks[0].fields!.map(f => (
        <Controller
          key={f.id}
          name={f.id as keyof Block1Data}
          control={control}
          render={({ field }) => (
            <TextInput
              label={f.label}
              type={f.type}
              placeholder={f.placeholder}
              value={(field.value as string) || ''}
              onChange={field.onChange}
              required={f.required}
              note={f.note}
            />
          )}
        />
      ))}

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={0} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 2 — Type ──────────────────────────────────────────────

function Block2({ data, onNext, onPrev }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void;
}) {
  const [guardrail, setGuardrail] = useState<OptionConfig | null>(null);
  const [pendingVal, setPendingVal] = useState<string | null>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Block2Data>({
    resolver: zodResolver(block2Schema),
    defaultValues: { step2a: data.step2a ?? undefined, step2b: data.step2b ?? undefined, step2c: data.step2c },
  });

  const step2a = watch('step2a');
  const step2b = watch('step2b');

  const b2 = cfg.blocks[1];
  const step2aConfig = b2.steps![0];
  const step2bConfig = b2.steps![1];
  const step2cConfig = b2.steps![2];

  const b2bOptions = step2a ? ((step2bConfig.optionsByParent as Record<string, OptionConfig[]>)[step2a] || []) : [];

  const handleStep2bChange = (val: string) => {
    const opt = b2bOptions.find(o => o.value === val);
    if (opt?.guardrail) {
      setPendingVal(val);
      setGuardrail(opt);
    } else {
      setValue('step2b', val);
      setValue('step2c', []);
    }
  };

  const firstError = errors.step2a?.message || errors.step2b?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b2.title} subtitle={b2.subtitle} />

      <SectionLabel label={step2aConfig.question!} hint={step2aConfig.hint} required />
      <Controller
        name="step2a"
        control={control}
        render={({ field }) => (
          <SingleSelectCards
            options={step2aConfig.options as OptionConfig[]}
            value={field.value ?? null}
            onChange={v => { field.onChange(v); setValue('step2b', undefined as unknown as string); setValue('step2c', []); }}
          />
        )}
      />

      {step2a && (
        <>
          <Divider />
          <SectionLabel label={step2bConfig.question!} required />
          <Controller
            name="step2b"
            control={control}
            render={({ field }) => (
              <SingleSelectCards
                options={b2bOptions}
                value={field.value ?? null}
                onChange={handleStep2bChange}
              />
            )}
          />
        </>
      )}

      {step2b && (
        <>
          <Divider />
          <SectionLabel label={step2cConfig.question!} hint={`${step2cConfig.hint} (optioneel)`} />
          <Controller
            name="step2c"
            control={control}
            render={({ field }) => (
              <MultiSelectCards
                options={step2cConfig.options as OptionConfig[]}
                value={field.value}
                onChange={field.onChange}
                maxSelect={step2cConfig.maxSelect}
              />
            )}
          />
        </>
      )}

      {guardrail && (
        <GuardrailModal
          option={guardrail}
          onConfirm={() => {
            setValue('step2b', pendingVal!);
            setValue('step2c', []);
            setGuardrail(null);
            setPendingVal(null);
          }}
          onCancel={() => { setGuardrail(null); setPendingVal(null); }}
        />
      )}

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={1} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 3 — Gasten ────────────────────────────────────────────

function Block3({ data, onNext, onPrev, rType }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void; rType: string;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block3Data>({
    resolver: zodResolver(block3Schema),
    defaultValues: { q3a: data.q3a, q3b: data.q3b, q3c: data.q3c },
  });

  const b = cfg.blocks[2];
  const q3a = b.questions![0];
  const q3b = b.questions![1];
  const q3c = b.questions![2];

  const firstError = errors.q3a?.message || errors.q3b?.message || errors.q3c?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} note={b.note} />

      <SectionLabel label={q3a.label} required />
      <Controller
        name="q3a"
        control={control}
        render={({ field }) => (
          <Top3Select options={getByType(q3a.optionsByType!, rType)} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <SectionLabel label={q3b.label} required />
      <Controller
        name="q3b"
        control={control}
        render={({ field }) => (
          <Top3Select options={getByType(q3b.optionsByType!, rType)} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <SectionLabel label={q3c.label} hint={q3c.hint} required />
      <Controller
        name="q3c"
        control={control}
        render={({ field }) => (
          <MultiSelectCards options={q3c.options as string[]} value={field.value} onChange={field.onChange} />
        )}
      />

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={2} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 4 — Identiteit ────────────────────────────────────────

function Block4({ data, onNext, onPrev, rType }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void; rType: string;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block4Data>({
    resolver: zodResolver(block4Schema),
    defaultValues: { q4a: data.q4a, q4b: data.q4b, q4c: data.q4c },
  });

  const b = cfg.blocks[3];
  const q4a = b.questions![0];
  const q4b = b.questions![1];
  const q4c = b.questions![2];

  const firstError = errors.q4a?.message || errors.q4b?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} note={b.note} />

      <SectionLabel label={q4a.label} hint={q4a.hint} required />
      <Controller
        name="q4a"
        control={control}
        render={({ field }) => (
          <Top3Select options={getByType(q4a.optionsByType!, rType)} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <SectionLabel label={q4b.label} hint={q4b.hint} required />
      <Controller
        name="q4b"
        control={control}
        render={({ field }) => (
          <Top3Select options={getByType(q4b.optionsByType!, rType)} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <Controller
        name="q4c"
        control={control}
        render={({ field }) => (
          <TextareaField
            label={q4c.label}
            hint={q4c.hint}
            subPrompts={q4c.subPrompts}
            placeholder={q4c.placeholder}
            toneHint={q4c.toneByType ? q4c.toneByType[rType] : undefined}
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={3} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 5 — Content ───────────────────────────────────────────

function Block5({ data, onNext, onPrev, rType }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void; rType: string;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block5Data>({
    resolver: zodResolver(block5Schema),
    defaultValues: { q5a: data.q5a, q5b: data.q5b },
  });

  const b = cfg.blocks[4];
  const q5a = b.questions![0];
  const q5b = b.questions![1];

  const baseOpts = getByType(q5a.optionsByType!, rType);
  const extraOpts: string[] = [];
  if (q5a.subtagAdditions) {
    data.step2c.forEach(tag => {
      const additions = (q5a.subtagAdditions as Record<string, string[]>)[tag];
      if (additions) extraOpts.push(...additions);
    });
  }
  const allOpts5a = Array.from(new Set([...baseOpts, ...extraOpts]));

  const firstError = errors.q5a?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} note={b.note} />

      <SectionLabel label={q5a.label} hint={q5a.hint} required />
      <Controller
        name="q5a"
        control={control}
        render={({ field }) => (
          <Top3Select options={allOpts5a} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <Controller
        name="q5b"
        control={control}
        render={({ field }) => (
          <TextareaField label={q5b.label} hint={q5b.hint} placeholder={q5b.placeholder} value={field.value || ''} onChange={field.onChange} />
        )}
      />

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={4} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 6 — Seizoenen ─────────────────────────────────────────

function Block6({ data, onNext, onPrev, rType }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void; rType: string;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block6Data>({
    resolver: zodResolver(block6Schema),
    defaultValues: { q6a: data.q6a, q6b: data.q6b, q6c: data.q6c },
  });

  const b = cfg.blocks[5];
  const q6a = b.questions![0];
  const q6b = b.questions![1];
  const q6c = b.questions![2];

  const firstError = errors.q6a?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} note={b.note} />

      <SectionLabel label={q6a.label} hint={q6a.hint} required />
      <Controller
        name="q6a"
        control={control}
        render={({ field }) => (
          <Top3Select options={getByType(q6a.optionsByType!, rType)} value={field.value} onChange={field.onChange} maxSelect={3} allowCustom />
        )}
      />

      <Divider />

      <SectionLabel label={q6b.label} hint={q6b.hint} />
      <Controller
        name="q6b"
        control={control}
        render={({ field }) => (
          <MonthGrid
            months={q6b.months!}
            value={(field.value as Record<string, 'druk' | 'rustig' | null>) || {}}
            onChange={field.onChange}
          />
        )}
      />

      <Divider />

      <Controller
        name="q6c"
        control={control}
        render={({ field }) => (
          <TextareaField label={q6c.label} hint={q6c.hint} placeholder={q6c.placeholder} value={field.value || ''} onChange={field.onChange} />
        )}
      />

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={5} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 7 — Huisstijl ─────────────────────────────────────────

function Block7({ data, onNext, onPrev }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void; onPrev: () => void;
}) {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Block7Data>({
    resolver: zodResolver(block7Schema),
    defaultValues: { q7a: data.q7a ?? undefined, q7b: data.q7b, q7bInputVal: data.q7bInputVal },
  });

  const q7a = watch('q7a');
  const q7b = watch('q7b');

  const b = cfg.blocks[6];
  const q7aConfig = b.questions![0];
  const q7bConfig = b.questions![1];
  const selOpt7b = (q7bConfig.options as OptionConfig[]).find(o => o.value === q7b);
  const firstError = errors.q7a?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} />

      <SectionLabel label={q7aConfig.label} required />
      <Controller
        name="q7a"
        control={control}
        render={({ field }) => (
          <SingleSelectCards
            options={q7aConfig.options as OptionConfig[]}
            value={field.value ?? null}
            onChange={v => { field.onChange(v); setValue('q7b', null); setValue('q7bInputVal', ''); }}
          />
        )}
      />
      {q7a === 'nee' && (
        <InlineNote text={(q7aConfig.options as OptionConfig[]).find(o => o.value === 'nee')?.inlineNote || ''} />
      )}

      {q7a === 'ja' && (
        <>
          <Divider />
          <SectionLabel label={q7bConfig.label} />
          <Controller
            name="q7b"
            control={control}
            render={({ field }) => (
              <SingleSelectCards
                options={q7bConfig.options as OptionConfig[]}
                value={field.value ?? null}
                onChange={v => { field.onChange(v); setValue('q7bInputVal', ''); }}
              />
            )}
          />

          {q7b === 'zelf' && <InlineNote text={selOpt7b?.inlineNote || ''} />}

          {(q7b === 'vormgever' || q7b === 'websitebouwer' || q7b === 'weet_niet') && selOpt7b?.triggersInput && (
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: WC.textPrimary, marginBottom: '7px' }}>
                {selOpt7b.triggersInput.label}
              </div>
              <Controller
                name="q7bInputVal"
                control={control}
                render={({ field }) => (
                  <input
                    type={selOpt7b.triggersInput!.type || 'text'}
                    placeholder={selOpt7b.triggersInput!.placeholder}
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', fontSize: '15px',
                      border: `1.5px solid ${WC.border}`, borderRadius: '7px',
                      outline: 'none', fontFamily: 'Questrial, sans-serif',
                      background: WC.white, transition: 'border-color 0.15s', boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = WC.green)}
                    onBlur={e => (e.target.style.borderColor = WC.border)}
                  />
                )}
              />
              {selOpt7b.triggersInput.inlineNote && <InlineNote text={selOpt7b.triggersInput.inlineNote} />}
            </div>
          )}
        </>
      )}

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={6} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} />
    </form>
  );
}

// ─── Block 8 — Planning ──────────────────────────────────────────

function Block8({ data, onNext, onPrev, isSubmitting }: {
  data: WizardFormData; onNext: (d: Partial<WizardFormData>) => void;
  onPrev: () => void; isSubmitting: boolean;
}) {
  const { control, handleSubmit, formState: { errors } } = useForm<Block8Data>({
    resolver: zodResolver(block8Schema),
    defaultValues: {
      q8a: data.q8a,
      q8c_days: data.q8c_days,
      q8c_dagdeel: data.q8c_dagdeel ?? undefined,
      q8c_notes: data.q8c_notes,
    },
  });

  const b = cfg.blocks[7];
  const q8aConfig = b.questions![0];
  const q8cDaysConfig = b.questions![2];
  const q8cDagdeelConfig = b.questions![3];
  const q8cNotesConfig = b.questions![4];

  const q8aError = (errors.q8a as { message?: string })?.message
    || (errors.q8a as { day?: { message?: string } })?.day?.message
    || (errors.q8a as { time?: { message?: string } })?.time?.message;
  const firstError = q8aError
    || errors.q8c_days?.message
    || (errors.q8c_dagdeel as { message?: string })?.message;

  return (
    <form onSubmit={handleSubmit(d => onNext(d))} noValidate>
      <BlockHeader title={b.title} subtitle={b.subtitle} />

      <SectionLabel label={q8aConfig.label} hint={q8aConfig.hint} required />
      <Controller
        name="q8a"
        control={control}
        render={({ field }) => (
          <DayTimeSelect
            days={q8aConfig.days!}
            times={q8aConfig.times!}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Divider />

      <SectionLabel label={q8cDaysConfig.label} required />
      <Controller
        name="q8c_days"
        control={control}
        render={({ field }) => (
          <MultiSelectCards
            options={q8cDaysConfig.options as string[]}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Divider />

      <SectionLabel label={q8cDagdeelConfig.label} required />
      <Controller
        name="q8c_dagdeel"
        control={control}
        render={({ field }) => (
          <SingleSelectCards
            options={q8cDagdeelConfig.options as OptionConfig[]}
            value={field.value ?? null}
            onChange={field.onChange}
          />
        )}
      />

      <Divider />

      <Controller
        name="q8c_notes"
        control={control}
        render={({ field }) => (
          <TextareaField
            label={q8cNotesConfig.label}
            placeholder={q8cNotesConfig.placeholder}
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />

      {firstError && <ErrorBanner message={firstError} />}
      <NavButtons block={7} total={8} onPrev={onPrev} onNext={() => {}} onSubmit={() => {}} isSubmitting={isSubmitting} />
    </form>
  );
}

// ─── Confirmation ────────────────────────────────────────────────

function Confirmation({ data }: { data: WizardFormData }) {
  const confirmation = cfg.confirmation;
  const dayLabels: Record<string, string> = {
    Maandag: 'maandag', Dinsdag: 'dinsdag', Woensdag: 'woensdag',
    Donderdag: 'donderdag', Vrijdag: 'vrijdag', Zaterdag: 'zaterdag', Zondag: 'zondag',
  };
  const postDay = dayLabels[data.q8a.day ?? ''] || '—';
  const postTime = data.q8a.time || '—';
  const dagdeelLabels: Record<string, string> = { middag: 'Middag', avond: 'Avond', middag_avond: 'Middag + Avond' };
  const shootSummary = [
    data.q8c_days.join(', ') || '—',
    data.q8c_dagdeel ? `· ${dagdeelLabels[data.q8c_dagdeel] ?? data.q8c_dagdeel}` : '',
  ].filter(Boolean).join(' ');
  const huisstijlActie = data.q7a === 'ja' && data.q7b === 'zelf';

  const steps = [
    confirmation.nextSteps[0],
    ...(huisstijlActie ? [confirmation.nextSteps[1]] : []),
    confirmation.nextSteps[2],
    confirmation.nextSteps[3],
  ].filter(Boolean);

  const fill = (str: string) =>
    str
      .replace('{contactName}', data.contactName || 'u')
      .replace('{restaurantName}', data.restaurantName || 'uw restaurant')
      .replace('{postDay}', postDay)
      .replace('{postTime}', postTime);

  return (
    <div style={{
      minHeight: '100vh', background: WC.green,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', fontFamily: 'Questrial, sans-serif',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ marginBottom: '48px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="8" fill="rgba(255,255,255,0.12)" />
            <path d="M12 16h24M12 24h16M12 32h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '600', color: WC.terra, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Ingediend
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '500', color: WC.white, margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
          {fill(confirmation.title)}
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', margin: '0 0 48px', lineHeight: 1.5 }}>
          {fill(confirmation.subtitle)}
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px 28px',
          marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
        }}>
          {[
            { label: 'Restaurant', value: data.restaurantName || '—' },
            { label: 'Type', value: TYPE_LABELS[data.step2b ?? ''] ?? data.step2b ?? '—' },
            { label: 'Postdag', value: `${postDay} · ${postTime}`, capitalize: true },
            { label: 'Shoot voorkeur', value: shootSummary },
          ].map(({ label, value, capitalize }) => (
            <div key={label}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>{label}</div>
              <div style={{ fontSize: '16px', color: WC.white, fontWeight: '500', textTransform: capitalize ? 'capitalize' : 'none' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
            Volgende stappen
          </div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '600',
              }}>{i + 1}</div>
              <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, paddingTop: '3px' }}>
                {fill(step.text)}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '28px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {confirmation.contact.label}{' '}
            <span style={{ color: WC.terra, fontWeight: '500' }}>{confirmation.contact.whatsapp}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── WizardShell ─────────────────────────────────────────────────

export default function WizardShell() {
  const [block, setBlock] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const rType = formData.step2b || 'pannenkoeken';

  const merge = (partial: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...partial }));
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNext = (blockData: Partial<WizardFormData>) => {
    merge(blockData);
    scrollTop();
    setBlock(b => Math.min(b + 1, 7));
  };

  const handlePrev = () => {
    scrollTop();
    setBlock(b => Math.max(b - 1, 0));
  };

  const handleSubmit = async (blockData: Partial<WizardFormData>) => {
    const finalData = { ...formData, ...blockData };
    merge(blockData);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error('Verzenden mislukt. Probeer het opnieuw.');
      scrollTop();
      setFormData(finalData);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return <Confirmation data={formData} />;

  const progressSteps = cfg.progressSteps;

  const blockProps = { data: formData, onPrev: handlePrev, rType };

  return (
    <div style={{ minHeight: '100vh', background: WC.bg, fontFamily: 'Questrial, sans-serif' }}>
      <ProgressBar steps={progressSteps} currentStep={block} />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Brand strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="5" fill={WC.green} />
            <path d="M7 9h14M7 14h9M7 19h11" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: '500', color: WC.green, letterSpacing: '0.02em' }}>Onboardingformulier</span>
          <span style={{ fontSize: '13px', color: WC.textLight, marginLeft: 'auto' }}>~{cfg.meta.estimatedMinutes} min</span>
        </div>

        {/* Card */}
        <div style={{
          background: WC.white, borderRadius: '8px', padding: '48px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        }}>
          {block === 0 && <Block1 {...blockProps} onNext={handleNext} isFirst />}
          {block === 1 && <Block2 {...blockProps} onNext={handleNext} />}
          {block === 2 && <Block3 {...blockProps} onNext={handleNext} />}
          {block === 3 && <Block4 {...blockProps} onNext={handleNext} />}
          {block === 4 && <Block5 {...blockProps} onNext={handleNext} />}
          {block === 5 && <Block6 {...blockProps} onNext={handleNext} />}
          {block === 6 && <Block7 {...blockProps} onNext={handleNext} />}
          {block === 7 && <Block8 {...blockProps} onNext={handleSubmit} isSubmitting={isSubmitting} />}

          {submitError && <ErrorBanner message={submitError} />}
        </div>

        {/* Footer hint */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: WC.textLight, marginTop: '20px' }}>
          Stap {block + 1} van 8 · Alle gegevens worden vertrouwelijk behandeld
        </p>
      </div>
    </div>
  );
}
