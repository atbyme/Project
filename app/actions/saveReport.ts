'use server';

import { checkRateLimit } from '@/lib/rate-limit';
import { checkBotScore } from '@/lib/bot-protection';
import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

export async function saveComplianceReport(reportContent: string, industry: string) {
  try {
    // 1. Bot Protection
    const botCheck = await checkBotScore();
    if (botCheck.isBot) {
      return { success: false, error: 'Access denied: automated request detected.' };
    }

    // 2. Dynamic Rate Limiting
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'localhost';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Guests: 1 per hour | Users: 7 per hour
    const limit = user ? 7 : 1; 
    const limitStatus = await checkRateLimit(ip, limit);
    
    if (!limitStatus.success) {
      return {
        success: false,
        error: user 
          ? 'Limit reached: You have saved 7 reports this hour. Please try again shortly.'
          : 'Trial limit reached: Guests can save 1 report per hour. Please sign in for higher limits (7/hour).',
      };
    }

    // 3. Persist to Supabase
    const userAgent = headersList.get('user-agent') || 'Unknown';

    const { error: dbError } = await supabase.from('compliance_reports').insert([{
      report_content: reportContent,
      ip_address:     ip,
      user_agent:     userAgent,
      industry:       industry || 'General',
      user_id:        user?.id ?? null,
    }]);

    if (dbError) {
      console.error('DB Insert Error:', JSON.stringify(dbError, null, 2));
      throw new Error('Failed to save report to database.');
    }

    return { 
      success: true, 
      message: 'Report saved successfully.',
      meta: {
        industry,
        savedAt: new Date().toISOString()
      }
    };

  } catch (error: any) {
    console.error('Save Report Error:', error);
    return {
      success: false,
      error: `Save failed: ${error.message || 'Unexpected error.'}`,
    };
  }
}
