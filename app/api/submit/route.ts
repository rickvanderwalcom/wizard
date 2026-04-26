import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WizardFormData } from '@/lib/types';
import { buildJeffreyEmail, buildHuisstijlEmail, shouldSendHuisstijlEmail, generateOnboardingMarkdown } from '@/lib/submit';
import wizardConfig from '@/lib/wizard-config.json';

const resend = new Resend(process.env.RESEND_API_KEY);
const JEFFREY_EMAIL = process.env.JEFFREY_EMAIL || 'jeffrey@tripl3frame.nl';
const HUISSTIJL_EMAIL = process.env.HUISSTIJL_EMAIL || 'huisstijl@tripl3frame.nl';

export async function POST(req: NextRequest) {
  try {
    const data: WizardFormData = await req.json();

    const subject = wizardConfig.emailNotification.subject.replace(
      '{restaurantName}',
      data.restaurantName || 'Onbekend'
    );

    // Build MD attachment
    const mdContent = generateOnboardingMarkdown(data);
    const mdFilename = `onboarding-${(data.restaurantName || 'restaurant')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')}.md`;

    // Email to Jeffrey with MD attachment
    await resend.emails.send({
      // TODO: vervangen door eigen domein en jeffrey email na livegang
      from: 'Tripl3Frame Wizard <onboarding@resend.dev>',
      // TODO: vervangen door eigen domein en jeffrey email na livegang
      to: 'rickvanderwal.com@gmail.com',
      subject,
      html: buildJeffreyEmail(data),
      attachments: [
        {
          filename: mdFilename,
          content: Buffer.from(mdContent, 'utf-8'),
        },
      ],
    });

    // Conditional huisstijl email
    if (shouldSendHuisstijlEmail(data)) {
      await resend.emails.send({
        // TODO: vervangen door eigen domein en jeffrey email na livegang
        from: 'Tripl3Frame Wizard <onboarding@resend.dev>',
        // TODO: vervangen door eigen domein en jeffrey email na livegang
        to: 'rickvanderwal.com@gmail.com',
        subject: `Huisstijl actie: ${data.restaurantName}`,
        html: buildHuisstijlEmail(data),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
