'use server';

import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';

export async function deleteReport(reportId: string) {
  try {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized. Please log in.");

    // Secure Delete (RLS will also prevent deleting others' reports)
    const { error } = await supabase
      .from('compliance_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Refresh Dashboard
    revalidatePath('/dashboard');
    return { success: true };

  } catch (error: any) {
    console.error('Delete Action Error:', error);
    return { success: false, error: error.message };
  }
}
