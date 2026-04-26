import { z } from 'zod';

// ─── Form state ──────────────────────────────────────────────────

export interface DayTimeValue {
  day: string | null;
  time: string | null;
}

export interface WizardFormData {
  // Block 1
  restaurantName: string;
  contactName: string;
  whatsapp: string;
  address: string;
  city: string;
  website: string;
  // Block 2
  step2a: string | null;
  step2b: string | null;
  step2c: string[];
  // Block 3
  q3a: string[];
  q3b: string[];
  q3c: string[];
  // Block 4
  q4a: string[];
  q4b: string[];
  q4c: string;
  // Block 5
  q5a: string[];
  q5b: string;
  // Block 6
  q6a: string[];
  q6b: Record<string, 'druk' | 'rustig' | null>;
  q6c: string;
  // Block 7
  q7a: string | null;
  q7b: string | null;
  q7bInputVal: string;
  q7c: string;
  // Block 8
  addon_twee_videos: boolean;
  q8a: DayTimeValue;
  q8b: DayTimeValue;
  q8c: [string, string, string];
  q8cNotes: string;
  q8d: string;
}

export const INITIAL_FORM_DATA: WizardFormData = {
  restaurantName: '', contactName: '', whatsapp: '', address: '', city: '', website: '',
  step2a: null, step2b: null, step2c: [],
  q3a: [], q3b: [], q3c: [],
  q4a: [], q4b: [], q4c: '',
  q5a: [], q5b: '',
  q6a: [], q6b: {}, q6c: '',
  q7a: null, q7b: null, q7bInputVal: '', q7c: '',
  addon_twee_videos: false,
  q8a: { day: null, time: null },
  q8b: { day: null, time: null },
  q8c: ['', '', ''],
  q8cNotes: '', q8d: '',
};

// ─── Zod block schemas ───────────────────────────────────────────

export const block1Schema = z.object({
  restaurantName: z.string().min(1, 'Vul de naam van het restaurant in.'),
  contactName: z.string().min(1, 'Vul jouw naam in.'),
  whatsapp: z
    .string()
    .min(1, 'Vul een WhatsApp nummer in.')
    .regex(/^\+\d{10}$/, 'WhatsApp nummer moet beginnen met + gevolgd door exact 10 cijfers, bijv. +31612345678.'),
  address: z.string().min(1, 'Vul het straat en huisnummer in.'),
  city: z.string().min(1, 'Vul de plaatsnaam in.'),
  website: z.string().optional(),
});
export type Block1Data = z.infer<typeof block1Schema>;

export const block2Schema = z.object({
  step2a: z.string({ required_error: 'Kies waar jouw zaak primair om draait.' }).min(1),
  step2b: z.string({ required_error: 'Kies de formule die het beste past.' }).min(1),
  step2c: z.array(z.string()),
});
export type Block2Data = z.infer<typeof block2Schema>;

export const block3Schema = z.object({
  q3a: z.array(z.string()).min(1, 'Kies minimaal 1 optie voor "Wie is jullie typische gast?".'),
  q3b: z.array(z.string()).min(1, 'Kies minimaal 1 optie voor "Waarom komen gasten bij jullie?".'),
  q3c: z.array(z.string()).min(1, 'Kies wanneer gasten jullie bezoeken.'),
});
export type Block3Data = z.infer<typeof block3Schema>;

export const block4Schema = z.object({
  q4a: z.array(z.string()).min(1, 'Kies jullie grootste trots (minimaal 1).'),
  q4b: z.array(z.string()).min(1, 'Kies hoe jullie willen overkomen (minimaal 1).'),
  q4c: z.string().optional(),
});
export type Block4Data = z.infer<typeof block4Schema>;

export const block5Schema = z.object({
  q5a: z.array(z.string()).min(1, 'Kies wat jullie willen laten zien (minimaal 1).'),
  q5b: z.string().optional(),
});
export type Block5Data = z.infer<typeof block5Schema>;

export const block6Schema = z.object({
  q6a: z.array(z.string()).min(1, 'Kies minimaal 1 cruciaal moment in het jaar.'),
  q6b: z.record(z.enum(['druk', 'rustig']).nullable()).optional(),
  q6c: z.string().optional(),
});
export type Block6Data = z.infer<typeof block6Schema>;

export const block7Schema = z.object({
  q7a: z.string({ required_error: 'Geef aan of jullie een huisstijl hebben.' }).min(1),
  q7b: z.string().nullable().optional(),
  q7bInputVal: z.string().optional(),
  q7c: z.string().optional(),
});
export type Block7Data = z.infer<typeof block7Schema>;

const dayTimeSchema = z.object({
  day: z.string().nullable(),
  time: z.string().nullable(),
});

export const block8Schema = z.object({
  q8a: dayTimeSchema.refine(v => v.day !== null, { message: 'Kies een dag voor de wekelijkse video.' })
    .refine(v => v.time !== null, { message: 'Kies een tijdstip voor de wekelijkse video.' }),
  q8c: z.tuple([z.string(), z.string(), z.string()])
    .refine(v => v[0].length > 0, { message: 'Kies minimaal één voorkeursdatum voor de shoot.' }),
  q8cNotes: z.string().optional(),
  q8d: z.string().optional(),
});
export type Block8Data = z.infer<typeof block8Schema>;

// ─── Config types (derived from wizard-config.json structure) ────

export interface FieldConfig {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  note?: string;
}

export interface GuardrailConfig {
  checks: string[];
  fallbackHint?: string;
}

export interface TriggersInputConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  inlineNote?: string;
}

export interface OptionConfig {
  value: string;
  label: string;
  description?: string;
  guardrail?: GuardrailConfig;
  inlineNote?: string;
  triggersFollowUp?: string;
  triggersInput?: TriggersInputConfig;
}

export interface TimeOption {
  value: string;
  label: string;
}

export interface QuestionConfig {
  id: string;
  label: string;
  hint?: string;
  type: string;
  required: boolean;
  maxSelect?: number;
  allowCustom?: boolean;
  skippable?: boolean;
  placeholder?: string;
  subPrompts?: string[];
  toneByType?: Record<string, string>;
  options?: (OptionConfig | string)[];
  optionsByType?: Record<string, string[]>;
  subtagAdditions?: Record<string, string[]>;
  months?: string[];
  days?: string[];
  times?: TimeOption[];
  count?: number;
  labels?: string[];
  notesField?: { label: string; placeholder: string; required: boolean };
  conditionalOn?: string;
}

export interface StepConfig extends QuestionConfig {
  question?: string;
  optionsByParent?: Record<string, OptionConfig[]>;
}

export interface BlockConfig {
  id: string;
  title: string;
  subtitle: string;
  note?: string;
  fields?: FieldConfig[];
  steps?: StepConfig[];
  questions?: QuestionConfig[];
}

export interface ProgressStep {
  id: string;
  label: string;
}

export interface WizardConfig {
  meta: { title: string; version: string; estimatedMinutes: number; language: string };
  blocks: BlockConfig[];
  confirmation: {
    title: string;
    subtitle: string;
    summaryFields: string[];
    nextSteps: Array<{ id: string; text: string; conditionalOn?: string }>;
    contact: { label: string; whatsapp: string };
  };
  emailNotification: { to: string; subject: string; fields: string[] };
  progressSteps: ProgressStep[];
}
