'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

/**
 * Log Report Download (The Security Audit Log)
 * Captures device history, IP, and user identity for full traceability.
 * Backed by Supabase audit_logs table with RLS.
 */
export async function logReportDownload(reportTitle: string) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown Device';
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'localhost';

    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    const logEntry = {
      action: 'PDF_DOWNLOAD',
      report: reportTitle,
      device: userAgent,
      ip_v4: ip,
      status: 'SUCCESS',
      user_id: user?.id ?? null,
    };

    console.log(`[AUDIT-LOG] ${ip} | ${user?.email || 'anon'} | ${reportTitle}`);

    const { error } = await supabase
      .from('audit_logs')
      .insert([logEntry]);

    if (error) {
      console.error('Supabase Audit Log Error:', JSON.stringify(error, null, 2));
      // Graceful fallback — don't block the download
      return { success: true, log: logEntry };
    }

    return { success: true, log: logEntry };
  } catch (error) {
    console.error('Audit Log Error:', error);
    return { success: false };
  }
}
