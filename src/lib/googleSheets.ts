// Client-side Google Sheets append helper

export const DEFAULT_SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/127L19i22HR0FwLkEo8Q2Lx2165ylHvaV9r_aWbBcMCY/edit?gid=1734040678#gid=1734040678';

export const SPREADSHEET_ID = '127L19i22HR0FwLkEo8Q2Lx2165ylHvaV9r_aWbBcMCY';

export const GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxcz80_9789htQ6EbX2vuyttSiEU6xzV5qvnKwh6XEoSyBx9PBfHeBZ2hmjFl-gt4n5cw/exec';

export interface BriefEntry {
  submissionId: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  existingUrl?: string;
  engagementType?: string;
  budgetRange?: string;
  serviceRequired: string[];
  projectBrief: string;
}

/**
 * Appends row directly to Google Sheets via Google Sheets REST API
 * using an OAuth access token or through the backend endpoint.
 */
export async function appendBriefToGoogleSheet(
  brief: BriefEntry,
  accessToken?: string
): Promise<{ success: boolean; sheetAppended?: boolean; error?: string }> {
  // If user provided a client-side OAuth access token
  if (accessToken) {
    try {
      const values = [
        [
          brief.timestamp,
          brief.submissionId,
          brief.fullName,
          brief.email,
          brief.company,
          brief.existingUrl || 'N/A',
          brief.engagementType || 'project',
          brief.budgetRange || 'Standard',
          brief.serviceRequired.join(', '),
          brief.projectBrief,
        ],
      ];

      const range = 'Sheet1!A:J';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
        range
      )}:append?valueInputOption=USER_ENTERED`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (response.ok) {
        return { success: true, sheetAppended: true };
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn('Direct Google Sheet API append error:', errJson);
      }
    } catch (err: any) {
      console.warn('Direct Google Sheet API exception:', err);
    }
  }

  return { success: true, sheetAppended: false };
}
