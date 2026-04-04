'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

/**
 * Log Report Download
 * Captures device, IP, and user identity for audit traceability.
 * Backed by Supabase audit_logs table with RLS.
 */
export async function logReportDownload(reportTitle: string) {
  try {
    // Validate and sanitize input
    if (!reportTitle || typeof reportTitle !== 'string') {
      return { success: false };
    }

    const sanitizedTitle = reportTitle.trim().slice(0, 200);

    const headersList = await headers();
    const userAgent = (headersList.get('user-agent') || 'Unknown Device').slice(0, 500);
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const logEntry = {
      action: 'PDF_DOWNLOAD',
      report: sanitizedTitle,
      device: userAgent,
      ip_v4: ip,
      status: 'SUCCESS',
      user_id: user?.id ?? null,
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert([logEntry]);

    if (error) {
      // Graceful fallback - don't block the download
      return { success: true, log: logEntry };
    }

    return { success: true, log: logEntry };
  } catch {
    return { success: false };
  }
}
