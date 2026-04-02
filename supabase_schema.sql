-- Supabase SQL Schema for ComplianceShield AI (Phase 3)
-- Run this in your Supabase SQL Editor

-- 1. Create the Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action TEXT NOT NULL,
    report TEXT NOT NULL,
    device TEXT,
    ip_v4 TEXT,
    status TEXT
);

-- Enable Row Level Security (RLS) but allow anonymous inserts (since we don't have auth yet)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for audit logs" 
ON public.audit_logs FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. Create the Compliance Reports Table
CREATE TABLE IF NOT EXISTS public.compliance_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_content TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    industry TEXT
);

-- Enable RLS and allow anonymous inserts
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for compliance reports" 
ON public.compliance_reports FOR INSERT 
TO anon 
WITH CHECK (true);

-- Enable select if user wants to see their own reports by IP (Optional MVP approach)
CREATE POLICY "Allow user to read their own reports by IP" 
ON public.compliance_reports FOR SELECT 
TO anon 
USING (true);
