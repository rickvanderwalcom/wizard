import { WizardFormData } from './types';

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

const fmt = (label: string, value: string | string[] | null | undefined): string => {
  if (!value || (Array.isArray(value) && value.length === 0)) return '';
  const v = Array.isArray(value) ? value.join(', ') : value;
  return `<tr><td style="padding:8px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 12px;color:#1a1a1a;font-size:14px">${v}</td></tr>`;
};

const section = (title: string, rows: string): string => `
  <div style="margin-bottom:28px">
    <div style="font-size:11px;font-weight:600;color:#C4552A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee">${title}</div>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
  </div>`;

function formatShootDate(d: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function buildJeffreyEmail(data: WizardFormData): string {
  const typeLabel = TYPE_LABELS[data.step2b ?? ''] ?? data.step2b ?? '—';
  const shootSlots = data.q8c_slots.length > 0
    ? data.q8c_slots.map((s, i) => `${i + 1}. ${s.dag} · ${s.tijdblok}`).join('<br>')
    : '—';

  const huisstijlValue = (() => {
    if (data.q7a === 'nee') return 'Nee / niet zeker';
    if (!data.q7b) return 'Ja (geen keuze gemaakt)';
    const labels: Record<string, string> = { zelf: 'Heeft zelf', vormgever: 'Vormgever/bureau', websitebouwer: 'Websitebouwer', weet_niet: 'Weet niet' };
    const extra = (data.q7b === 'vormgever' || data.q7b === 'websitebouwer' || data.q7b === 'weet_niet') && data.q7bInputVal
      ? ` — ${data.q7bInputVal}` : '';
    return `${labels[data.q7b] ?? data.q7b}${extra}`;
  })();

  const monthGrid = Object.entries(data.q6b || {})
    .filter(([, v]) => v)
    .map(([m, v]) => `${m}: ${v}`)
    .join(', ');

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:620px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1A3C34;padding:32px 36px">
      <div style="font-size:11px;font-weight:600;color:#C4552A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px">Nieuwe onboarding</div>
      <h1 style="margin:0;font-size:26px;font-weight:500;color:#fff">${data.restaurantName}</h1>
      <p style="margin:6px 0 0;font-size:15px;color:rgba(255,255,255,0.6)">${typeLabel}</p>
    </div>
    <div style="padding:32px 36px">

      ${section('Basisinformatie', [
        fmt('Restaurant', data.restaurantName),
        fmt('Contactpersoon', data.contactName),
        fmt('WhatsApp', data.whatsapp),
        fmt('Adres', `${data.address}, ${data.city}`),
        data.website ? fmt('Website', data.website) : '',
      ].join(''))}

      ${section('Type zaak', [
        fmt('Categorie', data.step2a ?? ''),
        fmt('Formule', typeLabel),
        data.step2c.length ? fmt('Extra tags', data.step2c.join(', ')) : '',
      ].join(''))}

      ${section('Gasten', [
        fmt('Typische gast (top 3)', data.q3a),
        fmt('Waarom zij komen (top 3)', data.q3b),
        fmt('Bezoekmoment', data.q3c),
      ].join(''))}

      ${section('Identiteit', [
        fmt('Grootste trots (top 3)', data.q4a),
        fmt('Uitstraling social media (top 3)', data.q4b),
        data.q4c ? fmt('Over het restaurant', data.q4c) : '',
      ].join(''))}

      ${section('Content prioriteiten', [
        fmt('Laten zien op social (top 3)', data.q5a),
        data.q5b ? fmt('Niet laten zien', data.q5b) : '',
      ].join(''))}

      ${section('Seizoenen', [
        fmt('Cruciale momenten (top 3)', data.q6a),
        monthGrid ? fmt('Druk/rustig per maand', monthGrid) : '',
        data.q6c ? fmt('Eigen jaarlijkse momenten', data.q6c) : '',
      ].join(''))}

      ${section('Huisstijl', [
        fmt('Huisstijl status', huisstijlValue),
      ].join(''))}

      ${section('Planning', [
        fmt('Postdag & tijdstip', `${data.q8a.day ?? '—'} om ${data.q8a.time ?? '—'}`),
        fmt('Shoot voorkeursmomenten', shootSlots),
        data.q8c_notes ? fmt('Bijzonderheden shoot', data.q8c_notes) : '',
      ].join(''))}

    </div>
    <div style="background:#f9f9f9;padding:20px 36px;border-top:1px solid #eee;font-size:12px;color:#999">
      Verstuurd via Onboardingformulier
    </div>
  </div>
</body>
</html>`;
}

export function buildHuisstijlEmail(data: WizardFormData): string {
  const designerEmail = data.q7bInputVal || '(niet ingevuld)';
  const source = data.q7b === 'vormgever' ? 'vormgever/bureau' : 'websitebouwer';
  const shootInfo = data.q8c_slots.length > 0
    ? data.q8c_slots.map((s, i) => `${i + 1}. ${s.dag} · ${s.tijdblok}`).join(', ')
    : '—';

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
    <div style="background:#1A3C34;padding:28px 32px">
      <div style="font-size:11px;font-weight:600;color:#C4552A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px">Huisstijl actie vereist</div>
      <h1 style="margin:0;font-size:22px;font-weight:500;color:#fff">${data.restaurantName}</h1>
    </div>
    <div style="padding:28px 32px">
      <p style="font-size:15px;color:#333;line-height:1.6;margin-top:0">
        De huisstijl bestanden van <strong>${data.restaurantName}</strong> zijn in bezit van hun <strong>${source}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        ${fmt('Emailadres', designerEmail)}
        ${fmt('Restaurant', data.restaurantName)}
        ${fmt('Contactpersoon', data.contactName)}
        ${fmt('WhatsApp', data.whatsapp)}
        ${fmt('Shoot voorkeursdagen', shootInfo)}
      </table>
      <p style="font-size:14px;color:#666;line-height:1.6;margin-top:24px;padding-top:16px;border-top:1px solid #eee">
        Neem contact op met de ${source} om de huisstijl bestanden op te vragen vóór de shoot.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function shouldSendHuisstijlEmail(data: WizardFormData): boolean {
  return data.q7a === 'ja' && (data.q7b === 'vormgever' || data.q7b === 'websitebouwer');
}

// ─── Markdown generator ──────────────────────────────────────────

function formatTop3(items: string[]): string {
  return items.map((item, i) => `${item} #${i + 1}`).join(' · ');
}

export function generateOnboardingMarkdown(data: WizardFormData): string {
  const lines: string[] = [];
  const typeLabel = TYPE_LABELS[data.step2b ?? ''] ?? data.step2b ?? '—';
  const q = (label: string, value: string) => { lines.push(`\n**${label}**\n${value}`); };

  lines.push(`# Onboarding — ${data.restaurantName}`);
  lines.push(`\nGegenereerd: ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}`);

  lines.push(`\n## Basisgegevens`);
  q('Naam van het restaurant', data.restaurantName);
  q('Jouw naam', data.contactName);
  q('WhatsApp nummer', data.whatsapp);
  q('Straat + huisnummer', `${data.address}, ${data.city}`);
  if (data.website) q('Website', data.website);

  lines.push(`\n## Type zaak`);
  q('Waar draait jouw zaak primair om?', data.step2a ?? '—');
  q('Wat past het beste bij jouw formule?', typeLabel);
  if (data.step2c?.length) q('Voeg toe wat extra van toepassing is.', data.step2c.join(', '));

  lines.push(`\n## Gast`);
  q('Wie is jullie typische gast?', formatTop3(data.q3a));
  q('Waarom komen gasten bij jullie en niet bij de concurrent?', formatTop3(data.q3b));
  q('Wanneer bezoeken gasten jullie?', data.q3c.join(', '));

  lines.push(`\n## Identiteit`);
  q('Wat is jullie grootste trots?', formatTop3(data.q4a));
  q('Hoe willen jullie overkomen op social media?', formatTop3(data.q4b));
  if (data.q4c) q('Vertel ons iets over jullie restaurant', data.q4c);

  lines.push(`\n## Content prioriteiten`);
  q('Wat willen jullie het liefst laten zien op social media?', formatTop3(data.q5a));
  if (data.q5b) q('Is er iets wat jullie liever NIET laten zien?', data.q5b);

  lines.push(`\n## Seizoenen en momenten`);
  q('Welke momenten in het jaar zijn cruciaal voor jullie zaak?', formatTop3(data.q6a));
  if (data.q6b) {
    const druk = Object.entries(data.q6b).filter(([, v]) => v === 'druk').map(([k]) => k).join(', ');
    const rustig = Object.entries(data.q6b).filter(([, v]) => v === 'rustig').map(([k]) => k).join(', ');
    const maanden = [druk && `Druk: ${druk}`, rustig && `Rustig: ${rustig}`].filter(Boolean).join('\n');
    if (maanden) q('Wanneer zijn jullie het drukst en wanneer het rustigst?', maanden);
  }
  if (data.q6c) q('Hebben jullie jaarlijks terugkerende momenten die jullie eigen zijn?', data.q6c);

  if (data.q6a2 && Object.keys(data.q6a2).length > 0) {
    lines.push(`\n## Feestdagen en speciale momenten`);
    lines.push(`\n**Relevant voor dit restaurant:**`);
    const ja = Object.entries(data.q6a2).filter(([, v]) => v === 'ja').map(([k]) => k);
    const nee = Object.entries(data.q6a2).filter(([, v]) => v === 'nee').map(([k]) => k);
    if (ja.length > 0) {
      lines.push(`\nJa — standaard video + reminder:`);
      ja.forEach(m => lines.push(`- ${m}`));
    }
    if (nee.length > 0) {
      lines.push(`\nNee — wordt overgeslagen:`);
      nee.forEach(m => lines.push(`- ${m}`));
    }
  }

  lines.push(`\n## Huisstijl`);
  q('Hebben jullie een logo en huisstijl?', data.q7a === 'ja' ? 'Ja' : 'Nee / niet zeker');
  if (data.q7a === 'ja') {
    const huisstijlDetail = (() => {
      if (data.q7b === 'zelf') return 'Eigenaar stuurt bestanden naar huisstijl@tripl3frame.nl';
      if (data.q7b === 'vormgever') return `Vormgever / bureau — ${data.q7bInputVal || '(geen email ingevuld)'}`;
      if (data.q7b === 'websitebouwer') return `Websitebouwer — ${data.q7bInputVal || '(geen email ingevuld)'}`;
      if (data.q7b === 'weet_niet') return `Onbekend — haal op via ${data.q7bInputVal || '(geen website ingevuld)'}`;
      return 'Ja (geen verdere keuze gemaakt)';
    })();
    q('Wie heeft jullie huisstijl bestanden?', huisstijlDetail);
  }

  lines.push(`\n## Planning`);
  q('Op welke dag en tijdstip wil je je wekelijkse video ontvangen via WhatsApp?', `${data.q8a.day ?? '—'} om ${data.q8a.time ?? '—'}`);
  if (data.q8c_slots.length > 0) {
    const slotLines = data.q8c_slots.map((s, i) => `${i + 1}. ${s.dag} · ${s.tijdblok}`).join('\n');
    q('Voorkeursmomenten shoot', slotLines);
  }
  if (data.q8c_notes) q('Is er iets wat we moeten weten voordat we beginnen?', data.q8c_notes);

  return lines.join('\n');
}
