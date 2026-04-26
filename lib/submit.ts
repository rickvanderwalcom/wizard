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
  const shootDates = [data.q8c[0], data.q8c[1], data.q8c[2]]
    .filter(Boolean)
    .map((d, i) => `Voorkeur ${i + 1}: ${formatShootDate(d)}`)
    .join('<br>');

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
        data.q7c ? fmt('Stijlinspiratie', data.q7c) : '',
      ].join(''))}

      ${section('Planning', [
        fmt('Postdag & tijdstip', `${data.q8a.day ?? '—'} om ${data.q8a.time ?? '—'}`),
        fmt('Shootdatums', shootDates || '—'),
        data.q8cNotes ? fmt('Bijzonderheden shoot', data.q8cNotes) : '',
        data.q8d ? fmt('Overige opmerkingen', data.q8d) : '',
      ].join(''))}

    </div>
    <div style="background:#f9f9f9;padding:20px 36px;border-top:1px solid #eee;font-size:12px;color:#999">
      Verstuurd via Tripl3Frame Onboarding Wizard
    </div>
  </div>
</body>
</html>`;
}

export function buildHuisstijlEmail(data: WizardFormData): string {
  const designerEmail = data.q7bInputVal || '(niet ingevuld)';
  const source = data.q7b === 'vormgever' ? 'vormgever/bureau' : 'websitebouwer';
  const shootDate = data.q8c[0] ? formatShootDate(data.q8c[0]) : '(nog niet gepland)';

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
        ${fmt('Shoot voorkeur 1', shootDate)}
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

  lines.push(`# Onboarding — ${data.restaurantName}`);
  lines.push(`\nGegenereerd: ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}`);

  lines.push(`\n## Basisgegevens`);
  lines.push(`- Restaurant: ${data.restaurantName}`);
  lines.push(`- Contact: ${data.contactName}`);
  lines.push(`- WhatsApp: ${data.whatsapp}`);
  lines.push(`- Adres: ${data.address}, ${data.city}`);
  if (data.website) lines.push(`- Website: ${data.website}`);

  lines.push(`\n## Type`);
  lines.push(`- Hoofdfocus: ${data.step2a ?? '—'}`);
  lines.push(`- Type: ${typeLabel}`);
  if (data.step2c?.length) lines.push(`- Subtags: ${data.step2c.join(', ')}`);

  lines.push(`\n## Gast`);
  lines.push(`- Typische gast: ${formatTop3(data.q3a)}`);
  lines.push(`- Waarom zij: ${formatTop3(data.q3b)}`);
  lines.push(`- Momenten: ${data.q3c.join(', ')}`);

  lines.push(`\n## Identiteit`);
  lines.push(`- Grootste trots: ${formatTop3(data.q4a)}`);
  lines.push(`- Uitstraling: ${formatTop3(data.q4b)}`);
  if (data.q4c) lines.push(`- Verhaal & gastcomplimenten:\n  ${data.q4c}`);

  lines.push(`\n## Content prioriteiten`);
  lines.push(`- Tonen: ${formatTop3(data.q5a)}`);
  if (data.q5b) lines.push(`- Niet tonen: ${data.q5b}`);

  lines.push(`\n## Seizoenen`);
  lines.push(`- Cruciale momenten: ${formatTop3(data.q6a)}`);
  if (data.q6b) {
    const druk = Object.entries(data.q6b).filter(([, v]) => v === 'druk').map(([k]) => k).join(', ');
    const rustig = Object.entries(data.q6b).filter(([, v]) => v === 'rustig').map(([k]) => k).join(', ');
    if (druk) lines.push(`- Drukste maanden: ${druk}`);
    if (rustig) lines.push(`- Rustigste maanden: ${rustig}`);
  }
  if (data.q6c) lines.push(`- Eigen momenten: ${data.q6c}`);

  lines.push(`\n## Huisstijl`);
  if (data.q7a === 'nee') {
    lines.push(`- Status: Geen huisstijl — Tripl3Frame bouwt op basis van type`);
  } else {
    if (data.q7b === 'zelf') {
      lines.push(`- Status: Eigenaar stuurt bestanden naar huisstijl@tripl3frame.nl`);
    } else if (data.q7b === 'vormgever') {
      lines.push(`- Status: Vormgever — ${data.q7bInputVal || '(geen email ingevuld)'}`);
    } else if (data.q7b === 'websitebouwer') {
      lines.push(`- Status: Websitebouwer — ${data.q7bInputVal || '(geen email ingevuld)'}`);
    } else if (data.q7b === 'weet_niet') {
      lines.push(`- Status: Onbekend — haal op via ${data.q7bInputVal || '(geen website ingevuld)'}`);
    } else {
      lines.push(`- Status: Ja (geen verdere keuze gemaakt)`);
    }
  }
  if (data.q7c) lines.push(`- Visuele inspiratie: ${data.q7c}`);

  lines.push(`\n## Planning`);
  lines.push(`- Postdag: ${data.q8a.day ?? '—'} om ${data.q8a.time ?? '—'}`);
  lines.push(`- Shootvoorkeur 1: ${data.q8c[0] ? formatShootDate(data.q8c[0]) : '—'}`);
  if (data.q8c[1]) lines.push(`- Shootvoorkeur 2: ${formatShootDate(data.q8c[1])}`);
  if (data.q8c[2]) lines.push(`- Shootvoorkeur 3: ${formatShootDate(data.q8c[2])}`);
  if (data.q8cNotes) lines.push(`- Bijzonderheden shoot: ${data.q8cNotes}`);
  if (data.q8d) lines.push(`- Laatste opmerkingen: ${data.q8d}`);

  return lines.join('\n');
}
