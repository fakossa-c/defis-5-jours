import { Resend } from 'resend';
import type { BriefData, BriefMetadata } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBriefEmail(brief: BriefData, metadata: BriefMetadata): Promise<void> {
  if (!process.env.NOTIFICATION_EMAIL) {
    throw new Error('NOTIFICATION_EMAIL environment variable is not set');
  }

  const html = formatBriefEmail(brief, metadata);

  await resend.emails.send({
    from: 'Le Defi 5 Jours <onboarding@resend.dev>',
    to: process.env.NOTIFICATION_EMAIL,
    subject: `Nouveau Defi 5 Jours -- ${metadata.company || 'Prospect'}`,
    html,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function briefSection(title: string, content: string): string {
  if (!content) return '';
  return `
    <tr>
      <td style="padding: 16px 24px; border-bottom: 1px solid #eee;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px;">${escapeHtml(title)}</div>
        <div style="font-size: 15px; color: #2A2724; line-height: 1.6;">${escapeHtml(content)}</div>
      </td>
    </tr>`;
}

export function formatBriefEmail(brief: BriefData, metadata: BriefMetadata): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau Defi 5 Jours -- ${escapeHtml(metadata.company)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="background-color: #2A2724; color: #FFFDF9; padding: 24px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a89f97; margin-bottom: 8px;">Nouveau Defi 5 Jours</div>
              <div style="font-size: 24px; font-weight: 700; color: #FFFDF9;">${escapeHtml(metadata.company)}</div>
            </td>
          </tr>

          <tr>
            <td style="padding: 16px 24px; border-bottom: 1px solid #eee; background-color: #fafafa;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 12px;">Informations</div>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #666; width: 100px;">Contact</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #2A2724; font-weight: 500;">${escapeHtml(metadata.contact || '—')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #666;">Secteur</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #2A2724; font-weight: 500;">${escapeHtml(metadata.sector || '—')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #666;">Source</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #2A2724; font-weight: 500;">${escapeHtml(metadata.source || '—')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #666;">Date</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #2A2724; font-weight: 500;">${escapeHtml(formatDate(metadata.timestamp))}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${briefSection('Probleme', brief.problem)}
          ${briefSection('Utilisateurs cibles', brief.users)}
          ${briefSection('Solution actuelle', brief.current_solution)}
          ${briefSection('Resultat attendu', brief.desired_outcome)}
          ${briefSection('Perimetre 5 jours', brief.five_day_scope)}
          ${briefSection('Livrable suggere', brief.suggested_deliverable)}
          ${briefSection('Notes', brief.notes)}

          <tr>
            <td style="background-color: #FFF8EF; padding: 20px 24px; border-radius: 0 0 12px 12px; text-align: center;">
              <div style="font-size: 16px; font-weight: 600; color: #10B981;">→ Repondre sous 24h</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
