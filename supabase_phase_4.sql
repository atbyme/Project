-- Supabase Phase 4: Authentication Security Support
-- Run this securely in the Supabase SQL Editor

-- 1. Add User Link to compliance reports
ALTER TABLE public.compliance_reports 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Add User Link to audit logs
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. Update Row Level Security Policies
-- Drop old anonymous access
DROP POLICY IF EXISTS "Allow user to read their own reports by IP" ON public.compliance_reports;

-- New Authenticated Policies (You can only read your OWN reports)
CREATE POLICY "Users can view their own reports"
ON public.compliance_reports FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
