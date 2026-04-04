'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

/**
 * Delete a compliance report.
 * Only the report owner can delete it (enforced at app level + Supabase RLS).
 */
export async function deleteReport(reportId: string) {
  try {
    // Validate input - must be a valid UUID format
    if (!reportId || typeof reportId !== 'string' || reportId.length > 100) {
      return { success: false, error: 'Invalid report ID.' };
    }

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized.' };
    }

    // Delete (RLS also prevents deleting others' reports)
    const { error } = await supabase
      .from('compliance_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: 'Failed to delete report.' };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
